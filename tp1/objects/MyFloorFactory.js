import { floor } from "../MyMaterials.js";
import * as THREE from 'three';

export class MyFloorFactory {

    /**
     * @param {keyof floor} variant 
     */
    constructor(variant) {
        /**
         * @type {THREE.MeshPhongMaterial}
         */
        this.material = floor[variant];
    }

    buildFloor(scaleX = 1, scaleY = 1) {
        const width = scaleX;
        const height = scaleY;

        // Create a Cube Mesh with basic material
        let box = new THREE.PlaneGeometry(
            width,
            height,
        );

        box.rotateX(Math.PI / 2);

        let mesh = Object.assign(
            new THREE.Mesh(box, this.material), {
                __width: width,
                __height: height,
            }
        );

        mesh.receiveShadow = true;

        return mesh;
    }
}