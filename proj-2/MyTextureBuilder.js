import * as THREE from "three";

/**
 * Class for building textures.
 */
export class MyTextureBuilder {
    /**
     * Constructor for MyTextureBuilder.
     */
    constructor() {
        this.loader = new THREE.TextureLoader();
    }

    /**
     * Builds a texturefor based on the provided texture specification.
     *
     * @param {import('./types').SceneGraph.Texture} textureSpec - The texture specification.
     * @returns {THREE.Texture} - The created texture.
     */
    buildTexture(textureSpec) {
        const {
            anisotropy,
            isVideo,
            id,
            filepath,
            magFilter,
            minFilter,
            mipmap0,
            mipmap1,
            mipmap2,
            mipmap3,
            mipmap4,
            mipmap5,
            mipmap6,
            mipmap7,
            mipmaps,
        } = textureSpec;

        const texture = isVideo
            ? this.#loadVideoTexture(filepath)
            : this.#loadImageTexture(filepath);

        const realMinFilter = {
            NearestFilter: THREE.NearestFilter,
            LinearFilter: THREE.LinearFilter,
            NearestMipmapNearestFilter: THREE.NearestMipmapNearestFilter,
            NearestMipmapLinearFilter: THREE.NearestMipmapLinearFilter,
            LinearMipmapNearestFilter: THREE.LinearMipmapNearestFilter,
            LinearMipmapLinearFilter: THREE.LinearMipmapLinearFilter,
        }[minFilter];

        const realMagFilter = {
            NearestFilter: THREE.NearestFilter,
            LinearFilter: THREE.LinearFilter,
        }[magFilter];

        if (!realMinFilter || !realMagFilter) throw new Error("Invalid filter");

        const mipmapsSources = [
            mipmap0 ?? [],
            mipmap1 ?? [],
            mipmap2 ?? [],
            mipmap3 ?? [],
            mipmap4 ?? [],
            mipmap5 ?? [],
            mipmap6 ?? [],
            mipmap7 ?? [],
        ].flat();

        texture.anisotropy = anisotropy;
        texture.name = id;
        texture.magFilter = realMagFilter;
        texture.minFilter = realMinFilter;

        texture.generateMipmaps = mipmaps || mipmapsSources.length == 0;
        if (!texture.generateMipmaps) {
            const mipmapImages = mipmapsSources.map((mipmap) => {
                const image = new Image();
                image.src = mipmap;
                return image;
            });

            texture.mipmaps = mipmapImages;
        }

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        return texture;
    }

    /**
     * Loads an image texture using the specified filepath.
     *
     * @param {string} filepath - The path to the image texture.
     * @returns {THREE.Texture} - The loaded image texture.
     */
    #loadImageTexture(filepath) {
        const texture = this.loader.load(filepath);
        return texture;
    }

    /**
     * Loads a video texture using the specified filepath.
     *
     * @param {string} filepath - The path to the video texture.
     * @returns {THREE.Texture} - The loaded video texture.
     */
    #loadVideoTexture(filepath) {
        // Create video source
        const videoElement = document.createElement("video");
        videoElement.src = filepath;
        videoElement.loop = true;
        videoElement.autoplay = true;
        videoElement.muted = true;

        // In Chrome, the video only plays when autoplaying if
        //    1: the video is not muted
        //    2: OR the video is not visible in the browser's window
        //
        // This is a hack to make the video play when autoplaying
        // while the video is muted. We put the video at the top of
        // the browser window so it's always visible.
        videoElement.style.position = "fixed";
        videoElement.style.top = "0";
        videoElement.style.left = "0";
        videoElement.style.zIndex = "-100";
        videoElement.style.opacity = "1";

        document.body.appendChild(videoElement);

        const texture = new THREE.VideoTexture(videoElement);
        return texture;
    }
}
