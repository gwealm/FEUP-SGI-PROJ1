import * as THREE from "three";
import { line } from "../MyMaterials.js";

/**
 * Class for creating and building Bezier curves
 */
export class MyBezierCurveFactory {
    /**
     * Constructor for MyBezierCurveFactory class.
     * @param {keyof line} variant - The variant of the line material.
     */
    constructor(variant) {
        this.lineMaterial = line[variant];
    }

    /**
     * Private method to get a cubic Bezier curve from given control points.
     * @param {THREE.Vector3[]} points - Control points of the Bezier curve.
     * @returns {THREE.CubicBezierCurve3} - The cubic Bezier curve.
     * @throws {Error} If an invalid number of points is provided.
     */
    #getBezierCurve(points) {
        if (points.length !== 4) throw new Error("Invalid number of points");

        return new THREE.CubicBezierCurve3(
            points[0],
            points[1],
            points[2],
            points[3]
        );
    }

    /**
     * Private method to build a Bezier curve from control points.
     * @param {THREE.Vector3[]} points - Control points of the Bezier curve.
     * @param {number} numberOfSamples - Number of points to sample on the curve.
     * @returns {THREE.Line} - The constructed Line object representing the Bezier curve.
     */
    #buildBezierCurve(points, numberOfSamples) {
        const curve = this.#getBezierCurve(points);

        // sample a number of points on the curve
        let sampledPoints = curve.getPoints(numberOfSamples);

        let curveGeometry = new THREE.BufferGeometry()
            .setFromPoints(sampledPoints);

        return new THREE.Line(curveGeometry, this.lineMaterial);
    }

    #buildBezierTube(points, numberOfSamples, radius) {
        const curve = this.#getBezierCurve(points);

        let tubeGeometry = new THREE.TubeGeometry(
            curve, numberOfSamples, radius
        )

        return new THREE.Mesh(tubeGeometry, this.lineMaterial);
    }

    /**
     * Builds and returns the convex hull of a set of points.
     * @param {THREE.Vector3[]} points - The set of points to build the hull from.
     * @returns {THREE.Line} - The Three.js Line object representing the convex hull.
     */
    buildHull(points) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return new THREE.Line(geometry, this.lineMaterial);
    }

    /**
     * Builds a Bezier curve and, optionally, its convex hull.
     * @param {THREE.Vector3[]} points - Control points of the Bezier curve.
     * @param {number} numberOfSamples - Number of points to sample on the curve.
     * @param {boolean} drawHull - Flag indicating whether to draw the convex hull.
     * @returns {THREE.Group} - The Three.js Group containing the Bezier curve and, optionally, its hull.
     */
    build(points, numberOfSamples = 50, drawHull = false, withVolume = false) {
        const group = new THREE.Group();

        const curve = withVolume
            ? this.#buildBezierTube(points, numberOfSamples, 0.01)
            : this.#buildBezierCurve(points, numberOfSamples);

        group.add(curve);

        if (drawHull) {
            const hull = this.buildHull(points);
            group.add(hull);
        }

        return group;
    }
}
