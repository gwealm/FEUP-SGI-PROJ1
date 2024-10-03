import * as THREE from "three";
import { MyPrimitiveBuilder } from "./MyPrimitiveBuilder.js";
import { MyLightBuilder } from "./MyLightBuilder.js";
import { MyTransformationsBuilder } from "./MyTransformationsBuilder.js";
import { MyCameraBuilder } from "./MyCameraBuilder.js";
import { MySkyboxBuilder } from "./MySkyBoxBuilder.js";
import { MyTextureBuilder } from "./MyTextureBuilder.js";
import { MyMaterialBuilder } from "./MyMaterialBuilder.js";

/** @typedef {{ activeMaterials: string[], receiveShadows: boolean, castShadows: boolean, withinLod: boolean }} ParsingContext */

/**
 * Scene graph parser for converting custom scene data into a THREE.Scene object.
 */
export class MyParser {
    /**
     * Creates a new MyParser instance with the given data.
     *
     * @param {import('./types').SceneGraph.Data} data - The scene graph data.
     */
    constructor(data) {
        console.log(data);
        this.data = data;

        /** @type {import('./types').CustomEventDispatcher} */
        this.eventDispatcher = new THREE.EventDispatcher();

        this.transformationsBuilder = new MyTransformationsBuilder();
        this.textureBuilder = new MyTextureBuilder();
        this.materialBuilder = new MyMaterialBuilder(this.eventDispatcher);
        this.lightBuilder = new MyLightBuilder(this.eventDispatcher);
        this.cameraBuilder = new MyCameraBuilder();
        this.primitiveBuilder = new MyPrimitiveBuilder(this.materialBuilder);
        this.skyboxBuilder = new MySkyboxBuilder();

        /** @type {Map<string, THREE.Texture>} */
        this.textures = new Map();

        /** @type {Map<string, THREE.MeshPhongMaterial>} */
        this.materials = new Map();

        /** @type {Map<string, THREE.Mesh>} */
        this.skyboxes = new Map();

        /** @type {Map<string, THREE.Camera>} */
        this.cameras = new Map();
        this.activeCameraId = data.activeCameraId;

        /** @type {Map<string, boolean>} */
        this.initialLightStates = new Map();
    }

