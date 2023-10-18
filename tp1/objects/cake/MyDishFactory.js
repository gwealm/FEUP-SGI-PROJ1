import * as THREE from "three";

/**
 * Class for creating a 3D dish model using a cylinder geometry.
 */
export class MyDishFactory {
    /**
     * Builds a 3D dish model with specified scales.
     * @param {object} options Options to control dish construction.
     * @param {THREE.Material} options.material The material to use for the dish.
     * @param {number=} options.scale The scale factor for the dish.
     * @returns The 3D mesh representing the dish.
     * @throws {Error} - Throws an error if radiusTop is not greater than radiusBottom.
     */
    buildDish(options) {
        const scale = options.scale ?? 1;

        const radiusTop = scale;
        const radiusBottom = 0.4 * scale;
        const height = scale * 0.2;

        if (radiusTop <= radiusBottom) {
            throw new Error("radiusTop must be bigger than radiusBottom");
        }

        let radialSegments = 32;
        let heightSegments = 15;

        // Create a Cylinder Mesh with basic material
        let cylinder = new THREE.CylinderGeometry(
            radiusTop,
            radiusBottom,
            height,
            radialSegments,
            heightSegments
        );

        let dishMesh = Object.assign(
            new THREE.Mesh(cylinder, options.material), {
                __radius_top: radiusTop,
                __radius_bottom: radiusBottom,
                __height: height,
            }
        );

        dishMesh.castShadow = true;
        dishMesh.receiveShadow = true;

        return dishMesh;
    }
}
