import * as THREE from 'three';

export class MyFlowerFactory {
    constructor() {
        this.flower = new THREE.Group();
    }

    #buildBase(scale) {
        // TODO: Build the base of the flower with something curvishy
        // maybe add a leave or somthing
    }

    // TODO: refactor the code
    #buildPetals(scale, numPetals) {
        const petalMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700 });

        const petalShape = new THREE.Shape();
        petalShape.moveTo(0, 0);
        petalShape.lineTo(0.1 * scale, 0.2 * scale);
        petalShape.lineTo(-0.1 * scale, 0.2 * scale);
        petalShape.lineTo(0, 0);

        const extrudeSettings = {
            depth: 0.1 * scale,
            bevelEnabled: false,
        };

        const petalGeometry = new THREE.ExtrudeGeometry(petalShape, extrudeSettings);

        for (let i = 0; i < numPetals; i++) {
            const angle = (i / numPetals) * Math.PI * 2;
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);

            // Adjust the petal positions to be relative to the base scale
            petal.position.x = Math.cos(angle) * 0.3 * scale;
            petal.position.y = 0.3 * scale;
            petal.position.z = Math.sin(angle) * 0.3 * scale;

            // Pointing outward
            petal.lookAt(0, -3, 0);

            this.flower.add(petal);
        }
    }

    #buildCenter(scale) {
        const centerMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const centerGeometry = new THREE.CylinderGeometry(0.15 * scale, 0.15 * scale, 0.1 * scale, 30);
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        center.position.y = 0.3 * scale ;

        this.flower.add(center);
    }

    createFlower(scale = 1, numPetals = 8) {
        //this.#buildBase(scale);
        this.#buildPetals(scale, numPetals);
        this.#buildCenter(scale);

        return this.flower;
    }
}
