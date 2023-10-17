import { cake } from "../../MyMaterials.js";
import * as THREE from "three";
import { MyPointLightFactory } from "../../lights/MyPointLightFactory.js";

/**
 * Class for creating a 3D candle model with wick and flame
 */
export class MyCandleFactory {
    /**
     * Constructor for MyCandleFactory class.
     */
    constructor() {
        this.pointLightFactory = new MyPointLightFactory();
    }

    /**
     * Builds the wick of the candle.
     * @private
     * @param {number} scale - The overall scale of the candle.
     * @returns {THREE.Mesh} - The 3D mesh representing the candle wick.
     */
    #buildWick(scale) {
        const radius = 0.05 * scale;
        const height = 0.3 * scale;

        const cylinder = new THREE.CylinderGeometry(radius, radius, height);
        let wickMesh = new THREE.Mesh(cylinder, cake.candle.wick);

        return wickMesh;
    }

    /**
     * Builds the flame of the candle along with the point light source.
     * @private
     * @param {number} scale - The overall scale of the candle.
     * @returns {THREE.Mesh} - The 3D mesh representing the candle flame.
     */
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

    /**
     * Builds a complete 3D candle model with wick and flame.
     * @param {number} scale - The overall scale of the candle.
     * @returns {THREE.Group} - The 3D group representing the candle.
     */
    buildCandle(scale = 1) {
        const candleGroup = new THREE.Group();

        const wick = this.#buildWick(scale);
        candleGroup.add(wick);

        const flame = this.#buildFlame(scale);
        flame.position.set(0, 0.25 * scale, 0);
        // flame.rotateX(Math.PI);
        candleGroup.add(flame);

        Object.assign(candleGroup, {
            __height: 0.3 * scale,
            __radius: 0.025 * scale,
        });

        return candleGroup;
    }
}
