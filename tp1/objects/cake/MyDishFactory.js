import { dish } from "../../MyMaterials.js";
import * as THREE from "three";

/**
 * Class for creating a 3D dish model using a cylinder geometry.
 */
export class MyDishFactory {
    /**
     * Constructor for MyDishFactory class.
     * @param {string} variant - The variant of the dish material.
     */
    constructor(variant) {
        this.material = dish[variant];
    }

    /**
     * Builds a 3D dish model with specified scales.
     * @param {number} scale - The overall scale of the dish.
     * @returns {THREE.Mesh} - The 3D mesh representing the dish.
     * @throws {string} - Throws an error if radiusTop is not greater than radiusBottom.
     */
    buildDish(scale = 1) {
        const radiusTop = scale;
        const radiusBottom = 0.4 * scale;
        const height = scale * 0.2;

        if (radiusTop <= radiusBottom) {
            throw "radiusTop must be bigger than radiusBottom";
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

        let dishMesh = Object.assign(new THREE.Mesh(cylinder, this.material), {
            __radius_top: radiusTop,
            __radius_bottom: radiusBottom,
            __height: height,
        });

        dishMesh.castShadow = true;
        dishMesh.receiveShadow = true;

        return dishMesh;
    }
}
