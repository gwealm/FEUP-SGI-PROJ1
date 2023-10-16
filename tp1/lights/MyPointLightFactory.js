import * as THREE from 'three';

export class MyPointLightFactory {
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