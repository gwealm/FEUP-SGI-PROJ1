import * as THREE from "three";
import { flower } from "../../MyMaterials.js";

/**
 * Class for creating 3D leaf models using customized shapes.
 */
export class MyLeafFactory {
    /**
     * Constructor for MyLeafFactory class.
     */
    constructor() {
        this.material = flower.leaf;
    }

    /**
     * Builds the geometry for a customized leaf shape.
     * @private
     * @returns {THREE.ShapeGeometry} - The geometry for the leaf shape.
     */
    #buildLeafGeometry() {
        const leafShape = new THREE.Shape();

        // Customize your leaf shape using moveTo, lineTo, quadraticCurveTo, etc.
        leafShape.moveTo(0, 0.5);
        leafShape.quadraticCurveTo(0.6, 1, 1, 0.5);
        leafShape.quadraticCurveTo(0.6, 0, 0, 0.5);

        const leafGeometry = new THREE.ShapeGeometry(leafShape);
        return leafGeometry;
    }

    /**
     * Builds a 3D leaf model using a customized leaf shape.
     * @param {number} scaleX - The scale in the X direction.
     * @param {number} scaleY - The scale in the Y direction.
     * @param {number} scaleZ - The scale in the Z direction.
     * @returns {THREE.Mesh} - The 3D mesh representing the leaf.
     */
    buildLeaf(scaleX = 1, scaleY = 1, scaleZ = 1) {
        const leafGeometry = this.#buildLeafGeometry();
        const leafMesh = new THREE.Mesh(leafGeometry, this.material);

        // leafMesh.scale.set(scaleX, scaleY, scaleZ);
        leafMesh.castShadow = true;

        return leafMesh;
    }
}
