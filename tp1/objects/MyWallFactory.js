import { wall } from "../MyMaterials.js";
import * as THREE from 'three';

export class MyWallFactory {
    constructor(variant) {
        this.material = wall[variant];
    }

    buildWall(width, height, depth) {
        // Create a Cube Mesh with basic material
        let box = new THREE.PlaneGeometry(
            width,
            height,
            depth,
        );

        return new THREE.Mesh(box, this.material);
    }
}