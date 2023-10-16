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

const textures = await withConcurrentTextureLoader((load) => ({
    floor: {
        carpet: load('resources/textures/floor/carpet.jpg', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
        })
    },
    watch: {
        velvet: load('resources/textures/watch/velvet.png', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
        }),
    },
    wall: {
        velvet: load('resources/textures/wall/velvet.jpg', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
        }),
        bump: {
            velvet: load('resources/textures/wall/velvet.bump.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(2, 2);
            }),
        }
    },
    frame: {
        inner: {
            guima : load('resources/textures/frame/guima.png', (texture) => {
                texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            }),
        },
        border: {
            blue_wood: {
                roughness: load('resources/textures/frame/blue_wood/roughness.png', (texture) => {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                metalness: load('resources/textures/frame/blue_wood/metalness.png', (texture) => {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                ambientOcclusion: load('resources/textures/frame/blue_wood/ambientOcclusion.png', (texture) => {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                bump: load('resources/textures/frame/blue_wood/bump.png', (texture) => {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                diffuse: load('resources/textures/frame/blue_wood/diffuse.png', (texture) => {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                displacement: load('resources/textures/frame/blue_wood/displacement.png', (texture) => {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                normal: load('resources/textures/frame/blue_wood/normal.png', (texture) => {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                specular: load('resources/textures/frame/blue_wood/specular.png', (texture) => {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
            },
        }
    },
    table: {
        wood: load('resources/textures/table/wood.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        })
    },
    box: {
        wood: {
            baseColor: load('resources/textures/box/wood/color_map.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            }),
            roughness: load('resources/textures/box/wood/roughness_map.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            }),
            ambientOcclusion: load('resources/textures/box/wood/ambient_occlusion.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            }),
            height: load('resources/textures/box/wood/height_map.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            }),
            normal: load('resources/textures/box/wood/normal_map.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
        },
    },
    cake: {
        outter: load('resources/textures/cake/outer_cake.jpg', (texture) => {
            texture.wrapS = THREE.MirroredRepeatWrapping;
            texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.anisotropy = 16;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
        inner: load('resources/textures/cake/inner_cake.jpg', (texture) => {
            texture.wrapS = THREE.MirroredRepeatWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.anisotropy = 16;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
        newspaper: load('resources/textures/nurbs/newspaper/newspaper2.png', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.anisotropy = 16;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
    },
    nurb: {
        periodicTable: load('resources/textures/nurbs/uv_grid_opengl.jpg', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.anisotropy = 16;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
        newspaper: load('resources/textures/nurbs/newspaper/newspaper2.png', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.anisotropy = 16;
            texture.colorSpace = THREE.SRGBColorSpace;
        }),
    },
    window: {
        landscape: load('resources/textures/window/landscape.jpg', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);
        }),
    },
    pot: {
        blue: {
            baseColor: load('resources/textures/pot/blue/color.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
                texture.offset.set(0.5, 0.5);
                texture.repeat.set(2, 2);
            }),
            roughness: load('resources/textures/pot/blue/roughness.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
                texture.offset.set(0.5, 0.5);
                texture.repeat.set(2, 2);
            }),
            ambientOcclusion: load('resources/textures/pot/blue/ambient-occlusion.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
                texture.offset.set(0.5, 0.5);
                texture.repeat.set(2, 2);
            }),
            normal: load('resources/textures/pot/blue/normal.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
                texture.offset.set(0.5, 0.5);
                texture.repeat.set(2, 2);
            }),
        }
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

export const {
    box,
    floor,
    frame,
    table,
    wall,
    watch,
    cake,
    nurb,
    window,
    flower,
    pot
} = textures;