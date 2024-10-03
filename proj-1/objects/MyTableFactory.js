import * as THREE from "three";

/**
 * MyTableFactory class for creating 3D tables in Three.js.
 */
export class MyTableFactory {
    /**
     * Builds the top of the table.
     * @param {object} options The options to control the table top construction.
     * @param {THREE.Material} options.material The material to use for the table top.
     * @param {number=} options.width The width of the table top.
     * @param {number=} options.height The height of the table top.
     * @param {number=} options.depth The depth of the table top.
     * @returns The 3D object representing the table top.
     */
    #buildTop(options) {
        const width = options.width ?? 1;
        const height = options.height ?? 1;
        const depth = options.depth ?? 1;

        const box = new THREE.BoxGeometry(width, height, depth);
        const topMesh = new THREE.Mesh(box, options.material);

        topMesh.castShadow = true;
        topMesh.receiveShadow = true;

        return topMesh;
    }

    /**
     * Builds a table leg.
     * @param {object} options The options to control the table leg construction.
     * @param {THREE.Material} options.material The material to use for the table leg.
     * @param {number=} options.radius The radius of the table leg.
     * @param {number=} options.height The height of the table leg.
     * @returns The 3D object representing a table leg.
     */
    #buildLeg(options) {
        const radius = options.radius ?? 1;
        const height = options.height ?? 1;

        const leg = new THREE.CylinderGeometry(radius, radius, height);
        const legMesh = new THREE.Mesh(leg, options.material);

        legMesh.castShadow = true;
        legMesh.receiveShadow = true;

        return legMesh;
    }

    /**
     * Builds a complete 3D table.
     * @param {object} options The options to control the table construction.
     * @param {object} options.materials The materials to use for the table.
     * @param {THREE.Material} options.materials.top The material to use for the table top.
     * @param {THREE.Material} options.materials.leg The material to use for the table leg.
     * @param {number} options.width Width of the table.
     * @param {number} options.height Height of the table.
     * @param {number} options.depth Depth of the table.
     * @param {object} options.legs Options to control the table legs construction.
     * @param {number} options.legs.height Height of the table legs.
     * @param {number} options.legs.radius Radius of the table legs.
     * @returns The 3D object representing the complete table.
     */
    build(options) {
        const {
            width,
            height,
            depth,
            legs: {
                height: legHeight,
                radius: legRadius,
            },
            materials,
        } = options;


        let tableGroup = new THREE.Group();
        let top = this.#buildTop({
            material: materials.top,
            width,
            height,
            depth,
        });

        top.position.set(0, -height / 2 + legHeight, 0);
        tableGroup.add(top);

        // Create and position four table legs
        const leg = this.#buildLeg({
            material: materials.leg,
            height: legHeight,
            radius: legRadius,
        });

        const leg1 = leg.clone();
        leg1.position.set(
            -width / 2 + legRadius,
            -height / 2 + legHeight / 2,
            -depth / 2 + legRadius
        );
        tableGroup.add(leg1);

        const leg2 = leg.clone();
        leg2.position.set(
            width / 2 - legRadius,
            -height / 2 + legHeight / 2,
            -depth / 2 + legRadius
        );
        tableGroup.add(leg2);

        const leg3 = leg.clone();
        leg3.position.set(
            -width / 2 + legRadius,
            -height / 2 + legHeight / 2,
            depth / 2 - legRadius
        );
        tableGroup.add(leg3);

        const leg4 = leg.clone();
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
            __legHeight: legHeight,
        });
    }
}
