import * as THREE from 'three';
import { box } from "../MyMaterials.js";

export class MyBoxFactory {
    /**
     * @param {keyof box} variant 
     */
    constructor(variant) {
        this.material = box[variant];
    }


    buildBox(width, height, depth, initialPosition = new THREE.Vector3(0, 0, 0)) {

        const boxGeometry = new THREE.BoxGeometry(width, height, depth);
        boxGeometry.translate(initialPosition.x, initialPosition.y, initialPosition.z);

        const box = new THREE.Mesh(boxGeometry, this.material);
        box.castShadow = true;
        box.receiveShadow = true;

        return box;
    }
}