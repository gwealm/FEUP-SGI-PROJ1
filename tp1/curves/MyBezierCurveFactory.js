import * as THREE from 'three';
import { line } from '../MyMaterials.js';

export class MyBezierCurveFactory {

    /** 
     * @param {keyof line} variant 
     */
    constructor(variant) {
        this.lineMaterial = line[variant];
    }

    #getBezierCurve(points) {        
        if (points.length !== 4)
            throw new Error("Invalid number of points");

        return new THREE.CubicBezierCurve3(points[0], points[1], points[2], points[3]);
    }

    #buildBezierCurve(points, numberOfSamples) {

        const curve = this.#getBezierCurve(points);

        // sample a number of points on the curve
        let sampledPoints = curve.getPoints(numberOfSamples);

        let curveGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);

        return new THREE.Line(curveGeometry, this.lineMaterial);
    }

    buildHull(points) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return new THREE.Line( geometry, this.lineMaterial );
    }

    build(points, numberOfSamples = 50, drawHull = false) {
        const group = new THREE.Group();

        const curve = this.#buildBezierCurve(points, numberOfSamples);
        group.add(curve);

        if (drawHull) {
            const hull = this.buildHull(points);
            group.add(hull);
        }

        return group;
    }
}
