import * as THREE from "three";
import { MyBezierCurveFactory } from "./MyBezierCurveFactory.js";

/**
 * Class for generating a spring-like 3D shape using Bezier curves
 */
export class MySpringFactory {
    /**
     * Constructor for MySpringFactory class.
     */
    constructor() {
        this.bezierCurveFactory = new MyBezierCurveFactory("basic");
    }

    /**
     * Builds a spring-like 3D shape with specified parameters.
     * @param {number} scale - The overall scale of the spring.
     * @param {number} scaleY - The vertical scale of the spring.
     * @param {number} numLoops - The number of loops in the spring.
     * @returns {THREE.Group} - The 3D spring model as a Three.js group.
     */
    buildSpring(scale = 1, scaleY = 1, numLoops = 4) {
        let spring = new THREE.Group();
        let currentGrowth = 0;
        const growthRate = scaleY / 6;

        for (let i = 0; i < numLoops; i++) {
            const firstHalfPoint = [
                new THREE.Vector3(0, currentGrowth, -scale / 2),
                new THREE.Vector3(
                    ((4 / 3) * scale) / 2,
                    currentGrowth + 1 * growthRate,
                    -scale / 2
                ),
                new THREE.Vector3(
                    ((4 / 3) * scale) / 2,
                    currentGrowth + 2 * growthRate,
                    scale / 2
                ),
                new THREE.Vector3(0, currentGrowth + 3 * growthRate, scale / 2),
            ];

            currentGrowth += growthRate * 3;

            const firstHalfCurve = this.bezierCurveFactory.build(
                firstHalfPoint,
                50,
                false,
                true
            );
            spring.add(firstHalfCurve);

            const secondHalfPoints = [
                new THREE.Vector3(
                    0,
                    currentGrowth + 3 * growthRate,
                    -scale / 2
                ),
                new THREE.Vector3(
                    ((-4 / 3) * scale) / 2,
                    currentGrowth + 2 * growthRate,
                    -scale / 2
                ),
                new THREE.Vector3(
                    ((-4 / 3) * scale) / 2,
                    currentGrowth + 1 * growthRate,
                    scale / 2
                ),
                new THREE.Vector3(0, currentGrowth + 0 * growthRate, scale / 2),
            ];

            currentGrowth += growthRate * 3;

            let secondHalfCurve = this.bezierCurveFactory.build(
                secondHalfPoints,
                50,
                false,
                true,
            );

            spring.add(secondHalfCurve);
        }

        return Object.assign(spring, {
            __height: currentGrowth,
            __width: scale,
        });
    }
}
