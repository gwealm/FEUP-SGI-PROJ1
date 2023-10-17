import * as THREE from "three";
import { MyNurbsBuilder } from "./MyNurbsBuilder.js";
import { nurb } from "../MyMaterials.js";

/**
 * Class for creating a 3D newspaper model using NURBS surfaces.
 */
export class MyNewspaperFactory {
    /**
     * Constructor for MyNewspaperFactory class.
     * @param {string} variant - The variant of the NURBS material.
     */
    constructor(variant) {
        this.builder = new MyNurbsBuilder();
        this.material = nurb[variant];
        this.samplesU = 24;
        this.samplesV = 24;
    }

    /**
     * Builds a single page of the newspaper with specified scales.
     * @private
     * @param {number} scaleX - The scale along the x-axis.
     * @param {number} scaleY - The scale along the y-axis.
     * @param {number} scaleZ - The scale along the z-axis.
     * @returns {THREE.Mesh} - The 3D mesh representing a newspaper page.
     */
    #buildPage(scaleX, scaleY, scaleZ) {
        // declare local variables

        let surfaceData;
        let mesh;
        let orderU = 3;
        let orderV = 1;

        const newspaperWidth = scaleX;
        const newspaperHeight = scaleY * Math.sqrt(2);
        const newspaperDepth = 0.2 * scaleZ;

        const controlPoints = [
            [
                [-0.5 * newspaperWidth, -0.5 * newspaperHeight, 0],
                [-0.5 * newspaperWidth, 0.5 * newspaperHeight, 0],
            ],
            [
                [-0.1 * newspaperWidth, -0.5 * newspaperHeight, newspaperDepth],
                [-0.1 * newspaperWidth, 0.5 * newspaperHeight, newspaperDepth],
            ],
            [
                [0.1 * newspaperWidth, -0.5 * newspaperHeight, 0],
                [0.1 * newspaperWidth, 0.5 * newspaperHeight, 0],
            ],
            [
                [0.5 * newspaperWidth, -0.5 * newspaperHeight, 0],
                [0.5 * newspaperWidth, 0.5 * newspaperHeight, 0],
            ],
        ];

        if (scaleX < 0) {
            controlPoints.reverse();
        }

        if (scaleY < 0) {
            controlPoints.forEach((row) => {
                row.reverse();
            });
        }

        surfaceData = this.builder.build(
            controlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        mesh = new THREE.Mesh(surfaceData, this.material);

        // mesh.rotateZ(Math.PI);
        // mesh.rotateX(Math.PI / 2);

        mesh.castShadow = true;
        return Object.assign(mesh, {
            __width: newspaperWidth,
            __height: newspaperHeight,
            __depth: newspaperDepth,
        });
    }

    /**
     * Builds a complete 3D newspaper model with two pages.
     * @param {number} scaleX - The scale along the x-axis.
     * @param {number} scaleY - The scale along the y-axis.
     * @param {number} scaleZ - The scale along the z-axis.
     * @returns {THREE.Group} - The 3D group representing the newspaper.
     */
    buildNewspaper(scaleX = 1, scaleY = 1, scaleZ = 1) {
        const group = new THREE.Group();

        const leftPage = this.#buildPage(-scaleX, scaleY, scaleZ);
        leftPage.position.x += leftPage.__width / 2;
        group.add(leftPage);

        const rightPage = this.#buildPage(scaleX, scaleY, scaleZ);
        rightPage.position.x += rightPage.__width / 2;
        group.add(rightPage);

        return Object.assign(group, {
            __width: leftPage.__width + rightPage.__width,
            __height: leftPage.__height + rightPage.__height,
            __depth: leftPage.__depth + rightPage.__depth,
        });
    }
}
