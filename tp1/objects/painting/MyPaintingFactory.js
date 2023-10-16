import * as THREE from "three";
import * as utils from "../../utils.js"

export class MyPaintingFactory {

    /**
     * @template {THREE.Object3D & { __placeholder: THREE.BufferGeometry }} T
     * @param {T} frame
     * @param {THREE.Material} picture 
     */
    build(frame, picture) {
        const clonedFrame = utils.trueClone(frame);

        const placeholder = frame.__placeholder;
        const placeholderMesh = new THREE.Mesh(placeholder, picture);
        clonedFrame.add(placeholderMesh);

        return clonedFrame;
    }
}