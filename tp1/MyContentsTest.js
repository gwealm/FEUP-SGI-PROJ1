import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyFloorFactory } from "./objects/MyFloorFactory.js";
import { MyWallFactory } from "./objects/MyWallFactory.js";
import { MyCircularTableFactory } from "./objects/MyCircularTableFactory.js";
import { MyWatchFactory } from "./objects/MyWatchFactory.js";

/**
 *  This class contains the contents of out application
 */
class MyContentsTest {
    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app;

        // axis related attributes
        this.axis = null;
        this.displayAxis = false;
    }

    addPointLight(x, y, z) {
        // add a point light on top of the model
        const pointLight = new THREE.PointLight(0xffffff, 500, 0);
        pointLight.position.set(x, y, z);
        this.app.scene.add(pointLight);

        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(
            pointLight,
            sphereSize
        );
        this.app.scene.add(pointLightHelper);
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

        this.addPointLight(0, 10, 0);
        this.addPointLight(0, -10, 0);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight);

        let floorFactory = new MyFloorFactory("carpet");
        let floor = floorFactory.buildFloor(10, 10);
        this.app.scene.add(floor);

        let wallFactory = new MyWallFactory("velvet");
        const wall = wallFactory.buildWall(10, 20);
        wall.position.set(-floor.__width / 2, wall.__height / 2, 0);
        wall.rotateY(Math.PI / 2);
        this.app.scene.add(wall);

        let circularTableFactory = new MyCircularTableFactory("velvetFabric");
        const circularTable = circularTableFactory.buildCircularTable(1, new THREE.Vector3(0, 0.5, 0));
        this.app.scene.add(circularTable);

        let watchFactory = new MyWatchFactory("velvet");
        const watch = watchFactory.buildWatch(1, new THREE.Vector3(0, 1, 0));
        this.app.scene.add(watch);

    }

    /**
     * updates the axis if required
     * this method is called from the render method of the app
     * updates are trigered by displayAxis property changes
     */
    updateAxisIfRequired() {
        if (!this.displayAxis && this.axis != null)
            this.app.scene.remove(this.axis);
        else if (this.displayAxis) this.app.scene.add(this.axis);
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     *
     */
    update() {
        this.updateAxisIfRequired();
    }
}

export { MyContentsTest };
