import * as THREE from "three";

// Create a curved line for the stem
class FlowerStemCurve extends THREE.Curve {
    constructor() {
        super();
    }

    getPoint(t, optionalTarget = new THREE.Vector3()) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(Math.PI * t) * 0.5; // Reduce the impact of the sine function
        const tz = 0;

        return optionalTarget.set(tx, ty, tz).multiplyScalar(10);
    }
}

/**
 * Class for creating 3D stem models for flowers using custom curves.
 */
export class MyStemFactory {

    /**
     * Constructor for MyStemFactory class.
     */
    constructor() {
        this.curve = new FlowerStemCurve();
    }

    /**
     * Builds a 3D stem model for flowers using a custom curve.
     * @param {object} options Options to control stem construction.
     * @param {THREE.Material} options.material The material to use for the stem.
     * @returns The 3D mesh representing the flower stem.
     */
    buildStem(options) {
        const curve = new FlowerStemCurve();
        const tubeGeometry = new THREE.TubeGeometry(curve, 50, 0.3, 8, false);

        const tubeMesh = new THREE.Mesh(tubeGeometry, options.material);
        tubeMesh.rotateY(Math.PI / 2);
        tubeMesh.rotateX(Math.PI / 2);
        tubeMesh.scale.set(0.05, 0.05, 0.05);
        tubeMesh.position.z -= 0.5;

        tubeMesh.castShadow = true;
        tubeMesh.receiveShadow = true;
        
        return tubeMesh;
    }
}
