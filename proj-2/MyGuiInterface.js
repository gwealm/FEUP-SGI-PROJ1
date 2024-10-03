import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { MyApp } from "./MyApp.js";
import { MyContents } from "./MyContents.js";

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface {
    /**
     *
     * @param {MyApp} app The application object
     */
    constructor(app) {
        this.app = app;
        this.datgui = new GUI();
        this.contents = null;
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * Initialize the gui interface
     */
    init() {
        // add a folder to the gui interface for the axis
        const axisFolder = this.datgui.addFolder("Axis");
        axisFolder.add(this.contents, "displayAxis", true).name("enabled");

        const camerasFolder = this.datgui.addFolder("Cameras");
        camerasFolder
            .add(this.app, "activeCameraName", Object.keys(this.app.cameras))
            .name("Active Camera");

        const lightsFolder = this.datgui.addFolder("Lights");
        lightsFolder
            .add(this.contents, "displayHelpers", true)
            .name("Display Helpers")
            .onChange(() => this.contents?.updateHelpers());

        for (const lightId in this.contents?.enabledLights) {
            lightsFolder
                .add(this.contents.enabledLights, lightId)
                .name(lightId)
                .onChange(() => this.contents?.updateLight(lightId));
        }

        const materialsFolder = this.datgui.addFolder("Materials");
        materialsFolder
            .add(this.contents, "materialVisualizationMode", [
                "as-is",
                "fill",
                "wireframe",
            ])
            .name("Visualization Mode")
            .onChange(() => this.contents?.updateMaterials());
    }

    reinit() {
        this.datgui.destroy();

        this.datgui = new GUI();
        this.init();
    }
}

export { MyGuiInterface };
