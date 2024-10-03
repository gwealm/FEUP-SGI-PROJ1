import * as THREE from "three";
import { NURBSSurface } from "three/addons/curves/NURBSSurface.js";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";

/**
 * A builder class for constructing NURBS surfaces in a 3D space.
 */
class MyNurbsBuilder {
    /**
     * Builds a NURBS surface geometry based on the provided control points and parameters.
     *
     * @param {Array<Array<Array<number>>>} controlPoints - The control points defining the surface.
     * @param {number} degree1 - The degree of the NURBS surface in the first direction.
     * @param {number} degree2 - The degree of the NURBS surface in the second direction.
     * @param {number} samples1 - The number of samples in the first direction.
     * @param {number} samples2 - The number of samples in the second direction.
     * @returns {ParametricGeometry} - The constructed NURBS surface geometry.
     */
    build(controlPoints, degree1, degree2, samples1, samples2) {
        const knots1 = [];

        const knots2 = [];

        for (var i = 0; i <= degree1; i++) {
            knots1.push(0);
        }

        for (var i = 0; i <= degree1; i++) {
            knots1.push(1);
        }

        for (var i = 0; i <= degree2; i++) {
            knots2.push(0);
        }

        for (var i = 0; i <= degree2; i++) {
            knots2.push(1);
        }

        let stackedPoints = [];

        for (var i = 0; i < controlPoints.length; i++) {
            let row = controlPoints[i];

            let newRow = [];

            for (var j = 0; j < row.length; j++) {
                let item = row[j];

                newRow.push(
                    new THREE.Vector4(item[0], item[1], item[2], item[3])
                );
            }

            stackedPoints[i] = newRow;
        }

        const nurbsSurface = new NURBSSurface(
            degree1,
            degree2,
            knots1,
            knots2,
            stackedPoints
        );

        const geometry = new ParametricGeometry(
            getSurfacePoint,
            samples1,
            samples2
        );

        return geometry;

        /**
         * Function to calculate the surface point for a given set of parameters.
         *
         * @private
         * @param {number} u - The parameter in the first direction.
         * @param {number} v - The parameter in the second direction.
         * @param {THREE.Vector3} target - The target vector to store the calculated point.
         * @returns {THREE.Vector3} - The calculated surface point.
         */
        function getSurfacePoint(u, v, target) {
            return nurbsSurface.getPoint(u, v, target);
        }
    }
}

export { MyNurbsBuilder };
