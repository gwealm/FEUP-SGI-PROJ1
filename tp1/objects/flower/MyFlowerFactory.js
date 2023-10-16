import * as THREE from 'three';
import { MyLeafFactory } from './MyLeafFactory.js';
import { MyStemFactory } from './MyStemFactory.js';


export class MyFlowerFactory {
    constructor() {
        this.flower = new THREE.Group();
    }

    #buildBase(scale) {
        const group = new THREE.Group();
        const leafFactory = new MyLeafFactory();
        const leaf = leafFactory.buildLeaf(scale);
        leaf.rotateX(Math.PI / 2);
        leaf.rotateZ(Math.PI);
        leaf.position.z -= 0.5;
        leaf.position.x += 0.7;
        leaf.scale.set(0.5, 0.5, 0.5);
        group.add(leaf);
        
        const stemFactory = new MyStemFactory();
        const stem = stemFactory.buildStem(scale);
        group.add(stem);

        return group
    }

    // TODO: refactor the code
    #buildPetals(scale, numPetals) {
        const group = new THREE.Group();
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
            const petalRadius = 0.3 * scale;
            petal.position.x = Math.cos(angle) * petalRadius;
            petal.position.y = 0.2 * scale; // Adjusted to avoid overlapping with the center
            petal.position.z = Math.sin(angle) * petalRadius;

            // Pointing outward
            petal.lookAt(0, 0, 0);

            group.add(petal);
        }

        return group
    }

    #buildCenter(scale) {
        const group = new THREE.Group();

        const centerMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const centerGeometry = new THREE.CylinderGeometry(0.15 * scale, 0.15 * scale, 0.05 * scale, 30);
        const center = new THREE.Mesh(centerGeometry, centerMaterial);

        const centerBackMaterial = new THREE.MeshPhongMaterial({ color: "#003300" });
        const centerBackGeometry = new THREE.CylinderGeometry(0.7 * scale, 0.7 * scale, 0.05 * scale, 30);
        const centerBack = new THREE.Mesh(centerGeometry, centerBackMaterial);


        // Center the middle of the flower
        // center.position.z = 0.3 * scale;
        center.position.y = 0.3 * scale;
        centerBack.position.y = 0.3 * scale + 0.08 * scale / 2;

        group.add(center);
        group.add(centerBack);

        return group 
    }

    createFlower(scale = 1, numPetals = 8) {
        const group = new THREE.Group();

        const flowerGroup = new THREE.Group();

        let baseGroup = this.#buildBase(scale); // Uncomment if you implement the base
        let petalsGroup = this.#buildPetals(scale, numPetals);
        let centerGroup = this.#buildCenter(scale);

        flowerGroup.add(centerGroup);
        flowerGroup.add(petalsGroup);
        
        flowerGroup.rotateX(Math.PI );
        flowerGroup.position.z -= 1.2;
        flowerGroup.position.y += 0.35;

        group.add(baseGroup);

        group.add(flowerGroup);

        return group;
    }
}
