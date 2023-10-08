import * as THREE from 'three';

const loader = new THREE.TextureLoader();

/**
 * @param {string} path 
 * @param {(texture: THREE.Texture) => void} apply 
 * @returns {Promise<THREE.Texture>}
 */
async function loadTexture(path, apply) {
    try {
        const texture = await loader.loadAsync(path);

        if (apply) apply(texture);
        return texture;

    } catch (error) {
        console.error(`Error loading texture from ${path}:`, error);
    }
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

export const frame = {
    inner: {
        guima : await loadTexture('resources/textures/frame/guima.png', (texture) => {
            texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        }),  
    },
    border: {
        blue_wood: {
            roughness: await loadTexture('resources/textures/frame/blue_wood/roughness.png', (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            metalness: await loadTexture('resources/textures/frame/blue_wood/metalness.png', (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            ambientOcclusion: await loadTexture('resources/textures/frame/blue_wood/ambientOcclusion.png', (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),        
            bump: await loadTexture('resources/textures/frame/blue_wood/bump.png', (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            diffuse: await loadTexture('resources/textures/frame/blue_wood/diffuse.png', (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            displacement: await loadTexture('resources/textures/frame/blue_wood/displacement.png', (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            normal: await loadTexture('resources/textures/frame/blue_wood/normal.png', (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            specular: await loadTexture('resources/textures/frame/blue_wood/specular.png', (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),        
        },
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
            texture.repeat.set(2, 2);
        }),
        ambientOcclusion: await loadTexture('resources/textures/table/fabric/ambientOcclusion.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.offset.set(0.5, 0.5);
            texture.repeat.set(2, 2);
        }),        
        height: await loadTexture('resources/textures/table/fabric/height.png', (texture) => {
            texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.offset.set(0.5, 0.5);
            texture.repeat.set(2, 2);
        }),        
        normal: await loadTexture('resources/textures/table/fabric/normal.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.offset.set(0.5, 0.5);
            texture.repeat.set(2, 2);
        }),        
    }
};


export const box = {
    wood: {
        baseColor: await loadTexture('resources/textures/box/wood/color_map.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        }),
        roughness: await loadTexture('resources/textures/box/wood/roughness_map.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        }),
        ambientOcclusion: await loadTexture('resources/textures/box/wood/ambient_occlusion.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        }),        
        height: await loadTexture('resources/textures/box/wood/height_map.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        }),        
        normal: await loadTexture('resources/textures/box/wood/normal_map.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),        
    },
};

