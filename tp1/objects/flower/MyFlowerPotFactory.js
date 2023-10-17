import * as THREE from "three";
import { MyNurbsBuilder } from "../../nurbs/MyNurbsBuilder.js";
import { nurb } from "../../MyMaterials.js";

/**
 * Class for creating a 3D flower pot model using NURBS surfaces.
 */
export class MyFlowerPotFactory {
    /**
     * Constructor for MyFlowerPotFactory class.
     */
    constructor() {
        this.builder = new MyNurbsBuilder();
        this.material = nurb.pot.blue;
        this.samplesU = 24;
        this.samplesV = 24;
    }

    /**
     * Builds half of a flower pot using NURBS surfaces.
     * @private
     * @param {number} scaleXZ - The scale in the X and Z directions.
     * @param {number} scaleY - The scale in the Y direction.
     * @returns {THREE.Mesh} - The 3D mesh representing half of the flower pot.
     */
    #buildHalfFlowerPot(scaleXZ, scaleY) {
        let orderU = 31;

        const radiuses = [
            [-0.5 * scaleY, 0.25 * scaleXZ],
            [-0.3 * scaleY, 0.375 * scaleXZ],
            [0 * scaleY, 0.375 * scaleXZ],
            [0.3 * scaleY, 0.375 * scaleXZ],
            [0.5 * scaleY, 0.5 * scaleXZ],
        ];

        let orderV = radiuses.length - 1;

        const controlPoints = [];

        const segments = orderU + 1;
        for (let i = 0; i < segments; i++) {
            const theta = (i * Math.PI) / (segments - 1);
            const dx = Math.cos(theta);
            const dz = Math.sin(theta);

            controlPoints.push(
                radiuses.map(([y, radius]) => [dx * radius, y, dz * radius])
            );
        }

        const surfaceData = this.builder.build(
            controlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV
        );

        const mesh = new THREE.Mesh(surfaceData, this.material);

        // mesh.rotateZ(Math.PI);
        // mesh.rotateX(Math.PI / 2);

        mesh.castShadow = true;

        return Object.assign(mesh, {
            __width: 1,
            __height: 1,
            __depth: 1,
        });
    }

    /**
     * Builds a complete 3D flower pot model by combining two halves.
     * @param {number} scaleXZ - The scale in the X and Z directions.
     * @param {number} scaleY - The scale in the Y direction.
     * @returns {THREE.Group} - The 3D group representing the flower pot.
     */
    build(scaleXZ = 1, scaleY = 1) {
        const group = new THREE.Group();

        let halfFlowerPot = this.#buildHalfFlowerPot(scaleXZ, scaleY);
        group.add(halfFlowerPot);

        let otherHalfFlowerPot = this.#buildHalfFlowerPot(scaleXZ, scaleY);
        otherHalfFlowerPot.rotateY(Math.PI);
        group.add(otherHalfFlowerPot);

        return Object.assign(group, {
            __width: halfFlowerPot.__width,
            __height: halfFlowerPot.__height,
            __depth: halfFlowerPot.__depth,
        });
    }
}
