import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { MyAxis } from "./MyAxis.js";
import { MyFloorFactory } from "./objects/MyFloorFactory.js";
import { MyWallFactory } from "./objects/MyWallFactory.js";
import { MySpotlightFactory } from "./lights/MySpotlightFactory.js";
import { MyCageFactory } from "./objects/MyCageFactory.js";
import { MyWatchFactory } from "./objects/MyWatchFactory.js";
import { wall, watch } from "./MyTextures.js";
import { MyBoxFactory } from "./objects/MyBoxFactory.js";
import { MyFrameFactory } from "./objects/MyFrame.js";
import { MyBeetleFactory } from "./curves/MyBeetleFactory.js";
import { MySpringFactory } from "./curves/MySpringFactory.js";
import { MyTableFactory } from "./objects/MyTableFactory.js";
import { MyCakeFactory } from "./objects/cake/MyCakeFactory.js";
import { MyNewspaperFactory } from "./nurbs/MyNewspaperFactory.js"
// import { MyNurbsBuilder } from "./nurbs/MyNurbsBuilder.js"

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
        RectAreaLightUniformsLib.init();

        // create once
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this);
            this.app.scene.add(this.axis);
        }

        const degreesToRadians = Math.PI / 180;
        
        this.addPointLight(0, 10, 0);
        // this.addPointLight(0, -10, 0);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight);

        let floorFactory = new MyFloorFactory("carpet");
        let floor = floorFactory.buildFloor(10, 15);
        this.app.scene.add(floor);

        let wallFactory = new MyWallFactory("velvet");

        const leftWall = wallFactory.buildWall(floor.__height, 10);
        leftWall.position.set(-floor.__width / 2, leftWall.__height / 2, 0);
        leftWall.rotateY(90 * degreesToRadians);
        this.app.scene.add(leftWall);

        const rightWall = wallFactory.buildWall(floor.__height, 10);
        rightWall.position.set(floor.__width / 2, rightWall.__height / 2, 0);
        rightWall.rotateY(-90 * degreesToRadians);
        this.app.scene.add(rightWall);

        const downWall = wallFactory.buildWall(10, 10);
        downWall.position.set(0, downWall.__height / 2, -floor.__height / 2);
        this.app.scene.add(downWall);

        const directionalLightFactory = new MySpotlightFactory();
        const directionalLight = directionalLightFactory.buildSpotlight({ intensity: 5, angle: 15 * degreesToRadians });
        directionalLight.position.set(0, downWall.__height, -floor.__height / 2);
        directionalLight.target = floor;

        this.app.scene.add(directionalLight);

        const cageFactory = new MyCageFactory();
        const cage = cageFactory.buildCage();
        this.app.scene.add(cage)
    

        let tableFactory = new MyTableFactory("wood");
        const table = tableFactory.buildTable(4, 0.1, 3, 1.5, 0.1);
        table.position.set(0, table.__height / 2, - 1 * floor.__height / 4 );
        this.app.scene.add(table);

        let cakeFactory = new MyCakeFactory();
        const cake = cakeFactory.buildCake(0.7);
        // cake.position.set(0, table.__leg_height + table.__height + cake.__height / 2, -4);
        cake.position.set(0, table.__height / 2 + table.__leg_height, -4)
        // cake.position.set(0, table.__leg_height + table.__height + cake.__, -4);
        // cake.position.set(0,0, 0);
        this.app.scene.add(cake);


        let watchFactory = new MyWatchFactory("velvet");
        const watch = watchFactory.buildWatch(2, new THREE.Vector3(0, -floor.__height / 2 + 0.130, - downWall.__height / 2))
        // watch.position.set(-floor.__width / 2, watch.__height / 2, 0);
        // watch.rotateY(Math.PI);
        // watch.rotateZ(Math.PI / 2);
        watch.rotateX(Math.PI / 2);
        this.app.scene.add(watch);

        let frameFactory = new MyFrameFactory("gui", "blue");
        const frame = frameFactory.buildFrame(2, 2, 0.1);
        frame.rotateY(- Math.PI / 2);
        frame.position.set(floor.__width / 2 - 0.1, rightWall.__height / 2, - floor.__height / 5)
        this.app.scene.add(frame);

        let boxFactory = new MyBoxFactory("wood");
        const box = boxFactory.buildBox(1, 1, 1, new THREE.Vector3(4, 0.5, 0));
        this.app.scene.add(box);

        let canvasFrameFactory = new MyFrameFactory("canvas", "blue");
        const canvasFrame = canvasFrameFactory.buildFrame(4, 2, 0.1);
        canvasFrame.rotateY(- Math.PI / 2);
        canvasFrame.position.set(floor.__width / 2 - 0.1, rightWall.__height / 2, frame.__width, 0);
        this.app.scene.add(canvasFrame);


        let beetleFactory = new MyBeetleFactory();
        let beetle = beetleFactory.buildBeetle(1.5);
        beetle.position.set(floor.__width / 2 - 0.1 - frame.__depth, rightWall.__height / 2 - frame.__width / 3, frame.__width, 0);
        beetle.rotateY(Math.PI / 2);
        canvasFrame.add(beetle);
        
        this.app.scene.add(beetle);

        let springFactory = new MySpringFactory();
        const spring = springFactory.buildSpring(0.2, 0.1);
        spring.rotateZ(Math.PI / 2);
        spring.position.copy(table.position);
        spring.position.x += table.__depth / 2 ;
        spring.position.y += (spring.__width / 2) + table.__leg_height + table.__height / 2;
        spring.position.z += table.__depth / 3;

        this.app.scene.add(spring)

        let newspaperFactory = new MyNewspaperFactory('newspaper');
        let newspaper = newspaperFactory.buildNewspaper(0.25);
        newspaper.position.copy(table.position);
        newspaper.position.y += newspaper.__scale * 2 + table.__leg_height ;
        newspaper.position.z += table.__depth / 3;
        newspaper.position.x -= table.__depth / 2 ;

        this.app.scene.add(newspaper);

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
