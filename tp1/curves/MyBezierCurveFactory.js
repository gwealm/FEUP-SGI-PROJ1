import * as THREE from "three";

/**
 * Class for creating and building Bezier curves
 */
export class MyBezierCurveFactory {
    /**
     * Method to get a cubic Bezier curve from given control points.
     * @param {THREE.Vector3[]} points Control points of the Bezier curve.
     * @returns The cubic Bezier curve.
     * @throws {Error} If an invalid number of points is provided.
     */
    buildCurve(points) {
        if (points.length !== 4) throw new Error("Invalid number of points");

        return new THREE.CubicBezierCurve3(
            points[0],
            points[1],
            points[2],
            points[3]
        );
    }

    /**
     * Builds and returns the convex hull of a set of points.
     * @param {THREE.Vector3[]} points The set of points to build the hull from.
     * @param {object} options Options to control the hull construction.
     * @param {THREE.Material} options.material Material to use for the hull.
     * @returns The Three.js Line object representing the convex hull.
     */
    buildHull(points, options) {
        const geometry = new THREE.BufferGeometry()
            .setFromPoints(points);
        return new THREE.Line(geometry, options.material);
    }

    /**
     * Method to build a Buffer Geometry from a curve.
     * @param {THREE.Curve<THREE.Vector3>} curve Curve to rasterize.
     * @param {object} options Options to control the rasterization.
     * @param {THREE.Material} options.material Material to use for the line.
     * @param {number=} options.samples Number of points to sample on the curve.
     * @returns The constructed Line object representing the Bezier curve.
     */
    rasterizeToLine(curve, options) {
        const samples = options.samples ?? 5;
        const sampledPoints = curve.getPoints(samples);

        const curveGeometry = new THREE.BufferGeometry()
            .setFromPoints(sampledPoints);

        return new THREE.Line(curveGeometry, options.material);
    }

    /**
     * Method to build a Tube Geometry from a curve.
     * @param {THREE.Curve<THREE.Vector3>} curve Curve to rasterize.
     * @param {object} options Options to control the rasterization.
     * @param {THREE.Material} options.material Material to use for the line.
     * @param {number} options.radius Radius of the tube.
     * @param {number=} options.samples Number of points to sample on the curve.
     * @param {number=} options.radialSamples Number of points to sample radially on the curve.
     * @returns The constructed Line object representing the Bezier curve.
     */
    rasterizeToTube(curve, options) {
        const samples = options.samples ?? 5;

        const { radius, radialSamples } = options;
        const tubeGeometry = new THREE.TubeGeometry(curve, samples, radius, radialSamples);

        return new THREE.Mesh(tubeGeometry, options.material);
    }
}
