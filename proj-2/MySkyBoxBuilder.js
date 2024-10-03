import * as THREE from "three";

/**
 * Class responsible for building a skybox.
 */
export class MySkyboxBuilder {
    /**
     * Builds a skybox based on the provided representation.
     *
     * @param {import('./types').SceneGraph.Skybox} representation - The skybox representation.
     * @returns {THREE.Mesh} - The created skybox.
     */
    buildSkybox(representation) {
        const {
            size,
            center,
            emissive,
            intensity,
            up,
            down,
            left,
            right,
            front,
            back,
        } = representation;

        const textureLoader = new THREE.TextureLoader();
        const textures = /** @type {const} */ ([
            textureLoader.load(right),
            textureLoader.load(left),
            textureLoader.load(up),
            textureLoader.load(down),
            textureLoader.load(back),
            textureLoader.load(front),
        ]);

        const geometry = new THREE.BoxGeometry(...size);
        const materials = textures.map(
            (texture) =>
                new THREE.MeshLambertMaterial({
                    emissive,
                    emissiveMap: texture,
                    emissiveIntensity: intensity,
                    color: new THREE.Color(0x000000),
                    side: THREE.BackSide,
                })
        );

        const skybox = new THREE.Mesh(geometry, materials);
        skybox.position.set(...center);

        return skybox;
    }
}
