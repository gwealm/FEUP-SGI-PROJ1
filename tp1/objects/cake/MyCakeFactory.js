import { cake } from "../../MyMaterials.js";
import * as THREE from 'three';
import { MyCandleFactory } from "./MyCandleFactory.js";
import { MyDishFactory } from "./MyDishFactory.js";

export class MyCakeFactory {
    constructor() {
        this.candleFactory = new MyCandleFactory();
        this.dishFactory = new MyDishFactory();
    }

    #buildBase(scale) {
        const radius = 0.5 * scale;
        const height = 0.25 * scale;
        const radialSegments = 32; // Default radial segments
        const thetaStart = 0; // Default theta start
        const thetaLength = 7 * Math.PI / 4;

        const circleShape = new THREE.Shape();
        circleShape.absellipse(0, 0, radius, radius, thetaStart, thetaLength, false, 0);
        circleShape.lineTo(0, 0)

        const cakeGeometry = new THREE.ExtrudeGeometry(circleShape, {
            depth: height,
            curveSegments: radialSegments,
            bevelEnabled: false,
        });

        cakeGeometry.rotateX(Math.PI / 2)
        cakeGeometry.translate(0, height / 2, 0)

        // return new THREE.Mesh(cakeGeometry, cake.base);
        let cakeMesh = Object.assign(new THREE.Mesh(cakeGeometry, cake.base), {
            __radius: radius,
            __height: height,
        });

        cakeMesh.castShadow = true;
        cakeMesh.receiveShadow = true;

        return cakeMesh;
    }

    buildCake(scale = 1) {
        const cakeGroup = new THREE.Group();

        const dish = this.dishFactory.buildDish(scale );
        dish.position.set(0, dish.__height / 2, 0)
        cakeGroup.add(dish)

        const base = this.#buildBase(scale + 0.1);
        base.position.set(0, dish.__height +  (base.__height / 2), 0)
        cakeGroup.add(base);

        const candle = this.candleFactory.buildCandle(scale);
        candle.position.set(-candle.__radius , dish.__height +  base.__height + candle.__height / 2, 0);
        // candle.position.set(0, candle.__height / 2, 3)
        cakeGroup.add(candle);

        cakeGroup.castShadow = true;

        return cakeGroup;
    }
}