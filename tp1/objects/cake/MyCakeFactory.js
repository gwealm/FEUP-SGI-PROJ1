import { cake } from "../../MyMaterials.js";
import * as THREE from 'three';
import { MyCandleFactory } from "./MyCandleFactory.js";

export class MyCakeFactory {
    constructor() {
        this.candleFactory = new MyCandleFactory();
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

        return new THREE.Mesh(cakeGeometry, cake.base);
    }

    buildCake(scale = 1) {
        const cakeGroup = new THREE.Group();

        const base = this.#buildBase(scale);
        cakeGroup.add(base);

        const candle = this.candleFactory.buildCandle(scale);
        candle.position.set(0, 0.25 * scale, 0);
        cakeGroup.add(candle);

        return cakeGroup;
    }
}