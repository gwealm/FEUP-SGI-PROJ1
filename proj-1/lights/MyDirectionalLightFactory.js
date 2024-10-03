import * as THREE from "three";

/**
 * Class for creating and configuring a directional light.
 */
export class MyDirectionalLightFactory {
    /**
     * Builds and configures a directional light with shadows.
     * @returns {THREE.DirectionalLight} - The configured directional light.
     */
    buildDirectionalLight() {
        const light = new THREE.DirectionalLight(0xffffff, 5);
        light.castShadow = true;
        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 4096;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 100;
        light.shadow.camera.left = -15;
        light.shadow.camera.right = 15;
        light.shadow.camera.bottom = -15;
        light.shadow.camera.top = 15;

        const helper = new THREE.DirectionalLightHelper(light, 10);
        light.addEventListener("added", () => {
            light.parent.add(helper);
            helper.update();
        });

        return light;
    }
}
