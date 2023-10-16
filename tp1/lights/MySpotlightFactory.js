import * as THREE from 'three';


export class MySpotlightFactory {
    buildSpotlight({ color = 0xffffff, intensity, angle, distance = 0, penumbra = 1, decay = 0 }) {
        const light = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
        light.castShadow = true;
        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 4096;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 100;
        light.shadow.camera.left = -15;
        light.shadow.camera.right = 15;
        light.shadow.camera.bottom = -15;
        light.shadow.camera.top = 15;

        const helper = new THREE.SpotLightHelper(light);

        const onAdd = (/** @type {THREE.Event<"added", THREE.Object3D>} */ ev) => {
            if (ev.target.parent) {
                helper.removeFromParent();
                ev.target.parent.add(helper);
                ev.target.parent.addEventListener("added", onAdd);
            }

            helper.update();

            ev.target.removeEventListener("added", onAdd);
        }

        light.addEventListener('added', onAdd);

        return Object.assign(
            light, {
                __angle: angle,
            }
        );

    }
}