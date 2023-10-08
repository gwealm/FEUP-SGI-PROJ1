import { frame } from "../MyMaterials.js";
import * as THREE from 'three';

/**
 * MyFrameFactory class for creating 3D frames in threejs.
 */
export class MyFrameFactory {
    /**
     * Constructor for MyFrameFactory.
     * @param {keyof frame} outerVariant - The variant of the outter frame material.
     * @param {keyof frame} innerVariant - The variant of the inner frame material.
     */
    constructor(innerVariant, outterVariant) {

        /**
         * @type {THREE.MeshPhongMaterial}
         */
        this.outterMaterial = frame.outter[outterVariant];
        this.innerMaterial = frame.inner[innerVariant];
    }

    /**N
     * Build the inner frame geometry.
     * @param {number} width - Width of the inner frame.
     * @param {number} height - Height of the inner frame.
     * @param {number} depth - Depth of the inner frame.
     * @returns {THREE.Mesh} - The inner frame mesh.
     */
    #buildInnerFrame(width, height, depth) {
        let box = new THREE.BoxGeometry(
            width,
            height,
            depth
        );

        return new THREE.Mesh(box, this.innerMaterial);
    }

    /**
     * Build the frame border geometry.
     * @param {number} width - Width of the frame border.
     * @param {number} height - Height of the frame border.
     * @param {number} depth - Depth of the frame border.
     * @returns {THREE.Mesh[]} - Array of frame border meshes.
     */
    #buildFrameBorder(width, height, depth) {
        let frameWidth = width / 6;
        let frameHeight = height / 6;

        let hBox = new THREE.BoxGeometry(
            width,
            frameHeight,
            depth
        );

        let vBox = new THREE.BoxGeometry(
            frameWidth,
            height + frameHeight * 2,
            depth
        );



        let upBorder = new THREE.Mesh(hBox, this.outterMaterial);
        upBorder.position.set(0, height / 2 + frameHeight / 2, 0);

        let downBorder = new THREE.Mesh(hBox, this.outterMaterial);
        downBorder.position.set(0, -height / 2 - frameHeight / 2, 0);

        let leftBorder = new THREE.Mesh(vBox, this.outterMaterial);
        leftBorder.position.set(-width / 2 - frameWidth / 2, 0, 0);

        let rightBorder = new THREE.Mesh(vBox, this.outterMaterial);
        rightBorder.position.set(width / 2 + frameWidth / 2, 0, 0);

        return [upBorder, downBorder, leftBorder, rightBorder];
    }

    /**
     * Build the complete frame.
     * @param {number} scaleX - Scale factor for the width.
     * @param {number} scaleY - Scale factor for the height.
     * @returns {THREE.Group} - The complete frame group.
     */
    buildFrame(scaleX = 1, scaleY = 1, depth = 0.3) {
        const width = scaleX;
        const height = scaleY;
        const borderDepth = depth / 3;

        let frameGroup = new THREE.Group();

        let innerFrame = this.#buildInnerFrame(width, height, borderDepth);
        frameGroup.add(innerFrame);

        let innerFrameBorder = innerFrame.clone();
        innerFrameBorder.material = this.outterMaterial;
        innerFrameBorder.position.set(0, 0, -borderDepth);
        frameGroup.add(innerFrameBorder);

        let frameBorder = this.#buildFrameBorder(width, height, depth);
        frameBorder.forEach(border => frameGroup.add(border));


        return Object.assign(
            frameGroup, {
                __width: width,
                __height: height,
                __depth: depth
            }
        );
    }
}
