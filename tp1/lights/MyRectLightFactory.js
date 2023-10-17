import * as THREE from "three";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

/**
 * Class for creating and configuring a rectangular area light.
 */
export class MyRectLightFactory {
    /**
     * Builds and configures a rectangular area light with the specified scale.
     * @param {number} [scaleX=1] - The scale along the x-axis.
     * @param {number} [scaleY=1] - The scale along the y-axis.
     * @returns {THREE.RectAreaLight} - The configured rectangular area light.
     */
    buildRectLight(scaleX = 1, scaleY = 1) {
        const width = scaleX;
        const height = scaleY;

        const light = new THREE.RectAreaLight("#4040ff", 1, width, height);

        light.castShadow = true;

        const helper = new RectAreaLightHelper(light);
        light.add(helper);

        return Object.assign(light, {
            __width: width,
            __height: height,
        });
    }
}
