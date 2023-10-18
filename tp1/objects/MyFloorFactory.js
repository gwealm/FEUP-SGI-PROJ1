import * as THREE from "three";

/**
 * Factory class for creating floor-like structures.
 */
export class MyFloorFactory {
    /**
     * Builds a floor with specified scales along the X and Y axes.
     * @param {object} options The options to control the floor construction.
     * @param {THREE.Material} options.material The material to use for the floor.
     * @param {number=} options.scaleX The scale along the X-axis.
     * @param {number=} options.scaleY The scale along the Y-axis.
     * @returns The 3D object representing the floor.
     */
    build(options) {
        const width = options.scaleX ?? 1;
        const height = options.scaleY ?? 1;

        let box = new THREE.PlaneGeometry(width, height);
        box.rotateX(Math.PI / 2);

        const mesh = new THREE.Mesh(box, options.material);
        mesh.receiveShadow = true;

        return Object.assign(
            mesh, {
            __width: width,
            __height: height,
        });
    }
}
