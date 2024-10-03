import * as THREE from "three";

/** @typedef {THREE.Object3D & { update(): void }} LightHelper */
/** @typedef {{ light: THREE.Light, helpers: LightHelper[] }} LightDescriptor */

/**
 * A builder class for creating lights and their associated helpers used in the application.
 */
export class MyLightBuilder {
    /**
     * Creates an instance of MyLightBuilder.
     * @param {import('./types').CustomEventDispatcher} eventDispatcher - The custom event dispatcher.
     */
    constructor(eventDispatcher) {
        this.eventDispatcher = eventDispatcher;
    }

    /**
     * Builds a light and its helpers based on the provided light representation.
     *
     * @param {import('./types').SceneGraph.LightNode} representation - The light representation.
     * @returns {THREE.Object3D} - The constructed light.
     */
    buildLight(representation) {
        const { light, helpers } = this.#buildDescriptor(representation);

        const { enabled, id, position } = representation;

        light.name = id;
        light.visible = enabled;
        this.#injectLightToggleListeners(light);

        light.position.set(...position);

        const onAdd = (
            /** @type {THREE.Event<"added", THREE.Object3D>} */ ev
        ) => {
            if (!!ev.target.parent) {
                for (const helper of helpers) {
                    helper.removeFromParent();
                    ev.target.parent.add(helper);
                }

                ev.target.parent.addEventListener("added", onAdd);
            }

            for (const helper of helpers) {
                helper.update();
            }

            ev.target.removeEventListener("added", onAdd);
        };

        light.addEventListener("added", onAdd);
        this.eventDispatcher.addEventListener(
            "custom:light:helpers:setvisible",
            (ev) => {
                for (const helper of helpers) {
                    helper.visible = ev.visible;
                }
            }
        );
        
        if ("target" in light) {
            return new THREE.Group().add(light, light.target);
        }

        return light;
    }

    /**
     * Builds a light descriptor based on the type of light specified in the representation.
     *
     * @param {import('./types').SceneGraph.LightNode} light - The light representation.
     * @returns {LightDescriptor} - The light descriptor containing the light and its helpers.
     * @throws Will throw an error if the type of light is not supported.
     */
    #buildDescriptor(light) {
        switch (light.type) {
            case "spotlight":
                return this.#buildSpotLight(light);
            case "pointlight":
                return this.#buildPointLight(light);
            case "directionallight":
                return this.#buildDirectionalLight(light);

            default:
                // @ts-ignore
                throw new Error(
                    `Representation of type ${light.type} not supported.`
                );
        }
    }

    /**
     * Builds a spot light and its helpers based on the provided spot light representation.
     *
     * @param {import('./types').SceneGraph.LightNode & { type: "spotlight" }} light - The spot light representation.
     * @returns {LightDescriptor} - The light descriptor containing the spot light and its helpers.
     */
    #buildSpotLight(light) {
        const {
            color,
            target,
            angle,
            intensity,
            distance,
            decay,
            penumbra,
            castshadow,
            shadowfar,
            shadowmapsize,
        } = light;

        const spotLight = new THREE.SpotLight(
            color,
            intensity,
            distance,
            angle,
            penumbra,
            decay
        );

        spotLight.target.position.set(...target);

        /** @type {LightHelper[]} */
        const helpers = [];
        helpers.push(new THREE.SpotLightHelper(spotLight));

        if (castshadow) {
            spotLight.castShadow = true;
            spotLight.shadow.camera.fov = 2 * THREE.MathUtils.radToDeg(angle);
            spotLight.shadow.camera.far = shadowfar;
            spotLight.shadow.mapSize.width = shadowmapsize;
            spotLight.shadow.mapSize.height = shadowmapsize;

            const cameraHelper = new THREE.CameraHelper(
                spotLight.shadow.camera
            );
            helpers.push(cameraHelper);
        }

        return {
            light: spotLight,
            helpers,
        };
    }

    /**

      /**
   * Builds a point light and its helpers based on the provided point light representation.
   *
   * @param {import('./types').SceneGraph.LightNode & { type: "pointlight" }} light - The point light representation.
   * @returns {LightDescriptor} - The light descriptor containing the point light and its helpers.
   */
    #buildPointLight(light) {
        const {
            color,
            intensity,
            distance,
            decay,
            castshadow,
            shadowfar,
            shadowmapsize,
        } = light;

        const pointLight = new THREE.PointLight(
            color,
            intensity,
            distance,
            decay
        );

        /** @type {LightHelper[]} */
        const helpers = [];
        helpers.push(new THREE.PointLightHelper(pointLight));

        if (castshadow) {
            pointLight.castShadow = true;
            pointLight.shadow.camera.far = shadowfar;
            pointLight.shadow.mapSize.width = shadowmapsize;
            pointLight.shadow.mapSize.height = shadowmapsize;

            const cameraHelper = new THREE.CameraHelper(
                pointLight.shadow.camera
            );
            helpers.push(cameraHelper);
        }

        return {
            light: pointLight,
            helpers,
        };
    }

    /**
     * Builds a directional light and its helpers based on the provided directional light representation.
     *
     * @param {import('./types').SceneGraph.LightNode & { type: "directionallight" }} light - The directional light representation.
     * @returns {LightDescriptor} - The light descriptor containing the directional light and its helpers.
     */
    #buildDirectionalLight(light) {
        const {
            color,
            intensity,
            castshadow,
            shadowleft,
            shadowright,
            shadowbottom,
            shadowtop,
            shadowfar,
            shadowmapsize,
        } = light;

        const directionalLight = new THREE.DirectionalLight(color, intensity);

        /** @type {LightHelper[]} */
        const helpers = [];

        helpers.push(new THREE.DirectionalLightHelper(directionalLight));

        if (castshadow) {
            directionalLight.castShadow = true;
            directionalLight.shadow.camera.left = shadowleft;
            directionalLight.shadow.camera.right = shadowright;
            directionalLight.shadow.camera.bottom = shadowbottom;
            directionalLight.shadow.camera.top = shadowtop;
            directionalLight.shadow.camera.far = shadowfar;
            directionalLight.shadow.mapSize.width = shadowmapsize;
            directionalLight.shadow.mapSize.height = shadowmapsize;

            const cameraHelper = new THREE.CameraHelper(
                directionalLight.shadow.camera
            );
            helpers.push(cameraHelper);
        }

        return {
            light: directionalLight,
            helpers,
        };
    }

    /**
     * Injects event listeners for toggling the visibility of the provided light.
     *
     * @param {THREE.Light} light - The light to inject listeners into.
     */
    #injectLightToggleListeners(light) {
        this.eventDispatcher.addEventListener(
            "custom:light:setvisible",
            (ev) => {
                if (ev.name === light.name) {
                    light.visible = ev.visible;
                }
            }
        );
    }
}
