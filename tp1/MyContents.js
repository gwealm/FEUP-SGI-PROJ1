import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyTableFactory } from './objects/MyTableFactory.js';
import { MyRoomFactory } from "./objects/MyRoomFactory.js";
import { MyDishFactory } from "./objects/MyDish.js";
import { MyCakeFactory } from "./objects/cake/MyCakeFactory.js";
/**
 *  This class contains the contents of out application
 */
class MyContents {
    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app;

        // axis related attributes
        this.axis = null;
        this.displayAxis = false;

        // box related attributes
        this.boxMesh = null;
        this.boxMeshSize = 1.0;
        this.boxEnabled = false;
        this.lastBoxEnabled = null;
        this.boxDisplacement = new THREE.Vector3(0, 2, 0);
    }

    /**
     * displays the cylinder
     * TODO: probably should only build the mesh to sepparate concerns
     */
    buildCylinder(color, initialDisplacement, scale) {
        let cylinderMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
            clippingPlanes: this.planeMesh,
        });

        // Create a Cube Mesh with basic material
        let cylinder = new THREE.CylinderGeometry(5, 5, 20, 32);
        let cylinderMesh = new THREE.Mesh(cylinder, cylinderMaterial);

        // Sets cylinder initial position
        cylinderMesh.position.set(
            initialDisplacement.x,
            initialDisplacement.y,
            initialDisplacement.z
        );

        // Sets cylinder scale
        cylinderMesh.scale.set(scale.x, scale.y, scale.z);

        this.app.scene.add(cylinderMesh);

        let tableFactory = new MyTableFactory();

        let table = tableFactory.buildTable(5, 0.3, 3, 3, 0.3);
        this.app.scene.add(table);
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

        // add a point light on top of the model
        const pointLight = new THREE.PointLight(0xffffff, 500, 0);
        pointLight.position.set(0, 20, 0);
        this.app.scene.add(pointLight);

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(
            pointLight,
            sphereSize
        );
        this.app.scene.add(pointLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight);

        let roomWidth = 30;
        let roomDepth = 30;
        let roomHeight = 20;

        let roomFactory = new MyRoomFactory('white');
        let room = roomFactory.buildRoom(roomWidth, roomHeight, roomDepth);
        this.app.scene.add(room);


        let tableFactory = new MyTableFactory();
        let table = tableFactory.buildTable(5, 0.3, 3, 3, 0.3);
        table.translateY(0.3 - (roomHeight / 2)  ) // 0.3 is the height of the table plane
        this.app.scene.add(table);

        let dishFactory = new MyDishFactory('vanilla');
        let dish = dishFactory.buildDish();
        dish.translateY(0.5 + 3 - (roomHeight / 2) )
        this.app.scene.add(dish);

        let cakeFactory = new MyCakeFactory();
        let cake = cakeFactory.buildCake();
        cake.translateY(0.5 + 3 + 0.4 - (roomHeight / 2))
        this.app.scene.add(cake);
    }

    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled;
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh);
            } else {
                this.app.scene.remove(this.boxMesh);
            }
        }
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

export { MyContents };
