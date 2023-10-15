import * as THREE from 'three';
import { watch } from "../MyMaterials.js";

export class MyWatchFactory {
    /**
     * @param {keyof watch} variant 
     */
    constructor(variant) {
        this.material = watch[variant];
    }


    buildWatch(scale = 1, initialPosition = new THREE.Vector3(0, 0, 0)) {
        const radius = 0.3 * scale;
        const height = 0.05 * scale;
        const radialSegments = 62; // Default radial segments

        const watchGeometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments);

        watchGeometry.translate(initialPosition.x, initialPosition.y, initialPosition.z);

        const watch = new THREE.Mesh(watchGeometry, this.material);
        watch.castShadow = true;
        
        return watch;
    }
}