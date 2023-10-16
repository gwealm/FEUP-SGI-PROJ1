import * as THREE from "three";
import { wall } from "../../../MyMaterials.js";

export class MyRectangularFrameFactory {

    #buildRectangle(scaleX, scaleY) {
        const rectangle = new THREE.Shape();
        
        const leftX = -0.5 * scaleX;
        const rightX = 0.5 * scaleX;
        const downY = -0.5 * scaleY;
        const upY = 0.5 * scaleY;

        rectangle.moveTo(leftX, downY);
        rectangle.lineTo(rightX, downY);
        rectangle.lineTo(rightX, upY);
        rectangle.lineTo(leftX, upY);
        rectangle.lineTo(leftX, downY);

        return Object.assign(
            rectangle, {
                __width: scaleX,
                __height: scaleY,
            }
        );
    }

    build(scaleX = 1, scaleY = 1, scaleZ = 1, bezelScale = 1) {
        const realBezelScale = 0.05 * bezelScale;

        const outerScaleX = scaleX;
        const outerScaleY = scaleY;
        const outerFrame = this.#buildRectangle(outerScaleX, outerScaleY);

        const innerScaleX = scaleX - realBezelScale;
        const innerScaleY = scaleY - realBezelScale;
        const innerFrame = this.#buildRectangle(innerScaleX, innerScaleY);
        
        outerFrame.holes.push(innerFrame);
        
        const depth = 0.1 * scaleZ;
        const frame = new THREE.ExtrudeGeometry(outerFrame, {
            depth,
            bevelSegments: 12,
            bevelSize: 0.25 * realBezelScale,
            bevelThickness: 2 * realBezelScale,
        });

        const mesh = new THREE.Mesh(frame, wall.velvet);
        return Object.assign(
            mesh, {
                __width: outerFrame.__width,
                __height: outerFrame.__height,
                __innerWidth: innerFrame.__width,
                __innerHeight: innerFrame.__height,
                __depth: depth,
                __placeholder: new THREE.PlaneGeometry(innerFrame.__width, innerFrame.__height),
            }
        )
    }
};