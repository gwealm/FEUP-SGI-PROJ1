import * as THREE from 'three';

const loader = new THREE.TextureLoader();

/**
 * @param {string} path 
 * @param {(texture: THREE.Texture) => void} apply 
 * @returns {Promise<THREE.Texture>}
 */
async function loadTexture(path, apply) {
    return new Promise((resolve, reject) => {
        loader.load(
            path,
            (texture) => {
                if (apply) apply(texture);
                resolve(texture);
            },
            undefined, //onLoad
            (error) => {
                console.error(`Error loading texture from ${path}:`, error);
                reject(error);
            }
        );
    });
}

export const floor = {
    carpet: await loadTexture('resources/textures/floor/carpet.jpg', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
    }),
};

export const watch = {
    velvet: await loadTexture('resources/textures/watch/velvet.png', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
    }),
}

export const wall = {
    velvet: await loadTexture('resources/textures/wall/velvet.jpg', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
    }),
    bump: {
        velvet: await loadTexture('resources/textures/wall/velvet.bump.jpg', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
        }),
    }
};

export const table = {
    fabric: {
        baseColor: await loadTexture('resources/textures/table/fabric/baseColor.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.offset.set(0.5, 0.5);
            texture.repeat.set(2, 2);
        }),
        roughness: await loadTexture('resources/textures/table/fabric/roughness.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.offset.set(0.5, 0.5);
            // texture.wrapS = THREE.RepeatWrapping;
            // texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
        }),
        ambientOcclusion: await loadTexture('resources/textures/table/fabric/ambientOcclusion.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.offset.set(0.5, 0.5);
            // texture.wrapS = THREE.RepeatWrapping;
            // texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
        }),        
        height: await loadTexture('resources/textures/table/fabric/height.png', (texture) => {
            texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.offset.set(0.5, 0.5);
            // texture.wrapS = THREE.RepeatWrapping;
            // texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
        }),        
        normal: await loadTexture('resources/textures/table/fabric/normal.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.offset.set(0.5, 0.5);
            // texture.wrapS = THREE.RepeatWrapping;
            // texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
        }),        
    }
};
