import * as THREE from "three";
import { wall } from "../../../MyMaterials.js";

export class MyCircularFrameFactory {

    constructor() {
        this.twoPi = 2 * Math.PI;
    }

    #buildCircle(scale) {
        const radius = 0.5 * scale;
        
        const circle = new THREE.Shape();
        circle.ellipse(0, 0, radius, radius, 0, this.twoPi);

        return Object.assign(
            circle, {
                __radius: radius,
            }
        );
    }

    build(scaleXY = 1, scaleZ = 1, bezelScale = 1) {
        const realBezelScale = 0.05 * bezelScale;

        const outerScale = scaleXY;
        const outerFrame = this.#buildCircle(outerScale);

        const innerScale = scaleXY - realBezelScale;
        const innerFrame = this.#buildCircle(innerScale);
        
        outerFrame.holes.push(innerFrame);
        
        const depth = 0.05 * scaleZ;
        const frame = new THREE.ExtrudeGeometry(outerFrame, {
            depth,
            bevelSegments: 12,
            bevelSize: 0.25 * realBezelScale,
            bevelThickness: 2 * realBezelScale,
        });

        const mesh = new THREE.Mesh(frame, wall.velvet);
        return Object.assign(
            mesh, {
                __radius: outerFrame.__radius,
                __innerRadius: innerFrame.__radius,
                __depth: depth,
                __placeholder: new THREE.CircleGeometry(innerFrame.__radius),
            }
        )
    }
};