import * as THREE from "three";

/**
 * MyWallFactory class for creating 3D walls.
 */
export class MyWallFactory {
    /**
     * Builds a wall.
     * @param {object} options The options to control the floor construction.
     * @param {THREE.Material} options.material The material to use for the floor.
     * @param {number=} options.scaleX The scale along the X-axis.
     * @param {number=} options.scaleY The scale along the Y-axis.
     * @returns The 3D object representing the wall.
     */
    build(options) {
        const width = options.scaleX ?? 1;
        const height = options.scaleY ?? 1;

        // Create a Cube Mesh with basic material
        let box = new THREE.PlaneGeometry(width, height, 512, 512);

        const boxMesh = new THREE.Mesh(box, options.material);
        boxMesh.receiveShadow = true;

        return Object.assign(boxMesh, {
            __width: width,
            __height: height,
        });
    }
}
