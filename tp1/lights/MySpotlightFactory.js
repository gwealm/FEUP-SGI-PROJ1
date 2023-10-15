import * as THREE from 'three';


export class MySpotlightFactory {
    buildSpotlight({ intensity, angle, distance = 0, penumbra = 1, decay = 0 }) {
        const light = new THREE.SpotLight(0xffffff, intensity, distance, angle, penumbra, decay);
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