import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { MyAxis } from "./MyAxis.js";
import { MyFloorFactory } from "./objects/MyFloorFactory.js";
import { MyWallFactory } from "./objects/MyWallFactory.js";
import { MyWatchFactory } from "./objects/MyWatchFactory.js";
import { MyBoxFactory } from "./objects/MyBoxFactory.js";
import { MyBeetleFactory } from "./curves/MyBeetleFactory.js";
import { MySpringFactory } from "./curves/MySpringFactory.js";
import { MyTableFactory } from "./objects/MyTableFactory.js";
import { MyCakeFactory } from "./objects/cake/MyCakeFactory.js";
import { MyNewspaperFactory } from "./nurbs/MyNewspaperFactory.js";
import { MyFlowerFactory } from "./objects/flower/MyFlowerFactory.js";
import { MyFlowerPotFactory } from "./objects/flower/MyFlowerPotFactory.js";
import { MyLeafFactory } from "./objects/flower/MyLeafFactory.js";
import { MyStemFactory } from "./objects/flower/MyStemFactory.js";
import { MyCircularWindowFactory } from "./objects/window/MyCircularWindowFactory.js";
import { MyRectangularFrameFactory } from "./objects/painting/frame/MyRectangularFrameFactory.js";
import { MyPaintingFactory } from "./objects/painting/MyPaintingFactory.js";
import * as materials from "./MyMaterials.js";
import { MyCandleFactory } from "./objects/cake/MyCandleFactory.js";

/**
 *  This class contains the contents of out application
 */
class MyContents {
    /**
       constructs the object
       @param {import("./MyApp.js").MyApp} app The application object
    */
    constructor(app) {
        this.app = app;

        // axis related attributes
        this.axis = null;
        this.displayAxis = false;

        this.displayHelpers = true;
    }

    addPointLight(x, y, z) {
        // add a point light on top of the model
        const pointLight = new THREE.PointLight(0xffffff, 20, 0);
        pointLight.position.set(x, y, z);
        pointLight.castShadow = true;

        this.app.scene.add(pointLight);

        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(
            pointLight,
            sphereSize
        );
        this.app.scene.add(pointLightHelper);
    }

    updateHelpers() {
        this.app.scene?.dispatchEvent({
            type: "custom:updateHelpers",
            displayHelpers: this.displayHelpers,
        });
    }

    /**
     * initializes the contents
     */
    init() {
        RectAreaLightUniformsLib.init();

        // create once
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis();
            this.app.scene.add(this.axis);
        }

        const degreesToRadians = Math.PI / 180;

        this.addPointLight(1, 8, 1);
        // this.addPointLight(0, -10, 0);

        // Adds an ambient light
        const ambientLight = new THREE.AmbientLight(0x333333);
        this.app.scene.add(ambientLight);

        // Adds a floor
        let floorFactory = new MyFloorFactory("carpet");
        let floor = floorFactory.buildFloor(10, 15);
        floor.rotateX(Math.PI);
        this.app.scene.add(floor);

        // Adds a Wall
        let wallFactory = new MyWallFactory("velvet");

        // Left wall
        const leftWall = wallFactory.buildWall(floor.__height, 10);
        leftWall.position.set(-floor.__width / 2, leftWall.__height / 2, 0);
        leftWall.rotateY(90 * degreesToRadians);
        this.app.scene.add(leftWall);

        // Right wall
        const rightWall = wallFactory.buildWall(floor.__height, 10);
        rightWall.position.set(floor.__width / 2, rightWall.__height / 2, 0);
        rightWall.rotateY(-90 * degreesToRadians);
        this.app.scene.add(rightWall);

        // Back wall
        const backWall = wallFactory.buildWall(floor.__width, 10);
        backWall.receiveShadow = true;
        backWall.position.set(0, backWall.__height / 2, -floor.__height / 2);
        this.app.scene.add(backWall);

        // Front wall
        const frontWall = wallFactory.buildWall(floor.__width, 10);
        frontWall.rotateY(180 * degreesToRadians);
        frontWall.position.set(0, backWall.__height / 2, floor.__height / 2);
        this.app.scene.add(frontWall);

        // Adds the roof
        const roof = wallFactory.buildWall(floor.__width, floor.__height);
        roof.rotateX(90 * degreesToRadians);
        roof.position.set(0, frontWall.__height, 0);
        this.app.scene.add(roof);

        // const cageFactory = new MyCageFactory();
        // const cage = cageFactory.buildCage(floor.__width, frontWall.__height);
        // this.app.scene.add(cage)

        // Adds the table
        let tableFactory = new MyTableFactory("wood");
        const table = tableFactory.buildTable(4, 0.1, 3, 1.5, 0.1);
        table.position.set(0, table.__height / 2, (-1 * floor.__height) / 5);
        this.app.scene.add(table);

