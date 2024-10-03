import * as THREE from 'three';

/**
 * Class for creating and configuring a point light.
 */
export class MyPointLightFactory {

    /**
     * Builds and configures a point light with optional parameters.
     * @param {object} options - Configuration options for the point light.
     * @param {THREE.Color | string | number} options.color - The color of the light.
     * @param {number} [options.intensity=1] - The intensity of the light.
     * @param {number} [options.distance=0] - The distance of the light.
     * @param {number} [options.decay=2] - The decay factor of the light.
     * @param {boolean} [options.castShadow=false] - Flag indicating whether the light casts shadows.
     * @returns {THREE.PointLight} - The configured point light.
     */
    build({ color, intensity = 1, distance = 0, decay = 2, castShadow = false }) {

        const light = new THREE.PointLight(color, intensity, distance, decay);
        light.castShadow = castShadow;

        const sphereSize = 0.5;
        const helper = new THREE.PointLightHelper(
            light,
            sphereSize
        );

        const onUpdateHelpers = (ev) => {
            helper.visible = ev.displayHelpers;
            helper.update();
        }

        const onAdd = (/** @type {THREE.Event<"added", THREE.Object3D>} */ ev) => {
            if (ev.target.parent) {
                helper.removeFromParent();
                ev.target.parent.add(helper);

                ev.target.parent.addEventListener("added", onAdd);
                ev.target.parent.addEventListener("custom:updateHelpers", onUpdateHelpers);
            }

            helper.update();

            ev.target.removeEventListener("added", onAdd);
            ev.target.removeEventListener("custom:updateHelpers", onUpdateHelpers);
        }

        light.addEventListener('added', onAdd);
        light.addEventListener('custom:updateHelpers', onUpdateHelpers);

        return light;
    }
}