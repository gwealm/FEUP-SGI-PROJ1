import * as THREE from "three";

/**
 * Class for creating 3D leaf models using customized shapes.
 */
export class MyLeafFactory {
    /**
     * Builds the geometry for a customized leaf shape.
     * @returns The geometry for the leaf shape.
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
     * @param {object} options Options to control leaf construction.
     * @param {THREE.Material} options.material The material to use for the leaf.
     * @param {number=} options.scale The scale factor for the leaf.
     * @returns The 3D mesh representing the leaf.
     */
    buildLeaf(options) {
        const scale = options.scale ?? 1;

        const leafGeometry = this.#buildLeafGeometry();
        const leafMesh = new THREE.Mesh(leafGeometry, options.material);

        leafMesh.scale.set(scale, scale, 1);
        leafMesh.castShadow = true;

        return leafMesh;
    }
}
