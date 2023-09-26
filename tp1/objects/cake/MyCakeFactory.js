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
        const heightSegments = 1; // Default height segments
        const openEnded = false; // Default open ended
        const thetaStart = 0; // Default theta start
        const thetaLength = 7 * Math.PI / 4;

        const cylinder = new THREE.CylinderGeometry(radius, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
        return new THREE.Mesh(cylinder, cake.base);
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