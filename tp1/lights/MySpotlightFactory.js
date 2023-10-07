import * as THREE from 'three';


export class MySpotlightFactory {
    buildSpotlight({ intensity, angle, distance = 0, penumbra = 1, decay = 0 }) {
        const light = new THREE.SpotLight(0xffffff, intensity, distance, angle, penumbra, decay);
        light.castShadow = true;

        const helper = new THREE.SpotLightHelper(light);
        light.addEventListener('added', () => {
            light.parent.add(helper);
            helper.update()
        });

        return Object.assign(
            light, {
                __angle: angle,
            }
        );

    }
}