import * as THREE from "three";


export class MyLightBuilder {

    buildRepresentation(representation) {
        console.log("MyLightBuilder#buildRepresentation")

        const mesh = this.#buildBaseRepresentation(representation);

        return mesh;
    }

    #buildBaseRepresentation(representation, ctx) {
        switch (representation.type) {
            case 'spotlight': 
                return this.#buildSpotLight(representation)
            case 'pointlight':
                return this.#buildPointLight(representation)
            case 'directionallight':
                return this.#buildDirectionalLight(representation)
        
            default:
                throw new Error(`Representation of type ${representation.type} not supported.`);
        }
    }

    #buildSpotLight(representation) {
        const {
            id,
			color,
			position,
			target,
			angle,
            enabled,
			intensity,
			distance,
			decay,
			penumbra,
			castshadow,
            shadowfar,
            shadowmapsize,
        } = representation;

        const spotLight = new THREE.SpotLight(
            color,
            intensity,
            distance,
            angle,
            penumbra,
            decay
        );

        spotLight.position.set(position[0], position[1], position[2]);

        const targetObject = new THREE.Object3D();
        targetObject.position.set(target[0], target[1], target[2]);
        spotLight.target = targetObject;

        spotLight.visible = enabled;

        /** @type {(THREE.Object3D & { update(): void })[]} */
        const helpers = [];
        helpers.push(new THREE.SpotLightHelper(spotLight));

        if (castshadow) {
            spotLight.castShadow = castshadow;
            spotLight.shadow.mapSize.width = shadowmapsize;
            spotLight.shadow.mapSize.height = shadowmapsize;
            spotLight.shadow.camera.far = shadowfar;

            const cameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
            helpers.push(cameraHelper);
        }

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

        spotLight.addEventListener("added", onAdd);
        spotLight.addEventListener("custom:updateHelpers", onUpdateHelpers);

        return spotLight;
    }

    #buildPointLight(representation) {
        const {
            id,
			color,
			position,
            enabled,
			intensity,
			distance,
			decay,
			castshadow,
            shadowfar,
            shadowmapsize,
        } = representation;

        const pointLight = new THREE.PointLight(color, intensity, distance, decay);

        pointLight.position.set(...position);

        pointLight.visible = enabled;

        if (castshadow) {
            pointLight.castShadow = true;
            pointLight.shadow.mapSize.width = shadowmapsize;
            pointLight.shadow.mapSize.height = shadowmapsize;
            pointLight.shadow.camera.far = shadowfar;
        }

        const sphereSize = 0.5;
        const helper = new THREE.PointLightHelper(
            pointLight,
            sphereSize
        );
        
        
        const onUpdateHelpers = (ev) => {
            helper.visible = ev.displayHelpers;
            helper.update();
        }

        const onAdd = (/** @type {THREE.Event<"added", THREE.Object3D>} */ ev) => {
            console.log("added")
            if (ev.target.parent) {
                console.log(ev.target.parent)
                helper.removeFromParent();
                ev.target.parent.add(helper);

                ev.target.parent.addEventListener("added", onAdd);
                ev.target.parent.addEventListener("custom:updateHelpers", onUpdateHelpers);
            }

            helper.update();

            ev.target.removeEventListener("added", onAdd);
            ev.target.removeEventListener("custom:updateHelpers", onUpdateHelpers);
        }

        pointLight.addEventListener('added', onAdd);
        pointLight.addEventListener('custom:updateHelpers', onUpdateHelpers);

        return pointLight;
    }

    #buildDirectionalLight(representation) {
        const {
            id,
			color,
			position,
            enabled,
			intensity,
			castshadow,
            shadowleft,
            shadowright,
            shadowbottom,
            shadowtop,
            shadowfar,
            shadowmapsize,
        } = representation;
        
        const directionalLight = new THREE.DirectionalLight(color, intensity);

        directionalLight.visible = enabled;

        directionalLight.position.set(position[0], position[1], position[2]);

        /** @type {(THREE.Object3D & { update(): void })[]} */
        const helpers = [];
        helpers.push(new THREE.DirectionalLightHelper(directionalLight));

        if (castshadow) {
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = shadowmapsize;
            directionalLight.shadow.mapSize.height = shadowmapsize;
            directionalLight.shadow.camera.left = shadowleft;
            directionalLight.shadow.camera.right = shadowright;
            directionalLight.shadow.camera.bottom = shadowbottom;
            directionalLight.shadow.camera.top = shadowtop;
            directionalLight.shadow.camera.far = shadowfar;

            const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
            helpers.push(cameraHelper);
        }

        const lightHelper = new THREE.DirectionalLightHelper(directionalLight);
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

        directionalLight.addEventListener("added", onAdd);
        directionalLight.addEventListener("custom:updateHelpers", onUpdateHelpers);

        return directionalLight;
    }
}
