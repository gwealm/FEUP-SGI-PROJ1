import * as THREE from 'three';
import { trueClone } from '../../utils.js';

/**
 * Class for creating a 3D flower pot model using NURBS surfaces.
 */
export class MyFlowerPotFactory {
    /**
     * Constructor for MyFlowerPotFactory class.
     * @param {import('../../nurbs/MyNurbsBuilder.js').MyNurbsBuilder} nurbsBuilder
     */
    constructor(nurbsBuilder) {
        this.nurbsBuilder = nurbsBuilder;
        this.samplesU = 24;
        this.samplesV = 24;
    }

    /**
     * Builds half of a flower pot using NURBS surfaces.
     * @param {object} options Options to control flower pot construction.
     * @param {THREE.Material} options.material The material to use for the flower pot.
     * @param {number} options.scaleXZ The scale in the X and Z directions.
     * @param {number} options.scaleY The scale in the Y direction.
     * @returns The 3D mesh representing half of the flower pot.
     */
    #buildHalfFlowerPot(options) {
        const { scaleXZ, scaleY } = options;

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

        const surfaceData = this.nurbsBuilder.build(
            controlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV
        );

        const mesh = new THREE.Mesh(surfaceData, options.material);

        mesh.castShadow = true;

        return Object.assign(mesh, {
            __width: 1,
            __height: 1,
            __depth: 1,
        });
    }

    /**
     * Builds a complete 3D flower pot model by combining two halves.
     * @param {object} options Options to control flower pot construction.
     * @param {THREE.Material} options.material The material to use for the flower pot.
     * @param {number=} options.scaleXZ The scale in the X and Z directions.
     * @param {number=} options.scaleY The scale in the Y direction.
     * @returns The 3D group representing the flower pot.
     */
    build(options) {
        const scaleXZ = options.scaleXZ ?? 1;
        const scaleY = options.scaleY ?? 1;

        const group = new THREE.Group();

        let halfFlowerPot = this.#buildHalfFlowerPot({ material: options.material, scaleXZ, scaleY });
        group.add(halfFlowerPot);

        halfFlowerPot.receiveShadow = true;
        halfFlowerPot.castShadow = true;

        let otherHalfFlowerPot = trueClone(halfFlowerPot);
        otherHalfFlowerPot.rotateY(Math.PI);
        group.add(otherHalfFlowerPot);

        otherHalfFlowerPot.receiveShadow = true;
        otherHalfFlowerPot.castShadow = true;

        return Object.assign(group, {
            __width: halfFlowerPot.__width,
            __height: halfFlowerPot.__height,
            __depth: halfFlowerPot.__depth,
        });
    }
}
