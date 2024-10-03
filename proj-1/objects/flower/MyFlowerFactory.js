import * as THREE from "three";

/**
 * Class for creating a 3D flower model with petals, leaves, and a stem.
 */
export class MyFlowerFactory {
    /**
     * Constructor for MyFlowerFactory class.
     * @param {import('./MyLeafFactory.js').MyLeafFactory} leafFactory
     * @param {import('./MyStemFactory.js').MyStemFactory} stemFactory
     */
    constructor(leafFactory, stemFactory) {
        this.leafFactory = leafFactory;
        this.stemFactory = stemFactory;
    }

    /**
     * Builds the base of the flower with leaves and stem.
     * @param {object} options Options to control flower base construction.
     * @param {object} options.materials The materials to use for the flower base.
     * @param {THREE.Material} options.materials.leaf The material to use for the flower leaves.
     * @param {THREE.Material} options.materials.stem The material to use for the flower stem.
     * @param {number} options.scale The overall scale of the flower.
     * @returns The 3D group representing the flower base.
     */
    #buildBase(options) {
        const scale = options.scale;

        const group = new THREE.Group();

        const leaf = this.leafFactory.buildLeaf({
            material: options.materials.leaf,
            scale,
        });

        leaf.rotateX(Math.PI / 2);
        leaf.rotateZ(Math.PI);
        leaf.position.z -= 0.5;
        leaf.position.x += 0.7;
        leaf.scale.set(0.5, 0.5, 0.5);
        
        group.add(leaf);

        const stem = this.stemFactory.buildStem({
            material: options.materials.stem,
        });

        group.add(stem);

        return group;
    }

    /**
     * Builds the petals of the flower.
     * @param {object} options Options to control flower petals construction.
     * @param {THREE.Material} options.material The material to use for the flower petals.
     * @param {number} options.scale The overall scale of the flower.
     * @param {number} options.numPetals The number of petals in the flower.
     * @returns The 3D group representing the flower petals.
     */
    #buildPetals(options) {
        const { scale, numPetals } = options;

        const group = new THREE.Group();

        const petalShape = new THREE.Shape();
        petalShape.moveTo(0, 0);
        petalShape.lineTo(0.1 * scale, 0.2 * scale);
        petalShape.lineTo(-0.1 * scale, 0.2 * scale);
        petalShape.lineTo(0, 0);

        const extrudeSettings = {
            depth: 0.1 * scale,
            bevelEnabled: false,
        };

        const petalGeometry = new THREE.ExtrudeGeometry(
            petalShape,
            extrudeSettings
        );

        for (let i = 0; i < numPetals; i++) {
            const angle = (i / numPetals) * Math.PI * 2;
            const petal = new THREE.Mesh(petalGeometry, options.material);

            petal.castShadow = true;
            petal.receiveShadow = true;

            // Adjust the petal positions to be relative to the base scale
            const petalRadius = 0.3 * scale;
            petal.position.x = Math.cos(angle) * petalRadius;
            petal.position.y = 0.2 * scale; // Adjusted to avoid overlapping with the center
            petal.position.z = Math.sin(angle) * petalRadius;

            // Pointing outward
            petal.lookAt(0, 0, 0);

            group.add(petal);
        }

        return group;
    }

    /**
     * Builds the center part of the flower.
     * @param {object} options Options to control flower center construction.
     * @param {object} options.materials The materials to use for the flower center.
     * @param {THREE.Material} options.materials.front The material to use for the front of the flower center.
     * @param {THREE.Material} options.materials.back The material to use for the back of the flower center.
     * @param {number} options.scale The overall scale of the flower.
     * @returns The 3D group representing the flower center.
     */
    #buildCenter(options) {
        const scale = options.scale;

        const group = new THREE.Group();

        const centerGeometry = new THREE.CylinderGeometry(
            0.15 * scale,
            0.15 * scale,
            0.05 * scale,
            30
        );
        const center = new THREE.Mesh(centerGeometry, options.materials.front);
        
        center.castShadow = true;
        center.receiveShadow = true;

        const centerBackGeometry = new THREE.CylinderGeometry(
            0.175 * scale,
            0.175 * scale,
            0.05 * scale,
            30
        );
        const centerBack = new THREE.Mesh(centerBackGeometry, options.materials.back);

        // Center the middle of the flower
        center.position.y = 0.3 * scale;
        centerBack.position.y = 0.3 * scale + (0.08 * scale) / 2;

        group.add(center);
        group.add(centerBack);

        return group;
    }

    /**
     * Creates a complete 3D flower model with petals, leaves, and a stem.
     * @param {object} options Options to control flower construction.
     * @param {object} options.materials The materials to use for the flower.
     * @param {object} options.materials.center The materials to use for the flower center.
     * @param {THREE.Material} options.materials.center.front The material to use for the front of the flower center.
     * @param {THREE.Material} options.materials.center.back The material to use for the back of the flower center.
     * @param {THREE.Material} options.materials.petal The material to use for the flower petals.
     * @param {THREE.Material} options.materials.leaf The material to use for the flower leaves.
     * @param {THREE.Material} options.materials.stem The material to use for the flower stem.
     * @param {number=} options.scale The overall scale of the flower.
     * @param {number=} options.numPetals The number of petals in the flower.
     * @returns The 3D group representing the flower.
     */
    build(options) {
        const scale = options.scale ?? 1;
        const numPetals = options.numPetals ?? 8;
        const materials = options.materials;

        const group = new THREE.Group();

        const flowerGroup = new THREE.Group();

        let baseGroup = this.#buildBase({ materials, scale }); // Uncomment if you implement the base
        let petalsGroup = this.#buildPetals({ material: materials.petal, scale, numPetals });
        let centerGroup = this.#buildCenter({ materials: materials.center, scale });

        flowerGroup.add(centerGroup);
        flowerGroup.add(petalsGroup);

        flowerGroup.rotateX(Math.PI);
        flowerGroup.position.z -= 1.2;
        flowerGroup.position.y += 0.35;

        group.add(baseGroup);

        group.add(flowerGroup);

        return group;
    }
}
