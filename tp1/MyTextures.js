import * as THREE from 'three';

const _loader = new THREE.TextureLoader();
const _pendingTextureMarker = Symbol("pendingTexture");

/** @typedef {{[_pendingTextureMarker]: true, index: number}} PendingTexture */
/** @typedef {{readonly [prop: string]: PendingTexture | THREE.Texture | TextureObjectTemplate}} TextureObjectTemplate */
/** @typedef {(path: string, apply?: (texture: THREE.Texture) => void) => PendingTexture} MultiplexedTextureLoader */

/**
 * @template T
 * @typedef {T extends PendingTexture ? THREE.Texture : (T extends TextureObjectTemplate ? {[prop in keyof T]: TextureObject<T[prop]>} : T)} TextureObject<T>
 */

/**
 * @template {TextureObjectTemplate} T
 * @type {<T extends TextureObjectTemplate>(fn: (load: MultiplexedTextureLoader) => T | PromiseLike<T>) => Promise<TextureObject<T>>}
 */
async function withConcurrentTextureLoader(fn) {

    /** @type {Promise<THREE.Texture>[]} */
    const pendingTextures = [];

    /**
     * @param {string} path
     * @param {((texture: THREE.Texture) => void) | undefined} apply
     * @returns {PendingTexture}
     */
    function load(path, apply) {
        const promise = _loader.loadAsync(path)
            .then((texture) => {
                if (apply) apply(texture);
                return texture;
            })
            .catch((error) => {
                console.error(`Error loading texture from ${path}:`, error);
                throw error;
            });

        pendingTextures.push(promise);
        
        const index = pendingTextures.length - 1;
        return {
            [_pendingTextureMarker]: true,
            index,
        };
    }

    const textureObj = await fn(load);
    const results = await Promise.all(pendingTextures);

    function replacePendingTextures(obj) {
        for (const [key, value] of Object.entries(obj)) {
            if (value && typeof value === 'object' && value[_pendingTextureMarker]) {
                obj[key] = results[value.index];
            } else if (value && typeof value === 'object') {
                replacePendingTextures(value);
            }
        }
    }

    replacePendingTextures(textureObj);
    // @ts-ignore
    return textureObj;
}

export const textures = await withConcurrentTextureLoader((load) => ({
    debug: {
        uvGrid: load('textures/debug/uv_grid_opengl.jpg')
    },
    basic: {
        wood: load('textures/basic/wood.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
        porcelain: {
            map: load('textures/basic/porcelain/map.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
                texture.offset.set(0.5, 0.5);
                texture.repeat.set(2, 2);
            }),
            roughnessMap: load('textures/basic/porcelain/roughnessMap.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
                texture.offset.set(0.5, 0.5);
                texture.repeat.set(2, 2);
            }),
            aoMap: load('textures/basic/porcelain/aoMap.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
                texture.offset.set(0.5, 0.5);
                texture.repeat.set(2, 2);
            }),
            normalMap: load('textures/basic/porcelain/normalMap.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
                texture.offset.set(0.5, 0.5);
                texture.repeat.set(2, 2);
            }),
        }
    },
    room: {
        velvet: {
            map: load('textures/room/velvet/map.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(2, 2);
            }),
            bumpMap: load('textures/room/velvet/bumpMap.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(2, 2);
            })
        },
        carpet: load('textures/room/carpet.jpg', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
        })
    },
    clock: load('textures/clock.png', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;
    }),
    guima: load('textures/guima.png', (texture) => {
        texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
    }),
    box: {
        map: load('textures/box/map.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.colorSpace = THREE.SRGBColorSpace;
            // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        }),
        roughnessMap: load('textures/box/roughnessMap.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        }),
        aoMap: load('textures/box/aoMap.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        }),
        normalMap: load('textures/box/normalMap.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
    },
    newspaper: {
        firstPage: load('textures/newspaper/page-1.png', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.anisotropy = 16;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
        secondPage: load('textures/newspaper/page-2.png', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.anisotropy = 16;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
    },
    cake: {
        outside: load('textures/cake/outside.jpg', (texture) => {
            texture.wrapS = THREE.MirroredRepeatWrapping;
            texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.anisotropy = 16;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
        inside: load('textures/cake/inside.jpg', (texture) => {
            texture.wrapS = THREE.MirroredRepeatWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.anisotropy = 16;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
    },
    door: load('textures/door.jpg', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = 16;
        texture.colorSpace = THREE.SRGBColorSpace;
    }),
    window: {
        landscape: load('textures/window/landscape.jpg'),
    },
    flower: {
        leaf: load('textures/flower/leaf.jpg', (texture) => {
            texture.wrapS = THREE.ClampToEdgeWrapping
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.anisotropy = 16;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
    },
}));
