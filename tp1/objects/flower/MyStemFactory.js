import * as THREE from "three";

export class MyStemFactory {

    constructor() {
        this.material = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Brown color for the stem
        this.stemRadius = 0.1;
    }

    #createStemCurve() {
        // Define a custom curve for the stem
        class CustomCurve extends THREE.Curve {
            constructor() {
                super();
            }

            getPoint(t) {
                const radius = 1;
                const angle = Math.PI * 2 * t;
                const x = Math.cos(angle) * radius;
                const y = t * 2 - 1; 
                const z = Math.sin(angle) * radius;

                return new THREE.Vector3(x, y, z);
            }
        }

        return new CustomCurve();
    }

    buildStem() {
        const stemCurve = this.#createStemCurve();
        const tubeGeometry = new THREE.TubeGeometry(stemCurve, 20, this.stemRadius, 8, false);
        const stemMesh = new THREE.Mesh(tubeGeometry, this.material);

        stemMesh.castShadow = true;

        return stemMesh;
    }
}
