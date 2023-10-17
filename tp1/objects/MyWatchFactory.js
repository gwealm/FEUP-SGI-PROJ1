import * as THREE from "three";
import { watch } from "../MyMaterials.js";

/**
 * MyWatchFactory class for creating 3D watches.
 */
export class MyWatchFactory {
    /**
     * Constructor for MyWatchFactory.
     * @param {string} variant - The variant for the watch material.
     */
    constructor(variant) {
        this.material = watch[variant];
    }

    /**
     * Builds a 3D watch.
     * @param {number} scale - Scale factor for the watch size.
     * @param {THREE.Vector3} initialPosition - Initial position of the watch.
     * @returns {THREE.Mesh} - The 3D object representing the watch.
     */
    buildWatch(scale = 1, initialPosition = new THREE.Vector3(0, 0, 0)) {
        const radius = 0.3 * scale;
        const height = 0.05 * scale;
        const radialSegments = 62; // Default radial segments

        const watchGeometry = new THREE.CylinderGeometry(
            radius,
            radius,
            height,
            radialSegments
        );

        watchGeometry.translate(
            initialPosition.x,
            initialPosition.y,
            initialPosition.z
        );

        const watch = new THREE.Mesh(watchGeometry, this.material);
        watch.castShadow = true;

        return watch;
    }
}
