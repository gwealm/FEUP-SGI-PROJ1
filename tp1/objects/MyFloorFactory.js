import { floor } from "../MyMaterials.js";
import * as THREE from "three";

/**
 * Factory class for creating floor-like structures.
 */
export class MyFloorFactory {
    /**
     * Creates an instance of MyFloorFactory.
     * @param {keyof floor} variant - The variant of the floor material.
     */
    constructor(variant) {
        /**
         * @type {THREE.MeshPhongMaterial}
         */
        this.material = floor[variant];
    }

    /**
     * Builds a floor with specified scales along the X and Y axes.
     * @param {number} [scaleX=1] - The scale along the X-axis.
     * @param {number} [scaleY=1] - The scale along the Y-axis.
     * @returns {THREE.Mesh} - The 3D object representing the floor.
     */
    buildFloor(scaleX = 1, scaleY = 1) {
        const width = scaleX;
        const height = scaleY;

        // Create a Cube Mesh with basic material
        let box = new THREE.PlaneGeometry(width, height);

        box.rotateX(Math.PI / 2);

        let mesh = Object.assign(new THREE.Mesh(box, this.material), {
            __width: width,
            __height: height,
        });

        mesh.receiveShadow = true;

        return mesh;
    }
}
