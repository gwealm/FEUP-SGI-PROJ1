import * as THREE from 'three';
import { line } from '../MyMaterials.js';

export class MySpringFactory {


    #initBezierCurve(points, numberOfSamples = 50, position = new THREE.Vector3(0, 0, 0)) {

        let curve = null;

        this.#drawHull(position, points);

        if (points.length == 3) {
            curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
        } else if (points.length == 4) {
            curve = new THREE.CubicBezierCurve3(points[0], points[1], points[2], points[3]);
        } else {
            throw "Invalid number of points";
        }

        // sample a number of points on the curve
        let sampledPoints = curve.getPoints(numberOfSamples);

        let curveGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);

        let lineObj = new THREE.Line(curveGeometry, line.basic)

        lineObj.position.set(position.x,position.y,position.z)

        return lineObj;
    }

    #drawHull(position, points) {
        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        let lineObj = new THREE.Line( geometry, line.basic );

        console.log(points);
        // set initial position
        lineObj.position.set(position.x,position.y,position.z)

        return lineObj;
    }


    buildSpring(scale = 1, scaleY = 1, numLoops = 4, position = new THREE.Vector3(0, 0, 0)) {
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

            spring.add(this.#initBezierCurve(firstHalfPoint, 50, position));

            const secondHalfPoints = [
                new THREE.Vector3(0, currentGrowth + (3*growthRate), -scale / 2),
                new THREE.Vector3(-4 / 3 * scale / 2, currentGrowth + (2*growthRate), - scale / 2),
                new THREE.Vector3(-4 / 3 * scale / 2, currentGrowth + (1*growthRate), scale / 2),
                new THREE.Vector3(0, currentGrowth + (0*growthRate), scale / 2),
            ]

            currentGrowth += growthRate * 3;

            let secondHalfCurve = this.#initBezierCurve(secondHalfPoints, 50, position);

            spring.add(secondHalfCurve);
        }

        spring.position.set(position.x, position.y, position.z);
        
        return spring;
    }
}
