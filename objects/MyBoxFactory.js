import * as THREE from "three";

/**
 * Factory class for creating boxes.
 */
export class MyBoxFactory {
    /**
     * Builds a box with specified dimensions and initial position.
     * @param {object} options The options to control the box construction.
     * @param {THREE.Material} options.material The material to use for the box.
     * @param {number=} options.scaleX The scale factor along the X-axis for the box.
     * @param {number=} options.scaleY The scale factor along the Y-axis for the box.
     * @param {number=} options.scaleZ The scale factor along the Z-axis for the box.
     * @returns The 3D object representing the box.
     */
    build(
        options,
    ) {
        const scaleX = options.scaleX ?? 1;
        const scaleY = options.scaleY ?? 1;
        const scaleZ = options.scaleZ ?? 1;

        const boxGeometry = new THREE.BoxGeometry(scaleX, scaleY, scaleZ);
        const box = new THREE.Mesh(boxGeometry, options.material);

        box.castShadow = true;
        box.receiveShadow = true;

        return Object.assign(box, {
            __width: scaleX,
            __height: scaleY,
            __depth: scaleZ,
        });
    }
}
