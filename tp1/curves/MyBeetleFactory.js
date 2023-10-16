import * as THREE from 'three';
import { line } from '../MyMaterials.js';
import { MyBezierCurveFactory } from './MyBezierCurveFactory.js'
import { MyRectangularFrameFactory } from '../objects/painting/frame/MyRectangularFrameFactory.js';

export class MyBeetleFactory {
    constructor() {
        this.bezierCurveFactory = new MyBezierCurveFactory("basic");
        this.points = [];
    }

    #generateHalfCircle(scale) {
        const points = [
            new THREE.Vector3(-scale, 0, 0),
            new THREE.Vector3(-scale, (4/3)  * scale, 0),
            new THREE.Vector3(scale, (4/3) * scale, 0),
            new THREE.Vector3(scale, 0, 0),
        ];

        return Object.assign(
            this.bezierCurveFactory.build(points, 50),
            {
                __radius: scale,
            }
        );
    }

    #generateQuarterCircle(scale) {
        const controlPointOffset = scale * (4/3) * (Math.sqrt(2) - 1);
        const points = [
            new THREE.Vector3(0, scale, 0),
            new THREE.Vector3(controlPointOffset, scale, 0),
            new THREE.Vector3(scale, controlPointOffset, 0),
            new THREE.Vector3(scale, 0, 0),
        ];
        
        return Object.assign(
            this.bezierCurveFactory.build(points, 50),
            {
                __radius: scale,
            }
        );
    }

    buildBeetle(scale = 1) {
        const backScale = scale;
        const windshieldScale = 0.5 * backScale;
        const hoodScale = windshieldScale;
        const wheelsScale = 3 * backScale / 8;
        
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
        beetleFrontWheel.position.set(beetleWindshield.__radius + beetleHood.__radius - beetleFrontWheel.__radius, 0, 0);
        beetle.add(beetleFrontWheel);

        const beetleBackWheel = this.#generateHalfCircle(wheelsScale);
        beetleBackWheel.position.set(-beetleTrunk.__radius + beetleBackWheel.__radius, 0, 0);
        beetle.add(beetleBackWheel);

        return beetle;
    }
}
