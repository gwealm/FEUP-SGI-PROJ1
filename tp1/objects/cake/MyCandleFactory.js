import { cake } from "../../MyMaterials.js";
import * as THREE from 'three';
import { MyPointLightFactory } from "../../lights/MyPointLightFactory.js";

export class MyCandleFactory {
    constructor() {
        this.pointLightFactory = new MyPointLightFactory();
    }

    #buildWick(scale) {
        const radius = 0.05 * scale;
        const height = 0.3 * scale;

        const cylinder = new THREE.CylinderGeometry(radius, radius, height);
        let wickMesh = new THREE.Mesh(cylinder, cake.candle.wick);


        return wickMesh;
    }

    #buildFlame(scale) {
        const radius = 0.025 * scale;
        const height = 0.2 * scale;

        const cone = new THREE.ConeGeometry(radius, height);
        const coneMesh = new THREE.Mesh(cone, cake.candle.flame);

        const light = this.pointLightFactory.build({
            //orange flame color
            color: "#ff8f3f",
            intensity: 0.25,
            decay: 2,
            castShadow: true,
        });

        coneMesh.add(light);
        return coneMesh;
    }

    buildCandle(scale = 1) {
        const candleGroup = new THREE.Group();

        const wick = this.#buildWick(scale);
        candleGroup.add(wick);

        const flame = this.#buildFlame(scale);
        flame.position.set(0, 0.25 * scale, 0);
        // flame.rotateX(Math.PI);
        candleGroup.add(flame);

        Object.assign(candleGroup, {
            __height: 0.3 * scale ,
            __radius: 0.025 * scale
        })


        return candleGroup;
    }
}