    /**
     * Parses the scene graph data and returns a THREE.Object3D object.
     *
     * @returns {{ scene: THREE.Object3D, eventDispatcher: import('./types').CustomEventDispatcher }}
     */
    parse() {
        this.#initCameras();

        this.#initTextures();
        this.#initMaterials();
        this.#initSkyboxes();

        const rootNodeId = this.data.rootId;
        const rootNode = this.data.nodes[rootNodeId];

        const scene = new THREE.Group();

        if (this.skyboxes.size > 0) scene.add(...this.skyboxes.values());

        scene.add(
            this.#visit(rootNode, {
                activeMaterials: [],
                receiveShadows: false,
                castShadows: false,
                withinLod: false,
            })
        );

        return { scene, eventDispatcher: this.eventDispatcher };
    }

    /**
     * Prepares the given scene by setting background, ambient light, and fog.
     *
     * @param {THREE.Scene} scene - The scene to prepare.
     */
    prepareScene(scene) {
        const options = this.data.options;
        scene.background = options.background;
        scene.add(new THREE.AmbientLight(options.ambient));

        const fog = this.data.fog;
        scene.fog = new THREE.Fog(fog.color, fog.near, fog.far);
    }

    /**
     * Initializes cameras based on the provided camera specifications.
     */
    #initCameras() {
        const cameras = this.data.cameras;
        for (const [_, cameraSpec] of Object.entries(cameras)) {
            const camera = this.cameraBuilder.buildCamera(cameraSpec);
            this.cameras.set(cameraSpec.id, camera);
        }
    }

    /**
     * Initializes textures based on the provided texture specifications.
     */
    #initTextures() {
        const textures = this.data.textures;
        for (const [_, textureSpec] of Object.entries(textures)) {
            const texture = this.textureBuilder.buildTexture(textureSpec);
            this.textures.set(textureSpec.id, texture);
        }
    }

    /**
     * Initializes materials based on the provided material specifications.
     */
    #initMaterials() {
        const materials = this.data.materials;

        for (const [_, materialSpec] of Object.entries(materials)) {
            const material = this.materialBuilder.buildMaterial(
                materialSpec,
                this.textures
            );
            this.materials.set(materialSpec.id, material);
        }
    }

    /**
     * Initializes skyboxes based on the provided skybox specifications.
     */
    #initSkyboxes() {
        const skyboxes = this.data.skyboxes;
        for (const [_, skyboxSpec] of Object.entries(skyboxes)) {
            const skybox = this.skyboxBuilder.buildSkybox(skyboxSpec);
            this.skyboxes.set(skyboxSpec.id, skybox);
        }
    }

    /**
     * Visits a node in the scene graph and returns a THREE.Object3D representing the node.
     *
     * @param {import('./types').SceneGraph.Node} member - The node to visit.
     * @param {ParsingContext} ctx - The parsing context.
     * @return {THREE.Object3D} - The THREE.Object3D representing the visited node.
     * @throws Will throw an error if the object type is unsupported.
     */
    #visit(member, ctx) {
        if (member.type === "node")
            return this.#visitCompositeNode(member, ctx);
        if (member.type === "primitive")
            return this.#visitPrimitive(member, ctx);
        if (member.type === "lod") return this.#visitLod(member, ctx);

        return this.#visitLight(member);
    }

    /**
     * Visits a composite node in the scene graph and returns a THREE.Group representing the node.
     *
     * @param {import('./types').SceneGraph.CompositeNode} nodeSpec - The composite node to visit.
     * @param {ParsingContext} ctx - The parsing context.
     * @return {THREE.Group} - The THREE.Group representing the visited composite node.
     * @throws Will throw an error if the object is not a node.
     */
    #visitCompositeNode(nodeSpec, ctx) {
        if (nodeSpec.type !== "node") throw new Error("Object is not a node");

        const {
            children,
            materialIds,
            transformations,
            castShadows,
            receiveShadows,
        } = nodeSpec;

        /** @type {ParsingContext} */
        const newCtx = {
            ...ctx,
            activeMaterials:
                materialIds.length === 0 ? ctx.activeMaterials : materialIds,
            castShadows: castShadows || ctx.castShadows,
            receiveShadows: receiveShadows || ctx.receiveShadows,
        };

        const group = new THREE.Group();
        for (const child of children) {
            const childObject = this.#visit(child, newCtx);
            group.add(childObject);
        }

        const transformationMatrix =
            this.transformationsBuilder.buildMatrix(transformations);
        group.applyMatrix4(transformationMatrix);

        return group;
    }

    /**
     * Visits a primitive node in the scene graph and returns a THREE.Object3D representing the node.
     *
     * @param {import('./types').SceneGraph.PrimitiveNode} primitiveSpec - The primitive node to visit.
     * @param {ParsingContext} ctx - The parsing context.
     * @return {THREE.Object3D} - The THREE.Object3D representing the visited primitive node.
     * @throws Will throw an error if the object is not a primitive.
     */
    #visitPrimitive(primitiveSpec, ctx) {
        if (primitiveSpec.type !== "primitive")
            throw new Error("Object is not a primitive");

        /** @type {import("./types").WorldContext} */
        const primitiveContext = {
            ...ctx,
            activeMaterials: ctx.activeMaterials.map((id) => {
                const material = this.materials.get(id);

                if (!material)
                    throw new Error(`Could not find material with id ${id}`);

                return material;
            }),
        };

        const primitive = this.primitiveBuilder.buildPrimitive(
            primitiveSpec,
            primitiveContext
        );
        return primitive;
    }

    /**
     * Visits an LOD (Level of Detail) node in the scene graph and returns a THREE.LOD object representing the node.
     *
     * @param {import('./types').SceneGraph.Lod} lodSpec - The LOD node to visit.
     * @param {ParsingContext} ctx - The parsing context.
     * @return {THREE.LOD} - The THREE.LOD object representing the visited LOD node.
     * @throws Will throw an error if an LOD is nested inside another LOD.
     */
    #visitLod(lodSpec, ctx) {
        const { children } = lodSpec;

        const lod = new THREE.LOD();

        for (const lodNodeSpec of children) {
            const { node, mindist } = lodNodeSpec;

            const lodNode = this.#visit(node, {
                ...ctx,
                withinLod: true,
            });
            lod.addLevel(lodNode, mindist);
        }

        return lod;
    }

    /**
     * Visits a light node in the scene graph and returns a THREE.Light object representing the node.
     *
     * @param {import('./types').SceneGraph.LightNode} lightSpec - The light node to visit.
     * @return {THREE.Light} - The THREE.Light object representing the visited light node.
     */
    #visitLight(lightSpec) {
        const light = this.lightBuilder.buildLight(lightSpec);
        this.initialLightStates.set(lightSpec.id, light.visible);

        return light;
    }
}
