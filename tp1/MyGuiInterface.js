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
        // add a folder to the gui interface for the box
        const boxFolder = this.datgui.addFolder( 'Box' );
        // note that we are using a property from the contents object 
        boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        boxFolder.add(this.contents, 'boxEnabled', true).name("enabled");
        boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5)
        boxFolder.open()
        
        const data = {  
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
        };

        // adds a folder to the gui interface for the plane
        const planeFolder = this.datgui.addFolder( 'Plane' );
        planeFolder.addColor( data, 'diffuse color' ).onChange( (value) => { this.contents.updateDiffusePlaneColor(value) } );
        planeFolder.addColor( data, 'specular color' ).onChange( (value) => { this.contents.updateSpecularPlaneColor(value) } );
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange( (value) => { this.contents.updatePlaneShininess(value) } );
        planeFolder.open();

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Left', 'Top', 'Front' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open();

        const spotlightFolder = this.datgui.addFolder('Spotlight')
        spotlightFolder.addColor(this.contents, 'spotlightColor');
        spotlightFolder.add(this.contents, 'spotlightIntensity', 0, 100);
        spotlightFolder.add(this.contents, 'spotlightDistance', 0, 50);
        spotlightFolder.add(this.contents, 'spotlightAngle', 0, 90);
        spotlightFolder.add(this.contents, 'spotlightPenumbra', 0, 1);
        spotlightFolder.add(this.contents, 'spotlightDecay', 0, 50);
        spotlightFolder.add(this.contents.spotlightPosition, 'x', -5, 5);
        spotlightFolder.add(this.contents.spotlightPosition, 'y', -5, 5);
        spotlightFolder.add(this.contents.spotlightPosition, 'z', -5, 5);
        spotlightFolder.add(this.contents.spotlightTarget, 'x', -5, 5);
        spotlightFolder.add(this.contents.spotlightTarget, 'y', -5, 5);
        spotlightFolder.add(this.contents.spotlightTarget, 'z', -5, 5);
        spotlightFolder.open();

        spotlightFolder.onChange(this.contents.updateSpotlight.bind(this.contents));
    }
}

export { MyGuiInterface };