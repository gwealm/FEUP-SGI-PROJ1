import * as THREE from "three";
import { flower } from '../../MyMaterials.js'

export class MyLeafFactory {

    constructor() {
        this.material = flower.leaf;
    }

    #buildLeafGeometry() {
        const leafShape = new THREE.Shape();

        // Customize your leaf shape using moveTo, lineTo, quadraticCurveTo, etc.
        leafShape.moveTo(0, 0.5);
        leafShape.quadraticCurveTo(0.6, 1, 1, 0.5);
        leafShape.quadraticCurveTo(0.6, 0, 0, 0.5);

        const leafGeometry = new THREE.ShapeGeometry(leafShape);
        return leafGeometry;
    }

    buildLeaf(scaleX = 1, scaleY = 1, scaleZ = 1) {
        const leafGeometry = this.#buildLeafGeometry();
        const leafMesh = new THREE.Mesh(leafGeometry, this.material);

        // leafMesh.scale.set(scaleX, scaleY, scaleZ);
        leafMesh.castShadow = true;

        return leafMesh;
    }
}
