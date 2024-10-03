import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyFileReader } from "./parser/MyFileReader.js";
import { MyParser } from "./MyParser.js";

/**
 *  This class contains the contents of out application
 */
class MyContents {
    /**
       constructs the object
       @param {import('./MyApp.js').MyApp} app the application object
    */
    constructor(app) {
        this.app = app;
        this.eventDispatcher = null;

        // axis related attributes
        this.axis = null;
        this.displayAxis = true;

        this.displayHelpers = true;

        /** @type {"as-is" | "wireframe" | "fill"} */
        this.materialVisualizationMode = "as-is";

        /** @type {Record<string, boolean>} */
        this.enabledLights = {};

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        //this.reader.open("scenes/debug.xml");
        // this.reader.open("scenes/demo/demo.xml");
        this.reader.open("scenes/t04g01/scene.xml")
    }

    /**
     * initializes the contents
     */
    init() {
        // create once
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this);
            this.app.scene.add(this.axis);
        }
    }

    /**
     * Updates helpers based on the displayHelpers property.
     */
    updateHelpers() {
        this.eventDispatcher?.dispatchEvent({
            type: "custom:light:helpers:setvisible",
            visible: this.displayHelpers,
        });
    }

    /**
     * Updates the visibility of a specific light.
     * @param {string} lightName - The name of the light.
     */
    updateLight(lightName) {
        this.eventDispatcher?.dispatchEvent({
            type: "custom:light:setvisible",
            name: lightName,
            visible: this.enabledLights[lightName],
        });
    }

    /**
     * Updates material visualization mode.
     */
    updateMaterials() {
        this.eventDispatcher?.dispatchEvent({
            type: "custom:material:setvisualization",
            mode: this.materialVisualizationMode,
        });
    }

    /**
     * Called when the scene xml file load is complete
     * @param {import('./parser/MySceneData.js').MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info(
            "scene data loaded " +
                data +
                ". visit MySceneData javascript class to check contents for each data item."
        );
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    /**
     * Outputs information about the scene data.
     */
    output(obj, indent = 0) {
        console.log(
            "" +
                new Array(indent * 4).join(" ") +
                " - " +
                obj.type +
                " " +
                (obj.id !== undefined ? "'" + obj.id + "'" : "")
        );
    }

    /**
     * Called after the scene is loaded and before rendering.
     * @param {import('./parser/MySceneData.js').MySceneData} data - The scene data.
     */
    onAfterSceneLoadedAndBeforeRender(data) {
        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item

        this.output(data.options);
        console.log("textures:");
        for (var key in data.textures) {
            let texture = data.textures[key];
            this.output(texture, 1);
        }

        console.log("materials:");
        for (var key in data.materials) {
            let material = data.materials[key];
            this.output(material, 1);
        }

        console.log("cameras:");
        for (var key in data.cameras) {
            let camera = data.cameras[key];
            this.output(camera, 1);
        }

        console.log("nodes:");

        // @ts-ignore
        const parser = new MyParser(data);
        parser.prepareScene(this.app.scene);

        const { scene, eventDispatcher } = parser.parse();
        this.eventDispatcher = eventDispatcher;
        this.app.scene.add(scene);

        parser.initialLightStates.forEach(
            (visible, name) => (this.enabledLights[name] = visible)
        );
        this.app.setCameras(Object.fromEntries(parser.cameras.entries()));
        this.app.setActiveCamera(parser.activeCameraId);

        this.app.gui?.reinit();

        // const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
        // this.app.scene.add(ambientLight);
    }

    loadSkybox() {
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            "textures/skybox/px.png",
            "textures/skybox/nx.png",
            "textures/skybox/py.png",
            "textures/skybox/ny.png",
            "textures/skybox/pz.png",
            "textures/skybox/nz.png",
        ]);
     
        this.ap = texture;
    }

    /**
     * updates the axis if required
     * this method is called from the render method of the app
     * updates are trigered by displayAxis property changes
     */
    updateAxisIfRequired() {
        if (!this.displayAxis && this.axis != null)
            this.app.scene?.remove(this.axis);
        else if (this.displayAxis) this.app.scene?.add(this.axis);
    }

    /**
     * Updates the contents.
     */
    update() {
        this.updateAxisIfRequired();
    }
}

export { MyContents };
