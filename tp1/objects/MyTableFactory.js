import { table } from "../MyMaterials.js";
import * as THREE from 'three';

export class MyTableFactory {
    /**
     * @param {keyof table} variant 
     */
    constructor(variant) {
        this.material = table[variant];
    }

    #buildTop(width, height, depth) {
        let box = new THREE.BoxGeometry(
            width,
            height,
            depth,
        );

        return new THREE.Mesh(box, this.material.top);
    }

    #buildLeg(height, radius) {
        let leg = new THREE.CylinderGeometry(radius, radius, height);

        return new THREE.Mesh(leg, this.material.leg);
    }

    buildTable(width, height, depth, legHeight, legRadius) {
        let top = this.#buildTop(width, height, depth);
        let tableGroup = new THREE.Group();
        top.position.set(0, -height / 2 + legHeight, 0);
        tableGroup.add(top);

        // Create and position four table legs
        const leg1 = this.#buildLeg(legHeight, legRadius);
        leg1.position.set(-width / 2 + legRadius, -height / 2 + legHeight / 2, -depth / 2 + legRadius);
        tableGroup.add(leg1);

        const leg2 = this.#buildLeg(legHeight, legRadius);
        leg2.position.set(width / 2 - legRadius, -height / 2 + legHeight / 2, -depth / 2 + legRadius);
        tableGroup.add(leg2);

        const leg3 = this.#buildLeg(legHeight, legRadius);
        leg3.position.set(-width / 2 + legRadius, -height / 2 + legHeight / 2, depth / 2 - legRadius);
        tableGroup.add(leg3);

        const leg4 = this.#buildLeg(legHeight, legRadius);
        leg4.position.set(width / 2 - legRadius, -height / 2 + legHeight / 2, depth / 2 - legRadius);
        tableGroup.add(leg4);

        
        Object.assign(
            tableGroup, {
                __width: width,
                __height: height,
                __depth: depth,
            }
        );

        return tableGroup;
    }
}