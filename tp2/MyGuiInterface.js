import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        // add a folder to the gui interface for the axis
        const axisFolder = this.datgui.addFolder( 'Axis' );
        axisFolder.add(this.contents, 'displayAxis', true).name("enabled");

        const lightHelpersFolder = this.datgui.addFolder('Light Helpers')
        lightHelpersFolder.add(this.contents, 'displayHelpers', true).name("enabled").onChange(() => this.contents.updateHelpers());
    }
}

export { MyGuiInterface };