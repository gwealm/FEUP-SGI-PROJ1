import { table } from "../MyMaterials.js";
import * as THREE from "three";

/**
 * MyTableFactory class for creating 3D tables in Three.js.
 */
export class MyTableFactory {
    /**
     * Constructor for MyTableFactory.
     * @param {string} variant - The variant for the table.
     */
    constructor(variant) {
        this.material = table[variant];
    }

    /**
     * Builds the top of the table.
     * @private
     * @param {number} width - Width of the table top.
     * @param {number} height - Height of the table top.
     * @param {number} depth - Depth of the table top.
     * @returns {THREE.Mesh} - The 3D object representing the table top.
     */
    #buildTop(width, height, depth) {
        let box = new THREE.BoxGeometry(width, height, depth);

        let topMesh = new THREE.Mesh(box, this.material.top);
        topMesh.castShadow = true;
        topMesh.receiveShadow = true;

        return topMesh;
    }

    /**
     * Builds a table leg.
     * @private
     * @param {number} height - Height of the table leg.
     * @param {number} radius - Radius of the table leg.
     * @returns {THREE.Mesh} - The 3D object representing a table leg.
     */
    #buildLeg(height, radius) {
        let leg = new THREE.CylinderGeometry(radius, radius, height);

        let legMesh = new THREE.Mesh(leg, this.material.leg);
        legMesh.castShadow = true;
        legMesh.receiveShadow = true;

        return legMesh;
    }

    /**
     * Builds a complete 3D table.
     * @param {number} width - Width of the table.
     * @param {number} height - Height of the table.
     * @param {number} depth - Depth of the table.
     * @param {number} legHeight - Height of the table legs.
     * @param {number} legRadius - Radius of the table legs.
     * @returns {THREE.Group} - The 3D object representing the complete table.
     */
    buildTable(width, height, depth, legHeight, legRadius) {
        let tableGroup = new THREE.Group();
        let top = this.#buildTop(width, height, depth);
        top.position.set(0, -height / 2 + legHeight, 0);
        tableGroup.add(top);

        // Create and position four table legs
        const leg1 = this.#buildLeg(legHeight, legRadius);
        leg1.position.set(
            -width / 2 + legRadius,
            -height / 2 + legHeight / 2,
            -depth / 2 + legRadius
        );
        tableGroup.add(leg1);

        const leg2 = this.#buildLeg(legHeight, legRadius);
        leg2.position.set(
            width / 2 - legRadius,
            -height / 2 + legHeight / 2,
            -depth / 2 + legRadius
        );
        tableGroup.add(leg2);

        const leg3 = this.#buildLeg(legHeight, legRadius);
        leg3.position.set(
            -width / 2 + legRadius,
            -height / 2 + legHeight / 2,
            depth / 2 - legRadius
        );
        tableGroup.add(leg3);

        const leg4 = this.#buildLeg(legHeight, legRadius);
        leg4.position.set(
            width / 2 - legRadius,
            -height / 2 + legHeight / 2,
            depth / 2 - legRadius
        );
        tableGroup.add(leg4);

        tableGroup.receiveShadow = true;
        tableGroup.castShadow = true;

        return Object.assign(tableGroup, {
            __width: width,
            __height: height,
            __depth: depth,
            __leg_height: legHeight,
        });
    }
}
