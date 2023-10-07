import * as THREE from 'three';

export class MyDirectionalLightFactory {
    buildDirectionalLight() {
        const light = new THREE.DirectionalLight(0xffffff, 5);
        light.castShadow = true;

        const helper = new THREE.DirectionalLightHelper(light, 10);
        light.addEventListener('added', () => {
            light.parent.add(helper);
            helper.update()
        });

        return light;
    }
}