import * as THREE from 'three';
import { MyBezierCurveFactory } from './MyBezierCurveFactory.js'

export class MySpringFactory {
    
    constructor() {
        this.bezierCurveFactory = new MyBezierCurveFactory("basic");
    }

    buildSpring(scale = 1, scaleY = 1, numLoops = 4) {
        let spring = new THREE.Group();
        let currentGrowth = 0;
        const growthRate = scaleY / 6;

        for (let i = 0; i < numLoops; i++) {
            const firstHalfPoint = [
                new THREE.Vector3(0, currentGrowth, -scale / 2),
                new THREE.Vector3(4 / 3 * scale / 2, currentGrowth + (1*growthRate), -scale / 2),
                new THREE.Vector3(4 / 3 * scale / 2, currentGrowth + (2*growthRate), scale / 2),
                new THREE.Vector3(0, currentGrowth + (3*growthRate), scale / 2),
            ]

            currentGrowth += growthRate * 3;

            const firstHalfCurve = this.bezierCurveFactory.build(firstHalfPoint, 50, false);
            spring.add(firstHalfCurve);

            const secondHalfPoints = [
                new THREE.Vector3(0, currentGrowth + (3*growthRate), -scale / 2),
                new THREE.Vector3(-4 / 3 * scale / 2, currentGrowth + (2*growthRate), - scale / 2),
                new THREE.Vector3(-4 / 3 * scale / 2, currentGrowth + (1*growthRate), scale / 2),
                new THREE.Vector3(0, currentGrowth + (0*growthRate), scale / 2),
            ]

            currentGrowth += growthRate * 3;

            let secondHalfCurve = this.bezierCurveFactory.build(secondHalfPoints, 50, false);

            spring.add(secondHalfCurve);
        }

        Object.assign(spring, {
            __height: currentGrowth,
            __width: scale,
        });
        
        return spring;
    }
}
