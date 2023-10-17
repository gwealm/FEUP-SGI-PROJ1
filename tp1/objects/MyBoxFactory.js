import * as THREE from "three";
import { box } from "../MyMaterials.js";

/**
 * Factory class for creating boxes.
 */
export class MyBoxFactory {
    /**
     * Creates an instance of MyBoxFactory.
     * @param {keyof box} variant - The variant of the box material.
     */
    constructor(variant) {
        this.material = box[variant];
    }

    /**
     * Builds a box with specified dimensions and initial position.
     * @param {number} width - The width of the box.
     * @param {number} height - The height of the box.
     * @param {number} depth - The depth of the box.
     * @param {THREE.Vector3} initialPosition - The initial position of the box.
     * @returns {THREE.Mesh} - The 3D object representing the box.
     */
    buildBox(
        width,
        height,
        depth,
        initialPosition = new THREE.Vector3(0, 0, 0)
    ) {
        const boxGeometry = new THREE.BoxGeometry(width, height, depth);
        boxGeometry.translate(
            initialPosition.x,
            initialPosition.y,
            initialPosition.z
        );

        const box = new THREE.Mesh(boxGeometry, this.material);
        box.castShadow = true;
        box.receiveShadow = true;

        Object.assign(box, {
            __width: width,
            __height: height,
            __depth: depth,
        });

        return box;
    }
}
