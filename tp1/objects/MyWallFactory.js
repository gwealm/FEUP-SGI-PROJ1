import { wall } from "../MyMaterials.js";
import * as THREE from "three";

/**
 * MyWallFactory class for creating 3D walls.
 */
export class MyWallFactory {
    /**
     * Constructor for MyWallFactory.
     * @param {string} variant - The variant for the wall material.
     */
    constructor(variant) {
        this.material = wall[variant];
    }

    /**
     * Builds a 3D wall.
     * @param {number} scaleX - Scale factor for the width.
     * @param {number} scaleY - Scale factor for the height.
     * @returns {THREE.Mesh} - The 3D object representing the wall.
     */
    buildWall(scaleX = 1, scaleY = 1) {
        const width = scaleX;
        const height = scaleY;

        // Create a Cube Mesh with basic material
        let box = new THREE.PlaneGeometry(width, height, 512, 512);

        const boxMesh = new THREE.Mesh(box, this.material);
        boxMesh.receiveShadow = true;

        return Object.assign(boxMesh, {
            __width: width,
            __height: height
            /**
             * Builds a complete 3D table.
             * @param {number} width - Width of the table.
             * @param {number} height - Height of the table.
             * @param {number} depth - Depth of the table.
             * @param {number} legHeight - Height of the table legs.
             * @param {number} legRadius - Radius of the table legs.
             * @returns {THREE.Group} - The 3D object representing the complete table.
             */,
        });
    }
}
