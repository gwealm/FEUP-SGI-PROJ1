import * as THREE from "three";
import { MyPrimitiveBuilder } from "./MyPrimitiveBuilder.js";
import { MyLightBuilder } from "./MyLightBuilder.js";
import { MyTransformations } from "./MyTransformations.js";

/** @typedef {{ transformations: MyTransformations, activeMaterials: string[] }} ParsingContext */

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
            transformations: new MyTransformations(),
            activeMaterials: [],
        });

        return this.visitedNodes;
    }

    #initTextures() {
        const loader = new THREE.TextureLoader();
        
        for (const [id, textureSpec] of Object.entries(this.textureData)) {
            const { filepath } = textureSpec;

            const texture = loader.load(filepath);
            texture.name = id;
            
            this.textures.set(id, texture);
        }
    }

    #initMaterials() {
        /** @type {Record<string, THREE.MeshPhongMaterial>} */
        const materials = {};
        

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

            const texture = this.textures.get(textureref)?.clone();
            // FIXME: use texlength_s and texlength_t
            // FIXME: use shading

            console.log({wireframe})
            const material = new THREE.MeshPhongMaterial({
                color,
                emissive,
                shininess,
                specular,
                map: texture,
                side: twosided ? THREE.DoubleSide : THREE.FrontSide,
                wireframe,
            });

            this.materials.set(id, material);
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
        // 

        /** @type {ParsingContext} */
        const newCtx = {
            transformations: transformations.length === 0
                ? ctx.transformations
                : ctx.transformations.applyTransformations(transformations),

            activeMaterials: materialIds.length === 0
                ? ctx.activeMaterials
                : materialIds,
        }
            
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
        
        console.log(child)
        if (lightIds.includes(child.type)){
            console.log("included")
            return this.#visitLight(child)
        }

        console.log("not included")

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

        /** @type {import("./MyPrimitiveBuilder.js").PrimitiveContext} */
        const primitiveContext = {
            worldMatrix: ctx.transformations.toMatrix4(),
            activeMaterials: ctx.activeMaterials.map(id => this.materials.get(id)),
        }

        
        
        for (const representation of primitive.representations) {
            const builtRepresentation = this.primitiveBuilder.buildRepresentation(representation, primitiveContext);
            this.visitedNodes.push(builtRepresentation);
        }
    }
}
