import * as THREE from "three";

/**
 * Class for creating a 3D candle model with wick and flame
 */
export class MyCandleFactory {
    /**
     * Constructor for MyCandleFactory class.
     * @param {import('../../lights/MyPointLightFactory.js').MyPointLightFactory} pointLightFactory 
     */
    constructor(pointLightFactory) {
        this.pointLightFactory = pointLightFactory;
    }

    /**
     * Builds the wick of the candle.
     * @param {object} options Options to control candle wick construction.
     * @param {THREE.Material} options.material The material to use for the candle wick.
     * @param {number=} options.scale The overall scale of the candle wick.
     * @returns The 3D mesh representing the candle wick.
     */
    #buildWick(options) {
        const scale = options.scale ?? 1;

        const radius = 0.05 * scale;
        const height = 0.3 * scale;

        const cylinder = new THREE.CylinderGeometry(radius, radius, height);
        let wickMesh = new THREE.Mesh(cylinder, options.material);

        return wickMesh;
    }

    /**
     * Builds the flame of the candle along with the point light source.
     * @param {object} options Options to control candle flame construction.
     * @param {THREE.Material} options.material The material to use for the candle flame.
     * @param {number=} options.scale The overall scale of the candle flame.
     * @returns The 3D mesh representing the candle flame.
     */
    #buildFlame(options) {
        const scale = options.scale ?? 1;

        const radius = 0.025 * scale;
        const height = 0.2 * scale;

        const cone = new THREE.ConeGeometry(radius, height);
        const coneMesh = new THREE.Mesh(cone, options.material);

        const light = this.pointLightFactory.build({
            //orange flame color
            color: "#ff8f3f",
            intensity: 0.25,
            decay: 1,
            castShadow: true,
        });

        coneMesh.add(light);
        return coneMesh;
    }

    /**
     * Builds a complete 3D candle model with wick and flame.
     * @param {object} options Options to control candle construction.
     * @param {object} options.materials The materials to use for the candle.
     * @param {THREE.Material} options.materials.wick The material to use for the candle wick.
     * @param {THREE.Material} options.materials.flame The material to use for the candle flame.
     * @param {number=} options.scale The overall scale of the candle.
     * @returns The 3D group representing the candle.
     */
    build(options) {
        const scale = options.scale ?? 1;

        const candleGroup = new THREE.Group();

        const wick = this.#buildWick({
            material: options.materials.wick,
            scale: options.scale,
        });

        candleGroup.add(wick);

        const flame = this.#buildFlame({
            material: options.materials.flame,
            scale: options.scale,
        });

        flame.position.set(0, 0.25 * scale, 0);
        // flame.rotateX(Math.PI);
        candleGroup.add(flame);

        return Object.assign(candleGroup, {
            __height: 0.3 * scale,
            __radius: 0.025 * scale,
        });
    }
}
