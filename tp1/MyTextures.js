import * as THREE from 'three';

const loader = new THREE.TextureLoader();

/**
 * @param {string} path 
 * @param {(texture: THREE.Texture) => void} apply 
 * @returns {THREE.Texture}
 */
function loadTexture(path, apply) {
    const texture = loader.load(path);

    if (apply) {
        apply(texture);
    }

    return texture;
}

export const floor = {
    carpet: loadTexture('textures/floor/carpet.jpg',
        (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2)
        }
    ),
};

export const wall = {
    velvet: loadTexture('textures/wall/velvet.jpg', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2)
    }),
    bump: {
        velvet: loadTexture('textures/wall/velvet.bump.jpg', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2)
        }),
    }
}