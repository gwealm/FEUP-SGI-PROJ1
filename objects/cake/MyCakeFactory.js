import * as THREE from "three";

/**
 * Class for creating a 3D cake model with a dish, base, and candle.
 */
export class MyCakeFactory {
    /**
     * Constructor for MyCakeFactory class.
     * @param {import('./MyCandleFactory.js').MyCandleFactory} candleFactory
     * @param {import('./MyDishFactory.js').MyDishFactory} dishFactory 
     */
    constructor(candleFactory, dishFactory) {
        this.candleFactory = candleFactory;
        this.dishFactory = dishFactory;
    }

    /**
     * Builds the base of the cake.
     * @param {object} options Options to control cake base construction.
     * @param {THREE.Material} options.material The material to use for the cake base.
     * @param {number} options.scale The overall scale of the cake base.
     * @returns The 3D mesh representing the cake base.
     */
    #buildBase(options) {
        const { scale, material } = options;

        const radius = 0.5 * scale;
        const height = 0.25 * scale;
        const radialSegments = 32; // Default radial segments
        const thetaStart = 0; // Default theta start
        const thetaLength = (7 * Math.PI) / 4;

        const circleShape = new THREE.Shape();
        circleShape.absellipse(
            0,
            0,
            radius,
            radius,
            thetaStart,
            thetaLength,
            false,
            0
        );
        circleShape.lineTo(0, 0);

        const cakeGeometry = new THREE.ExtrudeGeometry(circleShape, {
            depth: height,
            curveSegments: radialSegments,
            bevelEnabled: false,
        });

        cakeGeometry.rotateX(Math.PI / 2);
        cakeGeometry.translate(0, height / 2, 0);

        // return new THREE.Mesh(cakeGeometry, cake.base);
        let cakeMesh = Object.assign(new THREE.Mesh(cakeGeometry, material), {
            __radius: radius,
            __height: height,
        });

        cakeMesh.castShadow = true;
        cakeMesh.receiveShadow = true;

        return cakeMesh;
    }

    /**
     * Builds a complete 3D cake model with a dish, base, and candle.
     * @param {object} options Options to control cake construction.
     * @param {object} options.materials The materials to use for the cake.
     * @param {THREE.Material} options.materials.dish The material to use for the cake dish.
     * @param {THREE.Material} options.materials.base The material to use for the cake base.
     * @param {object} options.materials.candle The materials to use for the candle.
     * @param {THREE.Material} options.materials.candle.wick The material to use for the candle wick.
     * @param {THREE.Material} options.materials.candle.flame The material to use for the candle flame.
     * @param {number=} options.scale The overacandlell scale of the cake.
     * @returns The 3D group representing the cake.
     */
    build(options) {
        const scale = options.scale ?? 1;

        const cakeGroup = new THREE.Group();

        const dish = this.dishFactory.buildDish({
            material: options.materials.dish,
            scale,
        });

        dish.position.set(0, dish.__height / 2, 0);
        cakeGroup.add(dish);

        const base = this.#buildBase({
            material: options.materials.base,
            scale,
        });

        base.position.set(0, dish.__height + base.__height / 2, 0);
        cakeGroup.add(base);

        const candle = this.candleFactory.build({
            materials: options.materials.candle,
            scale,
        });

        candle.position.set(
            -candle.__radius,
            dish.__height + base.__height + candle.__height / 2,
            0
        );

        cakeGroup.add(candle);

        cakeGroup.castShadow = true;

        return cakeGroup;
    }
}
