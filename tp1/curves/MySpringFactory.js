import * as THREE from "three";

/**
 * Class for generating a spring-like 3D shape using Bezier curves
 */
export class MySpringFactory {
    /**
     * Constructor for MySpringFactory class.
     * @param {import('./MyBezierCurveFactory.js').MyBezierCurveFactory} bezierCurveFactory
     */
    constructor(bezierCurveFactory) {
        this.bezierCurveFactory = bezierCurveFactory;
    }

    /**
     * Builds a spring-like 3D shape with specified parameters.
     * @param {object} options Options to control spring construction.
     * @param {THREE.Material} options.material - The material to use for the spring.
     * @param {number=} options.scaleXZ - The horizontal scale of the spring.
     * @param {number=} options.scaleY The vertical scale of the spring.
     * @param {number=} options.numLoops The number of loops in the spring.
     * @returns The 3D spring model as a Three.js group.
     */
    build(options) {
        const { scaleXZ = 1, scaleY = 1, numLoops = 4 } = options;

        let spring = new THREE.Group();
        let currentGrowth = 0;
        const growthRate = scaleY / 6;

        for (let i = 0; i < numLoops; i++) {
            const firstHalfPoint = [
                new THREE.Vector3(0, currentGrowth, -scaleXZ / 2),
                new THREE.Vector3(
                    ((4 / 3) * scaleXZ) / 2,
                    currentGrowth + 1 * growthRate,
                    -scaleXZ / 2
                ),
                new THREE.Vector3(
                    ((4 / 3) * scaleXZ) / 2,
                    currentGrowth + 2 * growthRate,
                    scaleXZ / 2
                ),
                new THREE.Vector3(0, currentGrowth + 3 * growthRate, scaleXZ / 2),
            ];

            currentGrowth += growthRate * 3;

            const firstHalfCurve = this.bezierCurveFactory.buildCurve(firstHalfPoint);
            const firstHalfTube = this.bezierCurveFactory.rasterizeToTube(firstHalfCurve, {
                material: options.material,
                radius: 0.1 * scaleXZ,
                samples: 50,
            });

            firstHalfTube.castShadow = true;

            spring.add(firstHalfTube);

            const secondHalfPoints = [
                new THREE.Vector3(
                    0,
                    currentGrowth + 3 * growthRate,
                    -scaleXZ / 2
                ),
                new THREE.Vector3(
                    ((-4 / 3) * scaleXZ) / 2,
                    currentGrowth + 2 * growthRate,
                    -scaleXZ / 2
                ),
                new THREE.Vector3(
                    ((-4 / 3) * scaleXZ) / 2,
                    currentGrowth + 1 * growthRate,
                    scaleXZ / 2
                ),
                new THREE.Vector3(0, currentGrowth + 0 * growthRate, scaleXZ / 2),
            ];

            currentGrowth += growthRate * 3;

            const secondHalfCurve = this.bezierCurveFactory.buildCurve(secondHalfPoints);
            const secondHalfTube = this.bezierCurveFactory.rasterizeToTube(secondHalfCurve, {
                material: options.material,
                radius: 0.1 * scaleXZ,
                samples: 50,
            });

            secondHalfTube.castShadow = true;

            spring.add(secondHalfTube);
        }

        return Object.assign(spring, {
            __height: currentGrowth,
            __width: scaleXZ,
        });
    }
}
