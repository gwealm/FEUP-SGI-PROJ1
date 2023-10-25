import * as THREE from "three";

/**
 * MyClockFactory class for creating 3D clocks.
 */
export class MyClockFactory {
    /**
     * Builds a 3D clock.
     * @param {object} options The options to control the clock construction.
     * @param {THREE.Material[]} options.materials The materials to use for the clock.
     * @param {number=} options.scale The scale factor for the clock size.
     * @returns he 3D object representing the clock.
     */
    build(options) {
        const scale = options.scale ?? 1;

        const radius = 0.3 * scale;
        const height = 0.05 * scale;
        const radialSegments = 62; // Default radial segments

        const watchGeometry = new THREE.CylinderGeometry(
            radius,
            radius,
            height,
            radialSegments
        );

        const watch = new THREE.Mesh(watchGeometry, options.materials);
        watch.castShadow = true;

        return watch;
    }
}
