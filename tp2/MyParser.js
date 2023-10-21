import * as THREE from "three";
import { MyPrimitiveBuilder } from "./MyPrimitiveBuilder.js";
import { MyLightBuilder } from "./MyLightBuilder.js";

/** @typedef {{ worldMatrix: THREE.Matrix4, activeMaterials: string[] }} ParsingContext */

/** @typedef {{ type: "T", translate: [number, number, number] }} TranslationTransformation */
/** @typedef {{ type: "R", rotation: [number, number, number] }} RotationTransformation */
/** @typedef {{ type: "S", scale: [number, number, number] }} ScaleTransformation */
/** @typedef { TranslationTransformation | RotationTransformation | ScaleTransformation } Transformation */

const degreesToRadians = Math.PI / 180;

export class MyParser {
    constructor(data) {
        this.nodeData = data.nodes;
        this.materialData = data.materials;
        this.textureData = data.textures;

        this.primitiveBuilder = new MyPrimitiveBuilder();
        this.lightBuilder = new MyLightBuilder();
        
        /** @type {Map<string, THREE.Texture>} */
        this.textures = new Map();

        /** @type {Map<string, THREE.MeshPhongMaterial>} */
        this.materials = new Map();
        
        /** @type {THREE.Object3D[]} */
        this.visitedNodes  = [];
    }
    
    visitNodes() {
        this.#initTextures();
        this.#initMaterials();


        /*
			{name: "id", type: "string"},
			{name: "color", type: "rgba"},
			{name: "specular", type: "rgba"},
			{name: "emissive", type: "rgba"},
			{name: "shininess", type: "float"},
			{name: "wireframe", type: "boolean", required: false, default: false},
			{name: "shading", type: "item", required: false, choices: ["none","flat","smooth"], default: "smooth"},
			{name: "textureref", type: "string", required: false, default: null},
			{name: "texlength_s", type: "float", required: false, default: 1.0},
			{name: "texlength_t", type: "float", required: false, default: 1.0},
            {name: "twosided", type: "boolean", required: false, default: false},
        */

        this.#visitNode(this.nodeData["scene"], {
            worldMatrix: new THREE.Matrix4(),
            activeMaterials: [],
        });

        return this.visitedNodes;
    }

    #initTextures() {
        const loader = new THREE.TextureLoader();
        
        for (const [id, textureSpec] of Object.entries(this.textureData)) {
            const { filepath } = textureSpec;
            const texture = loader.load(filepath);
            this.textures.set(id, texture);
        }
    }

    #initMaterials() {
        /** @type {Record<string, THREE.MeshPhongMaterial>} */
        const materials = {};
        console.log(this.materialData)

        for (const [id, materialSpec] of Object.entries(this.materialData)) {
            const {
                color,
                custom,
                emissive,
                shading,
                shininess,
                specular,
                textureref,
                texlength_s,
                texlength_t,
                twosided,
                wireframe
            } = materialSpec;

            const material = new THREE.MeshPhongMaterial({
                color,
                emissive,
                shininess,
                specular,
            });

            this.materials.set(id, material);

            
            console.log({id, materialSpec})
        }

        return materials;
    }

    /**
     * @param {ParsingContext} ctx
     */
    #visitNode(node, ctx) {
        if (node.type !== "node")
            throw new Error("Object is not a node");

        const { children, custom, materialIds, transformations } = node;
        // console.log("MyParser##visitNode", {materialIds})

        const newCtx = this.#applyTransformations(ctx, transformations);
        if (materialIds.length > 0)
            newCtx.activeMaterials = materialIds;
            
        for (const child of children) {
            this.#visitChild(child, newCtx);
        }
    }

    /**
     * @param {ParsingContext} ctx
     */
    #visitChild(child, ctx) {
        if (child.type === "primitive") return this.#visitPrimitive(child, ctx);
        
		let lightIds = ["spotlight", "pointlight", "directionallight"]
        
        if (lightIds.includes(child.type)) return this.#visitLight(child)

        const node = this.nodeData[child.id];
        if (!node) return null;

        this.#visitNode(node, ctx);
    }

    #visitLight(light) {
        console.log("LIGHT", light);

		let lightIds = ["spotlight", "pointlight", "directionallight"]

        if (lightIds.includes(light))
            throw new Error("Object is not a light");
    
        
        const builtRepresentation = this.lightBuilder.buildRepresentation(light);
        this.visitedNodes.push(builtRepresentation);
    }

    /**
     * @param {ParsingContext} ctx
     */
    #visitPrimitive(primitive, ctx) {
        if (primitive.type !== "primitive")
            throw new Error("Object is not a primitive");

        const primitiveContext = {
            ...ctx,
            activeMaterials: ctx.activeMaterials.map(id => this.materials.get(id)),
        }

        console.log("MyParser##visitPrimitive", {activeMaterials: ctx.activeMaterials})
        
        for (const representation of primitive.representations) {
            const builtRepresentation = this.primitiveBuilder.buildRepresentation(representation, primitiveContext);
            this.visitedNodes.push(builtRepresentation);
        }
    }
    
    /**
     * @param {ParsingContext} ctx
     * @param {Transformation[]} transformations
     * @returns {ParsingContext}
     */
    #applyTransformations(ctx, transformations) {
        const { worldMatrix } = ctx;

        const newWorldMatrix = worldMatrix.clone();

        for (const transformation of transformations) {
            cfgTransformation(worldMatrix, transformation);
        }

        return {
            ...ctx,
            worldMatrix: newWorldMatrix,
        };
    }
}

/**
 * @param {THREE.Matrix4} newWorldMatrix
 * @param {Transformation} transformation
 */
function cfgTransformation(newWorldMatrix, transformation) {
    switch (transformation.type) {
        case "T":
            console.log("TRANSLATION", transformation.translate)
            const translate = new THREE.Matrix4().makeTranslation(...transformation.translate);
            newWorldMatrix.premultiply(translate);
            
            break;

        case "R":
            console.log("ROTATION", transformation.rotation)
            /** @type {[number, number, number]} */
            const rotationInRadians = [
                transformation.rotation[0] * degreesToRadians,
                transformation.rotation[1] * degreesToRadians,
                transformation.rotation[2] * degreesToRadians,
            ];

            console.log("ROTATIONRAD", rotationInRadians)

            const rotation = new THREE.Euler(...rotationInRadians, "XYZ");
            const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(rotation);

            newWorldMatrix.premultiply(rotationMatrix);
            break;

        case "S":
            console.log("SCALE", transformation.scale)
            const scale = new THREE.Matrix4().makeScale(...transformation.scale);
            newWorldMatrix.premultiply(scale);
            break;
    }
}

/**
 * @param {THREE.Matrix4} newWorldMatrix
 * @param {Transformation} transformation
 */
function threeTransformation(newWorldMatrix, transformation) {
    switch (transformation.type) {
        case "T":
            const translate = new THREE.Vector3(...transformation.translate);
            
            // Position
            newPosition.add(translate);

            // Rotation is not affected by translation
            // Scale is not affected by translation
            
            break;

        case "R":
            /** @type {[number, number, number]} */
            const rotationInRadians = [
                transformation.rotation[0] * degreesToRadians,
                transformation.rotation[1] * degreesToRadians,
                transformation.rotation[2] * degreesToRadians,
            ];

            const rotation = new THREE.Euler(...rotationInRadians, "XYZ");

            newRotation.x += rotation.x;
            newRotation.y += rotation.y;
            newRotation.z += rotation.z;
            break;

        case "S":

            const scale = new THREE.Vector3(...transformation.scale);
            newScale.multiply(scale)

            break;
    }
}