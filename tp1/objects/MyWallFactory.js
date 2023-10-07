import { wall } from "../MyMaterials.js";
import * as THREE from 'three';

export class MyWallFactory {
    /**
     * @param {keyof wall} variant 
     */
    constructor(variant) {
        this.material = wall[variant];
    }

    buildWall(scaleX = 1, scaleY = 1) {
        const width = scaleX;
        const height = scaleY;

        // Create a Cube Mesh with basic material
        let box = new THREE.PlaneGeometry(
            width,
            height,
            512,
            512
        );

        return Object.assign(
            new THREE.Mesh(box, this.material), {
                __width: width,
                __height: height,
            }
        );
    }
}