import * as THREE from 'three';
import { line } from '../MyMaterials.js';

export class MyBeetleFactory {
    constructor() {
        this.points = [];
    }

    #generateHalfCircle(radius, position = new THREE.Vector3(0, 0, 0)) {
        const points = [
            new THREE.Vector3(-radius, 0, 0),
            new THREE.Vector3(-radius, (4/3) * radius, 0),
            new THREE.Vector3(radius, (4/3) * radius, 0),
            new THREE.Vector3(radius, 0, 0),
        ];

        return this.#initBezierCurve(points, 50, position);
    }

    #generateQuarterCircle(radius, position = new THREE.Vector3(0, 0, 0)) {
        const points = [
            new THREE.Vector3(0, radius, 0),
            new THREE.Vector3(radius, radius, 0),
            new THREE.Vector3(radius, 0, 0),
        ];
        
        return this.#initBezierCurve(points, 50, position);
    }

    #drawHull(position, points) {
        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        let lineObj = new THREE.Line( geometry, line.basic );

        console.log(points);
        // set initial position
        lineObj.position.set(position.x,position.y,position.z)

        return lineObj;
    }

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



    buildBeetle(scale = 1) {
        const wheelsRadius = 3 * scale / 8;
        const visorRadius = scale / 2;
        const frontRadius = scale / 2;
        const backRadius = scale;

        const beetleGroup = new THREE.Group();

        const beetleBack = this.#generateQuarterCircle(backRadius);
        beetleBack.rotateZ(Math.PI / 2);
        beetleGroup.add(beetleBack);

        const beetleVisor = this.#generateQuarterCircle(visorRadius);
        beetleVisor.position.set(0, backRadius / 2, 0);
        beetleGroup.add(beetleVisor);

        const beetleFront = this.#generateQuarterCircle(frontRadius);
        beetleFront.position.set(visorRadius, 0, 0);
        beetleGroup.add(beetleFront);

        const beetleWheel = this.#generateHalfCircle(wheelsRadius);
        beetleWheel.position.set((-3/5) * scale, 0, 0);
        beetleGroup.add(beetleWheel);

        const beetleWheel2 = this.#generateHalfCircle(wheelsRadius);
        beetleWheel2.position.set((3/5) * scale, 0, 0);
        beetleGroup.add(beetleWheel2);

        return beetleGroup;
    }
}
