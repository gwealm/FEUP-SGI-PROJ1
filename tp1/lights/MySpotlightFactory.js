import * as THREE from "three";

/**
 * Class for creating and configuring a spotlight.
 */
export class MySpotlightFactory {
    /**
     * Builds and configures a spotlight with optional parameters.
     * @param {{
     *   color: THREE.ColorRepresentation,
     *   intensity: number,
     *   angle: number,
     *   distance?: number,
     *   penumbra?: number,
     *   decay?: number
     * } & (
     *   { castShadows?: false } | {
     *     castShadows: true,
     *     shadowsOptions: { near: number, far: number, fov: number }
     *   }
     * )} options - Configuration options for the spotlight.
     * @returns {THREE.SpotLight} - The configured spotlight.
     */
    buildSpotlight({
        color = 0xffffff,
        intensity,
        angle,
        distance = 0,
        penumbra = 1,
        decay = 0,
        ...shadows
    }) {
        const light = new THREE.SpotLight(
            color,
            intensity,
            distance,
            angle,
            penumbra,
            decay
        );

        /** @type {(THREE.Object3D & { update(): void })[]} */
        const helpers = [];

        if (shadows.castShadows) {
            const { shadowsOptions } = shadows;

            light.castShadow = true;

            light.shadow.mapSize.width = 4096;
            light.shadow.mapSize.height = 4096;

            light.shadow.camera.near = shadowsOptions.near;
            light.shadow.camera.far = shadowsOptions.far;
            light.shadow.camera.fov = (shadowsOptions.fov * 180) / Math.PI;

            const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
            helpers.push(cameraHelper);
        }

        const lightHelper = new THREE.SpotLightHelper(light);
        helpers.push(lightHelper);

        const onUpdateHelpers = (ev) => {
            for (const helper of helpers) {
                helper.visible = ev.displayHelpers;
                helper.update();
            }
        };

        const onAdd = (
            /** @type {THREE.Event<"added", THREE.Object3D>} */ ev
        ) => {
            if (ev.target.parent) {
                for (const helper of helpers) {
                    helper.removeFromParent();
                    ev.target.parent.add(helper);
                }

                ev.target.parent.addEventListener("added", onAdd);
                ev.target.parent.addEventListener(
                    "custom:updateHelpers",
                    onUpdateHelpers
                );
            }

            for (const helper of helpers) {
                helper.update();
            }

            ev.target.removeEventListener("added", onAdd);
            ev.target.removeEventListener(
                "custom:updateHelpers",
                onUpdateHelpers
            );
        };

        light.addEventListener("added", onAdd);
        light.addEventListener("custom:updateHelpers", onUpdateHelpers);

        return Object.assign(light, {
            __angle: angle,
        });
    }
}
