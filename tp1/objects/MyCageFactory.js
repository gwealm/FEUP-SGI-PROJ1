import * as THREE from "three";
import { cake } from "../MyMaterials.js";

export class MyCageFactory {

    constructor() {
        this.cageShape = this.#initCageShape();
    }

    #initCageShape(widthPercent = 0.15) {
        const shape = new THREE.Shape();

        const horizontalLines = [
            -0.5,
            -0.5 + widthPercent,
            -0.5 + 1.5 * widthPercent,
            -0.5 * widthPercent,
            0,
            0.5 * widthPercent,
            0.5 - 1.5 * widthPercent,
            0.5 - widthPercent,
            0.5,
        ];

        const verticalLines = [
            -0.5,
            -0.5 + widthPercent,
            -widthPercent,
            0,
            widthPercent,
            0.5 - widthPercent,
            0.5,
        ];

        shape.moveTo(horizontalLines[0], verticalLines[0]);
        shape.lineTo(horizontalLines[0], verticalLines[6]);
        shape.lineTo(horizontalLines[1], verticalLines[6]);
        shape.lineTo(horizontalLines[1], verticalLines[4]);
        shape.lineTo(horizontalLines[3], verticalLines[6]);
        shape.lineTo(horizontalLines[5], verticalLines[6]);
        shape.lineTo(horizontalLines[7], verticalLines[4]);
        shape.lineTo(horizontalLines[7], verticalLines[6]);
        shape.lineTo(horizontalLines[8], verticalLines[6]);
        shape.lineTo(horizontalLines[8], verticalLines[0]);
        shape.lineTo(horizontalLines[7], verticalLines[0]);
        shape.lineTo(horizontalLines[7], verticalLines[2]);
        shape.lineTo(horizontalLines[5], verticalLines[0]);
        shape.lineTo(horizontalLines[3], verticalLines[0]);
        shape.lineTo(horizontalLines[1], verticalLines[2]);
        shape.lineTo(horizontalLines[1], verticalLines[3]);
        shape.lineTo(horizontalLines[1], verticalLines[0]);
        shape.lineTo(horizontalLines[0], verticalLines[0]);
        shape.closePath();

        const hole = new THREE.Path();
        hole.moveTo(horizontalLines[2], verticalLines[3]);
        hole.lineTo(horizontalLines[4], verticalLines[5]);
        hole.lineTo(horizontalLines[6], verticalLines[3]);
        hole.lineTo(horizontalLines[4], verticalLines[1]);
        hole.lineTo(horizontalLines[2], verticalLines[3]);
        hole.closePath();

        shape.holes = [hole];
        return shape;
    }

    #buildCageSquare(scaleX, scaleY) {
        const geometry = new THREE.ExtrudeGeometry(
            this.cageShape, {
                depth: 0.05,
               bevelEnabled: false,
            }
        );

        const mesh = new THREE.Mesh(geometry, cake.candle.wick);
        return mesh;
    }

    #buildCageChain(width, height) {
        const cageChain = new THREE.Group();

        const cage = this.buildCage();

        for (let i = 0; i < numX; i++) {
            for (let j = 0; j < numY; j++) {
                const cageClone = cage.clone();
                cageClone.position.set(
                    i * cage.__width,
                    0,
                    j * cage.__width
                );
                cageChain.add(cageClone);
            }
        }

        return cageChain;
    }

    buildCage(scaleX = 1, scaleY = 1) {
        const shape = this.cageShape;
        
        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 0.05,
            bevelSize: 0,
            bevelThickness: 0,
        });

        const mesh = new THREE.Mesh(geometry, cake.candle.wick);
        const group = new THREE.Group();

        for (let x = 0; x < scaleX; x++) {
            for (let y = 0; y < scaleY; y++) {
                const meshClone = mesh.clone();
                meshClone.position.set(
                    x,
                    y,
                    0,
                );
                group.add(meshClone);
            }
        }

        group.castShadow = true;

        return Object.assign(
            group,
        );
    }
}