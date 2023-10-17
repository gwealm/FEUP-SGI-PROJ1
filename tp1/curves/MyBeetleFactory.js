import * as THREE from "three";
import { MyBezierCurveFactory } from "./MyBezierCurveFactory.js";

/**
 * Class for generating a simple 3D beetle model using Three.js.
 */
export class MyBeetleFactory {
    /**
     * Constructor for MyBeetleFactory class.
     */
    constructor() {
        this.bezierCurveFactory = new MyBezierCurveFactory("basic");
        this.points = [];
    }

    /**
     * Generates a half-circle curve with a specified scale.
     * @private
     * @param {number} scale - The scale of the half-circle.
     * @returns {THREE.Curve} - The generated half-circle curve.
     */
    #generateHalfCircle(scale) {
        const points = [
            new THREE.Vector3(-scale, 0, 0),
            new THREE.Vector3(-scale, (4 / 3) * scale, 0),
            new THREE.Vector3(scale, (4 / 3) * scale, 0),
            new THREE.Vector3(scale, 0, 0),
        ];

        return Object.assign(this.bezierCurveFactory.build(points, 50), {
            __radius: scale,
        });
    }

    /**
     * Generates a quarter-circle curve with a specified scale.
     * @private
     * @param {number} scale - The scale of the quarter-circle.
     * @returns {THREE.Curve} - The generated quarter-circle curve.
     */
    #generateQuarterCircle(scale) {
        const controlPointOffset = scale * (4 / 3) * (Math.sqrt(2) - 1);
        const points = [
            new THREE.Vector3(0, scale, 0),
            new THREE.Vector3(controlPointOffset, scale, 0),
            new THREE.Vector3(scale, controlPointOffset, 0),
            new THREE.Vector3(scale, 0, 0),
        ];

        return Object.assign(this.bezierCurveFactory.build(points, 50), {
            __radius: scale,
        });
    }

    /**
     * Builds a 3D beetle model with specified scale proportions.
     * @param {number} scale - The overall scale of the beetle.
     * @returns {THREE.Group} - The 3D beetle model as a Three.js group.
     */
    buildBeetle(scale = 1) {
        const backScale = scale;
        const windshieldScale = 0.5 * backScale;
        const hoodScale = windshieldScale;
        const wheelsScale = (3 * backScale) / 8;

        const beetle = new THREE.Group();

        const beetleTrunk = this.#generateQuarterCircle(backScale);
        beetleTrunk.rotateZ(Math.PI / 2);
        beetle.add(beetleTrunk);

        const beetleWindshield = this.#generateQuarterCircle(windshieldScale);
        beetleWindshield.position.set(0, 0.5 * beetleTrunk.__radius, 0);
        beetle.add(beetleWindshield);

        const beetleHood = this.#generateQuarterCircle(hoodScale);
        beetleHood.position.set(beetleWindshield.__radius, 0, 0);
        beetle.add(beetleHood);

        const beetleFrontWheel = this.#generateHalfCircle(wheelsScale);
        beetleFrontWheel.position.set(
            beetleWindshield.__radius +
                beetleHood.__radius -
                beetleFrontWheel.__radius,
            0,
            0
        );
        beetle.add(beetleFrontWheel);

        const beetleBackWheel = this.#generateHalfCircle(wheelsScale);
        beetleBackWheel.position.set(
            -beetleTrunk.__radius + beetleBackWheel.__radius,
            0,
            0
        );
        beetle.add(beetleBackWheel);

        return beetle;
    }
}
