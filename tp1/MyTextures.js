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
        uvGrid: load('resources/textures/debug/uv_grid_opengl.jpg')
    },
    basic: {
        wood: load('resources/textures/basic/wood.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
        porcelain: {
            map: load('resources/textures/basic/porcelain/map.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
                texture.offset.set(0.5, 0.5);
                texture.repeat.set(2, 2);
            }),
            roughnessMap: load('resources/textures/basic/porcelain/roughnessMap.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
                texture.offset.set(0.5, 0.5);
                texture.repeat.set(2, 2);
            }),
            aoMap: load('resources/textures/basic/porcelain/aoMap.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
                texture.offset.set(0.5, 0.5);
                texture.repeat.set(2, 2);
            }),
            normalMap: load('resources/textures/basic/porcelain/normalMap.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
                texture.offset.set(0.5, 0.5);
                texture.repeat.set(2, 2);
            }),
        }
    },
    room: {
        velvet: {
            map: load('resources/textures/room/velvet/map.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(2, 2);
            }),
            bumpMap: load('resources/textures/room/velvet/bumpMap.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(2, 2);
            })
        },
        carpet: load('resources/textures/room/carpet.jpg', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
        })
    },
    clock: load('resources/textures/clock.png', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;
    }),
    guima: load('resources/textures/guima.png', (texture) => {
        texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
    }),
    box: {
        map: load('resources/textures/box/map.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.colorSpace = THREE.SRGBColorSpace;
            // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        }),
        roughnessMap: load('resources/textures/box/roughnessMap.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        }),
        aoMap: load('resources/textures/box/aoMap.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        }),
        normalMap: load('resources/textures/box/normalMap.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
    },
    newspaper: {
        firstPage: load('resources/textures/newspaper/page-1.png', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.anisotropy = 16;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
        secondPage: load('resources/textures/newspaper/page-2.png', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.anisotropy = 16;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
    },
    cake: {
        outside: load('resources/textures/cake/outside.jpg', (texture) => {
            texture.wrapS = THREE.MirroredRepeatWrapping;
            texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.anisotropy = 16;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
        inside: load('resources/textures/cake/inside.jpg', (texture) => {
            texture.wrapS = THREE.MirroredRepeatWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.anisotropy = 16;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
    },
    door: load('resources/textures/door.jpg', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = 16;
        texture.colorSpace = THREE.SRGBColorSpace;
    }),
    window: {
        landscape: load('resources/textures/window/landscape.jpg'),
    },
    flower: {
        leaf: load('resources/textures/flower/leaf.jpg', (texture) => {
            texture.wrapS = THREE.ClampToEdgeWrapping
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.anisotropy = 16;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
    },
}));
