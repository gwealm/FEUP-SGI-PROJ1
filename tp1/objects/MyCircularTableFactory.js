import { table } from "../MyMaterials.js";
import * as THREE from 'three';

export class MyCircularTableFactory {
    /**
     * @param {keyof table} variant 
     */
    constructor(variant) {
        this.material = table[variant];
    }


    buildCircularTable(scale = 1, initialPosition = new THREE.Vector3(0, 0, 0)) {
        const radius = 0.5 * scale;
        const height = 0.5 * scale;
        const radialSegments = 62; // Default radial segments

        const tableGeometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments);

        tableGeometry.translate(initialPosition.x, initialPosition.y, initialPosition.z);


        const circularTable = new THREE.Mesh(tableGeometry, this.material);

        return circularTable;
    }
}