import * as THREE from "three";
import { MyPrimitiveBuilder } from "./MyPrimitiveBuilder.js";
import { MyLightBuilder } from "./MyLightBuilder.js";
import { MyTransformations } from "./MyTransformations.js";
import { MyCameraBuilder } from "./MyCameraBuilder.js";

/** @typedef {{ transformations: MyTransformations, activeMaterials: string[] }} ParsingContext */

export class MyParser {
    /**
     * @param {import('./parser/MySceneData.js').MySceneData} data
     */
    constructor(data) {
        this.data = data;

        this.primitiveBuilder = new MyPrimitiveBuilder();
        this.lightBuilder = new MyLightBuilder();
        this.cameraBuilder = new MyCameraBuilder();
        
        /** @type {Map<string, THREE.Texture>} */
        this.textures = new Map();

        /** @type {Map<string, THREE.MeshPhongMaterial>} */
        this.materials = new Map();

        /** @type {THREE.Camera[]} */
        this.cameras = [];
        this.activeCamera = data.activeCameraId;

        /** @type {THREE.Light[]} */
        this.lights = [];

        /** @type {THREE.Object3D[]} */
        this.objects = [];

        console.log({data})
    }
    
    parse() {
        this.#initCameras();
        
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

        const rootNodeId = this.data.rootId;
        const rootNode = this.data.nodes[rootNodeId];

        this.#visit(rootNode, {
            transformations: new MyTransformations(),
            activeMaterials: [],
        });

        return this.objects;
    }
    
    #initCameras() {
        const cameras = this.data.cameras;
        for (const [_, camera] of Object.entries(cameras)) {
            
            // const buildRepresenation = this.cameraBuilder.buildRepresentation(camera);
            // this.cameras.set()

        }
    }

    #initTextures() {
        const textures = this.data.textures;

        const loader = new THREE.TextureLoader();
        // const videoLoader = new THREE.VideoTexture()
        
        for (const [_, textureSpec] of Object.entries(textures)) {
            const {
                anisotropy,
                custom,
                filepath,
                id,
                isVideo,
                magFilter,
                minFilter,
                mipmaps
            } = textureSpec;

            console.log(textureSpec)

            const texture = loader.load(filepath, (tex) => {
                tex.anisotropy = anisotropy;
                tex.name = id;
                tex.magFilter = magFilter;
                tex.minFilter = minFilter;
                tex.mipmaps = mipmaps;
            });

            this.textures.set(id, texture);
        }
    }

    #initMaterials() {
        const materials = this.data.materials;

        for (const [_, materialSpec] of Object.entries(materials)) {
            const {
                bump_ref,
                bump_scale,
                color,
                custom,
                emissive,
                id,
                shading,
                shininess,
                specular,
                texlength_s,
                texlength_t,
                textureref,
                twosided,
                wireframe
            } = materialSpec;

            const texture = this.textures.get(textureref)?.clone();
            if (!!texture) {
                // texture.mapping
                
            }
            // FIXME: use texlength_s and texlength_t
            // FIXME: use shading

            console.log(materialSpec)
            const material = new THREE.MeshPhongMaterial({
                color,
                emissive,
                shininess,
                specular,
                map: texture,
                side: twosided ? THREE.DoubleSide : THREE.FrontSide,
                wireframe,
            });

            this.materials.set(materialSpec.id, material);
        }

        return materials;
    }
    
    /**
     * @param {ParsingContext} ctx
     */
    #visit(member, ctx) {
        if (member.type === "primitive") return this.#visitPrimitive(member, ctx);
        if (member.type === "node") return this.#visitNode(member, ctx);
        
        this.#visitLight(member, ctx)
    }

    /**
     * @param {ParsingContext} ctx
    */
    #visitNode(node, ctx) {
        if (node.type !== "node")
            throw new Error("Object is not a node");

        const { children, custom, materialIds, transformations } = node;

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
            this.#visit(child, newCtx);
        }
    }

    /**
     * @param {ParsingContext} ctx
     */
    #visitLight(light, ctx) {
        const builtRepresentation = this.lightBuilder.buildRepresentation(light);
        this.objects.push(builtRepresentation);
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
            this.objects.push(builtRepresentation);
        }
    }
}
