import * as THREE from "three";

/**
 * Class for loading video textures.
 */
export class MyVideoTextureLoader {
    /**
     * Loads a video texture from the specified path.
     *
     * @param {string} path - The path to the video file.
     * @param {((data: THREE.VideoTexture) => void)=} onLoad - Optional callback function called when the video texture is loaded.
     */
    load(path, onLoad) {
        const videoElement = document.createElement("video");
    }
}
