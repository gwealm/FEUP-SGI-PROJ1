import * as THREE from "three";
import { MyNurbsBuilder } from "./MyNurbsBuilder.js";
import { nurb } from "../MyMaterials.js";

export class MyFlowerPotFactory {

    constructor() {
        this.builder = new MyNurbsBuilder();
        this.material = nurb["periodicTable"];
        this.samplesU = 24;
        this.samplesV = 24;
    }

    #buildHalfFlowerPot(scaleX, scaleY, scaleZ) {
        // declare local variables

        let surfaceData;
        let mesh;
        let orderU = 2;
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

    build(scaleX = 1, scaleY = 1, scaleZ = 1) {
        let halfFlowerPot = this.#buildHalfFlowerPot(scaleX, scaleY, scaleZ);
        return halfFlowerPot;
    }
}