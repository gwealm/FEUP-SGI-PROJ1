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

    /**

     * removes (if existing) and recreates the nurbs surfaces

     */

    buildNewspaper(scale = 1) {
        // declare local variables

        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 3;
        let orderV = 1;
        let radius = scale;

        // Build NURBS surface for a rolled newspaper
        controlPoints = [
            // U = 0
            [
                // V = ​​0..1;
                [-scale,  (4/3) * scale, -2*scale, 1.0],
                [-scale,  -(4/3) * scale, -2*scale, 1.0]
            ],

            // U = 1
            [
                // V = ​​0..1
                [-scale, (4/3) * scale, 0.0, 1.0],
                [-scale, -(4/3) * scale, 0.0, 1.0]
            ],

            // U = 2
            [
                // V = ​​0..1
                [scale, (4/3) * scale, 0.0, 1.0],
                [scale, -(4/3) * scale, 0.0, 1.0]
            ],
            // U = 3
            [
                // V = 0..1
                [scale, (4/3) * scale, -2*scale, 1.0],
                [scale, -(4/3) * scale, -2*scale, 1.0]
            ]
        ];

        surfaceData = this.builder.build(
            controlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        mesh = new THREE.Mesh(surfaceData, this.material);
        mesh.rotateZ(Math.PI);
        mesh.rotateX(Math.PI / 2);

        mesh.castShadow = true;
        Object.assign(mesh, {
            __scale: scale,
        })

        return mesh;
    }
}
