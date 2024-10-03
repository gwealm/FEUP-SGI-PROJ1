import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyFloorFactory } from "./objects/MyFloorFactory.js";
import { MyWallFactory } from "./objects/MyWallFactory.js";
import { MyClockFactory } from "./objects/MyClockFactory.js";
import { MyBoxFactory } from "./objects/MyBoxFactory.js";
import { MyBeetleFactory } from "./curves/MyBeetleFactory.js";
import { MySpringFactory } from "./curves/MySpringFactory.js";
import { MyTableFactory } from "./objects/MyTableFactory.js";
import { MyCakeFactory } from "./objects/cake/MyCakeFactory.js";
import { MyNewspaperFactory } from "./nurbs/MyNewspaperFactory.js";
import { MyFlowerFactory } from "./objects/flower/MyFlowerFactory.js";
import { MyFlowerPotFactory } from "./objects/flower/MyFlowerPotFactory.js";
import { MyCircularWindowFactory } from "./objects/window/MyCircularWindowFactory.js";
import { MyRectangularFrameFactory } from "./objects/painting/frame/MyRectangularFrameFactory.js";
import { MyPaintingFactory } from "./objects/painting/MyPaintingFactory.js";
import { MyCandleFactory } from "./objects/cake/MyCandleFactory.js";
import { MyDoorFactory } from "./objects/door/MyDoorFactory.js";
import { MyBookshelfFactory } from "./objects/bookshelf/MyBookshelfFactory.js";
import { materials } from "./MyMaterials.js";
import { MyPointLightFactory } from "./lights/MyPointLightFactory.js";
import { MyDishFactory } from "./objects/cake/MyDishFactory.js";
import { MyBezierCurveFactory } from "./curves/MyBezierCurveFactory.js";
import { MyNurbsBuilder } from "./nurbs/MyNurbsBuilder.js";
import { MySpotlightFactory } from "./lights/MySpotlightFactory.js";
import { MyLeafFactory } from "./objects/flower/MyLeafFactory.js";
import { MyStemFactory } from "./objects/flower/MyStemFactory.js";

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

    addPointLight(x, y, z, intensity = 10) {
        // add a point light on top of the model
        const pointLight = new THREE.PointLight(0xffffff, intensity, 0);
        pointLight.position.set(x, y, z);

        this.app.scene?.add(pointLight);

        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(
            pointLight,
            sphereSize
        );
        this.app.scene?.add(pointLightHelper);
    }

    updateHelpers() {
        this.app.scene?.dispatchEvent({
            // @ts-ignore
            type: "custom:updateHelpers",
            displayHelpers: this.displayHelpers,
        });
    }

    /**
     * initializes the contents
     */
    init() {
        // create once
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis();
            this.app.scene?.add(this.axis);
        }

        const degreesToRadians = Math.PI / 180;

        let pointLightFactory = new MyPointLightFactory();

        const envLight = pointLightFactory.build({
            color: "#ffffff",
            intensity: 20,
            castShadow: false,
            distance: 0,
        })

        envLight.position.set(0, 4, 0);
        this.app.scene?.add(envLight);

        // Adds an ambient light
        const ambientLight = new THREE.AmbientLight(0x333333);
        this.app.scene?.add(ambientLight);

        // Adds a floor
        let floorFactory = new MyFloorFactory();
        let floor = floorFactory.build({ material: materials.room.carpet, scaleX: 10, scaleY: 15 });
        floor.rotateX(Math.PI);
        this.app.scene?.add(floor);

        // Adds a Wall
        let wallFactory = new MyWallFactory();

        // Left wall
        const leftWall = wallFactory.build({ material: materials.room.velvet, scaleX: floor.__height, scaleY: 10 });
        leftWall.position.set(-floor.__width / 2, leftWall.__height / 2, 0);
        leftWall.rotateY(90 * degreesToRadians);
        this.app.scene?.add(leftWall);

        // Right wall
        const rightWall = wallFactory.build({ material: materials.room.velvet, scaleX: floor.__height, scaleY: 10 });
        rightWall.position.set(floor.__width / 2, rightWall.__height / 2, 0);
        rightWall.rotateY(-90 * degreesToRadians);
        this.app.scene?.add(rightWall);

        // Back wall
        const backWall = wallFactory.build({ material: materials.room.velvet, scaleX: floor.__width, scaleY: 10 });
        backWall.receiveShadow = true;
        backWall.position.set(0, backWall.__height / 2, -floor.__height / 2);
        this.app.scene?.add(backWall);

        // Front wall
        const frontWall = wallFactory.build({ material: materials.room.velvet, scaleX: floor.__width, scaleY: 10 });
        frontWall.rotateY(180 * degreesToRadians);
        frontWall.position.set(0, backWall.__height / 2, floor.__height / 2);
        this.app.scene?.add(frontWall);

        // Adds the roof
        const roof = wallFactory.build({ material: materials.room.velvet, scaleX: floor.__width, scaleY: floor.__height });
        roof.rotateX(90 * degreesToRadians);
        roof.position.set(0, frontWall.__height, 0);
        this.app.scene?.add(roof);

        // Adds the table
        let tableFactory = new MyTableFactory();
        const table = tableFactory.build({
            width: 4,
            height: 0.1,
            depth: 3,
            legs: {
                height: 1.5,
                radius: 0.1
            },
            materials: {
                top: materials.basic.textured.wood,
                leg: materials.basic.metal,
            }, 
        });

        table.position.set(0, table.__height / 2, (-1 * floor.__height) / 5);
        this.app.scene?.add(table);

        // Adds the cake
        let candleFactory = new MyCandleFactory(pointLightFactory);
        let cakeFactory = new MyCakeFactory(candleFactory, new MyDishFactory());
        const cake = cakeFactory.build({
            scale: 0.7,
            materials: {
                base: materials.cake.base,
                candle: materials.cake.candle,
                dish: materials.basic.porcelain,
            }
        });

        cake.position.copy(table.position);
        cake.position.y = table.__legHeight + table.__height / 2;
        this.app.scene?.add(cake);

        // Adds the watch
        let clockFactory = new MyClockFactory();
        const clock = clockFactory.build({
            scale: 2,
            materials: materials.clock,
        });

        clock.rotateX(Math.PI / 2);
        clock.position.set(
            0,
            3 * backWall.__height / 4 + 0.13,
            -floor.__height / 2 + 0.1
        );
        this.app.scene?.add(clock);

        // Adds the frame for the paintings
        const rectangularFrameFactory = new MyRectangularFrameFactory();
        const studentsFrame = rectangularFrameFactory.build({
            scaleX: 2,
            scaleY: 2,
            material: materials.basic.textured.wood,
        });

        // Adds the students picture
        const paintingFactory = new MyPaintingFactory();
        const painting = paintingFactory.build(
            studentsFrame,
            materials.guima,
        );

        painting.rotateY(-Math.PI / 2);
        painting.position.set(
            floor.__width / 2 - 0.1,
            rightWall.__height / 2,
            -floor.__height / 5
        );
        
        this.app.scene?.add(painting);

        // Adds the box
        let boxFactory = new MyBoxFactory();
        const boxPosition = new THREE.Vector3(4, 0.5, 0);
        const box = boxFactory.build({
            material: materials.box,
        });

        box.position.copy(boxPosition);

        this.app.scene?.add(box);


        // Adds the beetle frame
        const beetleFrame = rectangularFrameFactory.build({
            material: materials.basic.textured.wood,
            scaleX: 4,
            scaleY: 3
        });
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
        this.app.scene?.add(beetlePainting);

        // Adds the beetle drawing
        let bezierCurveFactory = new MyBezierCurveFactory();
        let beetleFactory = new MyBeetleFactory(bezierCurveFactory);
        let beetle = beetleFactory.buildBeetle(1.5);
        beetle.position.set(
            floor.__width / 2 - 0.1 - beetlePainting.__depth,
            rightWall.__height / 2 - 0.6,
            beetlePainting.__width
        );
        beetle.rotateY(Math.PI / 2);

        this.app.scene?.add(beetle);

        // Adds the spring
        let springFactory = new MySpringFactory(bezierCurveFactory);
        const spring = springFactory.build({ scaleXZ: 0.2, scaleY: 0.1, material: materials.basic.metal });
        spring.rotateZ(Math.PI / 2);
        spring.position.copy(table.position);
        spring.position.x += table.__depth / 2;
        spring.position.y +=
            spring.__width / 2 + table.__legHeight + table.__height / 2;
        spring.position.z += table.__depth / 3;

        this.app.scene?.add(spring);

        // Adds the newspaper
        let nurbsBuilder = new MyNurbsBuilder()
        let newspaperFactory = new MyNewspaperFactory(nurbsBuilder);
        let newspaper = newspaperFactory.build({
            scaleX: 0.5,
            scaleY: 0.5,
            scaleZ: 0.5,
            materials: [materials.newspaper.firstPage, materials.newspaper.secondPage],
        });

        newspaper.rotateX(-Math.PI / 2);
        newspaper.position.copy(table.position);
        newspaper.position.y += table.__legHeight;
        newspaper.position.z += table.__depth / 3;
        newspaper.position.x -= table.__depth / 2;

        this.app.scene?.add(newspaper);

        // Adds the circular window
        let spotlightFactory = new MySpotlightFactory();
        let circularWindowFactory = new MyCircularWindowFactory(spotlightFactory);
        // const moonAngle = cake.position.sub(c)
        const circularWindow = circularWindowFactory.build({
            materials: {
                frame: materials.basic.metal,
                landscape: materials.window.landscape,
            },
            scaleXY: 2,
            scaleZ: 2,
            moonAngle: Math.PI / 12,
            lightAmplitude: 0.01,
        });

        circularWindow.position.set(
            0,
            circularWindow.__radius + 2.5,
            floor.__height / 2
        );
        circularWindow.rotateY(Math.PI);
        this.app.scene?.add(circularWindow);

        // Adds door
        let doorFactory = new MyDoorFactory(rectangularFrameFactory, paintingFactory);
        let door = doorFactory.buildDoor({
            materials: {
                door: materials.door,
                frame: materials.basic.textured.wood
            },
            width: 3, 
            height: 5,
            depth: 1
        });
        door.rotateY(Math.PI / 2);
        door.position.x -= floor.__width / 2;
        door.position.z += floor.__height / 8;

        this.app.scene?.add(door);

        const bookshelfFactory = new MyBookshelfFactory(rectangularFrameFactory);
        const bookshelf = bookshelfFactory.build({
            materials: {
                frame: materials.basic.textured.wood,
                shelf: materials.basic.white,
            },
            scaleX: 2,
            scaleY: 2,
            scaleZ: 2
        });
        bookshelf.position.y = bookshelf.__height / 2;
        bookshelf.position.z = bookshelf.__depth / 2 - floor.__height / 2 + 0.2;

        this.app.scene?.add(bookshelf);

        // Adds the flower pot
        const flowerPotFactory = new MyFlowerPotFactory(nurbsBuilder);
        const flowerPot = flowerPotFactory.build({
            material: materials.basic.textured.porcelain,
            scaleXZ: 0.75,
            scaleY: 0.75,
        });

        flowerPot.position.copy(bookshelf.position);
        flowerPot.position.x += 0.3;
        flowerPot.position.y += -bookshelf.__height / 2 + flowerPot.__height / 2 + 1.95;

        this.app.scene?.add(flowerPot);

        let flowerFactory = new MyFlowerFactory(new MyLeafFactory(), new MyStemFactory());
        let flower = flowerFactory.build({
            materials: materials.flower,
            numPetals: 12,
            scale: 0.75,
        });

        flower.rotateX(Math.PI / 2);
        flower.position.copy(flowerPot.position);
        flower.position.y -= 0.1;
        
        this.app.scene?.add(flower);

        // Adds the candle
        const candle = candleFactory.build({
            materials: materials.cake.candle,
        });

        candle.position.copy(flowerPot.position);
        candle.position.x -= 0.8;
        candle.position.y += -flowerPot.__height / 2 + candle.__height / 2 + 0.1;
        this.app.scene?.add(candle);
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
     * updates the contents
     * this method is called from the render method of the app
     *
     */
    update() {
        this.updateAxisIfRequired();
    }
}

export { MyContents };
