import * as THREE from "three";
import { MyNurbsBuilder } from "./MyNurbsBuilder.js";
import { nurb } from "../MyMaterials.js";

export class MyNewspaperFactory {
    constructor(variant) {
        this.builder = new MyNurbsBuilder();
        this.material = nurb[variant];
        this.samplesU = 24;
        this.samplesV = 24;
    }

    #buildPage(scaleX, scaleY, scaleZ) {
        // declare local variables

        let surfaceData;
        let mesh;
        let orderU = 3;
        let orderV = 1;

        const newspaperWidth = scaleX
        const newspaperHeight = scaleY * Math.sqrt(2);
        const newspaperDepth = 0.2 * scaleZ;

        const controlPoints = [
            [
                [-0.5 * newspaperWidth, - 0.5 * newspaperHeight, 0],
                [-0.5 * newspaperWidth, 0.5 * newspaperHeight, 0],
            ],
            [
                [-0.1 * newspaperWidth, - 0.5 * newspaperHeight, newspaperDepth],
                [-0.1 * newspaperWidth, 0.5 * newspaperHeight, newspaperDepth],
            ],
            [
                [0.1 * newspaperWidth, - 0.5 * newspaperHeight, 0],
                [0.1 * newspaperWidth, 0.5 * newspaperHeight, 0],
            ],
            [
                [0.5 * newspaperWidth, -0.5 * newspaperHeight, 0],
                [0.5 * newspaperWidth, 0.5 * newspaperHeight, 0],
            ]
        ]

        if (scaleX < 0) {
            controlPoints.reverse();
        }

        if (scaleY < 0) {
            controlPoints.forEach(row => {
                row.reverse();
            })
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
        })
    }

    /**

     * removes (if existing) and recreates the nurbs surfaces

     */

    buildNewspaper(scaleX = 1, scaleY = 1, scaleZ = 1) {
        const group = new THREE.Group();

        const leftPage = this.#buildPage(-scaleX, scaleY, scaleZ)
        leftPage.position.x += leftPage.__width / 2;
        group.add(leftPage);

        const rightPage = this.#buildPage(scaleX, scaleY, scaleZ)
        rightPage.position.x += rightPage.__width / 2;
        group.add(rightPage);

        return Object.assign(
            group, {
                __width: leftPage.__width + rightPage.__width,
                __height: leftPage.__height + rightPage.__height,
                __depth: leftPage.__depth + rightPage.__depth,
            }
        );
        
    }
}