        // Adds the cake
        let cakeFactory = new MyCakeFactory();
        const cake = cakeFactory.buildCake(0.7);
        cake.position.copy(table.position);
        cake.position.y = table.__leg_height + table.__height / 2;
        this.app.scene.add(cake);

        // Adds the watch
        let watchFactory = new MyWatchFactory("velvet");
        const watch = watchFactory.buildWatch(
            2,
            new THREE.Vector3(
                0,
                -floor.__height / 2 + 0.13,
                -backWall.__height / 2
            )
        );
        // watch.position.set(-floor.__width / 2, watch.__height / 2, 0);
        // watch.rotateY(Math.PI);
        // watch.rotateZ(Math.PI / 2);
        watch.rotateX(Math.PI / 2);
        this.app.scene.add(watch);

        // Adds the frame for the paintings
        const rectangularFrameFactory = new MyRectangularFrameFactory("wood");
        const studentsFrame = rectangularFrameFactory.build(2, 2);

        // Adds the students picture
        const paintingFactory = new MyPaintingFactory();
        const painting = paintingFactory.build(
            studentsFrame,
            materials.frame.inner.gui
        );

        painting.rotateY(-Math.PI / 2);
        painting.position.set(
            floor.__width / 2 - 0.1,
            rightWall.__height / 2,
            -floor.__height / 5
        );
        this.app.scene.add(painting);

        // Adds the box
        let boxFactory = new MyBoxFactory("wood");
        const boxPosition = new THREE.Vector3(4, 0.5, 0);
        const box = boxFactory.buildBox(1, 1, 1, boxPosition);
        this.app.scene.add(box);

        // Adds the candle
        const candleFactory = new MyCandleFactory();
        const candle = candleFactory.buildCandle();
        candle.position.copy(boxPosition);
        candle.position.y += 0.6;
        this.app.scene?.add(candle);

        // Adds the beetle frame
        const beetleFrame = rectangularFrameFactory.build(4, 3);
        const beetlePainting = paintingFactory.build(
            beetleFrame,
            materials.basic.white
        );
        beetlePainting.rotateY(-Math.PI / 2);
        beetlePainting.position.set(
            floor.__width / 2 - 0.1,
            rightWall.__height / 2,
            beetlePainting.__width
        );
        this.app.scene.add(beetlePainting);

        // Adds the beetle drawing
        let beetleFactory = new MyBeetleFactory();
        let beetle = beetleFactory.buildBeetle(1.5);
        beetle.position.set(
            floor.__width / 2 - 0.1 - beetlePainting.__depth,
            rightWall.__height / 2 - 0.6,
            beetlePainting.__width
        );
        beetle.rotateY(Math.PI / 2);

        this.app.scene.add(beetle);

        // Adds the spring
        let springFactory = new MySpringFactory();
        const spring = springFactory.buildSpring(0.2, 0.1);
        spring.rotateZ(Math.PI / 2);
        spring.position.copy(table.position);
        spring.position.x += table.__depth / 2;
        spring.position.y +=
            spring.__width / 2 + table.__leg_height + table.__height / 2;
        spring.position.z += table.__depth / 3;

        this.app.scene.add(spring);

        // Adds the newspaper
        let newspaperFactory = new MyNewspaperFactory("newspaper");
        let newspaper = newspaperFactory.buildNewspaper(0.5, 0.5, 0.5);
        newspaper.rotateX(-Math.PI / 2);
        newspaper.position.copy(table.position);
        newspaper.position.y += table.__leg_height;
        newspaper.position.z += table.__depth / 3;
        newspaper.position.x -= table.__depth / 2;

        this.app.scene.add(newspaper);

        // Adds the circular window
        let circularWindowFactory = new MyCircularWindowFactory("metal");
        // const moonAngle = cake.position.sub(c)
        const circularWindow = circularWindowFactory.build(
            2,
            2,
            1,
            Math.PI / 12,
            0.01
        );
        circularWindow.position.set(
            0,
            circularWindow.__radius + 2.5,
            floor.__height / 2
        );
        circularWindow.rotateY(Math.PI);
        this.app.scene?.add(circularWindow);

        // Adds the flower pot
        const flowerPotFactory = new MyFlowerPotFactory();
        const flowerPot = flowerPotFactory.build(1);
        flowerPot.position.set(
            floor.__width / 2 - flowerPot.__depth / 2 - 0.3,
            flowerPot.__height / 2,
            -floor.__height / 2 + flowerPot.__depth / 2
        );
        this.app.scene?.add(flowerPot);

        let flowerFactory = new MyFlowerFactory();
        let flower = flowerFactory.createFlower(1, 12);
        flower.rotateX(Math.PI / 2);
        flower.position.set(0, 0, 5);
        this.app.scene.add(flower);

        flower.position.copy(flowerPot.position);

        // const stemFactory = new MyStemFactory();
        // const stem = stemFactory.buildStem();
        // this.app.scene?.add(stem);
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
