import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

export class MyRectLightFactory {
    buildRectLight(scaleX = 1, scaleY = 1) {
        const width = scaleX;
        const height = scaleY;

        const light = new THREE.RectAreaLight(
            "#4040ff",
            1,
            width,
            height
        )

        light.castShadow = true;

        const helper = new RectAreaLightHelper(light);
        light.add(helper);

        return Object.assign(
            light, {
                __width: width,
                __height: height,
            }
        );
    }
}