import * as THREE from "three";
import { table } from "../../../MyMaterials.js";

/**
 * Factory class for creating rectangular frames.
 * @class
 */
export class MyRectangularFrameFactory {
    /**
     * Creates an instance of MyRectangularFrameFactory.
     * @param {keyof table} variant - The variant of the frame material.
     */
    constructor(variant) {
        this.material = table[variant];
    }

    /**
     * Builds a rectangular shape with the specified scales.
     * @param {number} scaleX - The scale factor for the rectangle in the X direction.
     * @param {number} scaleY - The scale factor for the rectangle in the Y direction.
     */
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

        return Object.assign(rectangle, {
            __width: scaleX,
            __height: scaleY,
        });
    }

    /**
     * Builds a 3D rectangular frame with specified scales.
     * @param {number} [scaleX=1] - The scale factor for the rectangular frame in the X direction.
     * @param {number} [scaleY=1] - The scale factor for the rectangular frame in the Y direction.
     * @param {number} [scaleZ=1] - The scale factor for the rectangular frame in the Z direction.
     * @param {number} [bezelScale=1] - The scale factor for the bezel of the frame.
     */
    build(scaleX = 1, scaleY = 1, scaleZ = 1, bezelScale = 1) {
        const realBezelScale = 0.05 * bezelScale;

        const outerScaleX = scaleX;
        const outerScaleY = scaleY;
        const outerFrame = this.#buildRectangle(outerScaleX, outerScaleY);

        const innerScaleX = scaleX - realBezelScale;
        const innerScaleY = scaleY - realBezelScale;
        const innerFrame = this.#buildRectangle(innerScaleX, innerScaleY);

        outerFrame.holes.push(innerFrame);

        const depth = 0.05 * scaleZ;
        const frame = new THREE.ExtrudeGeometry(outerFrame, {
            depth,
            bevelSegments: 12,
            bevelSize: 0.25 * realBezelScale,
            bevelThickness: 2 * realBezelScale,
        });

        const mesh = new THREE.Mesh(frame, this.material.top);
        return Object.assign(mesh, {
            __width: outerFrame.__width,
            __height: outerFrame.__height,
            __innerWidth: innerFrame.__width,
            __innerHeight: innerFrame.__height,
            __bevelThickness: 2 * realBezelScale,
            __depth: depth,
            __placeholder: new THREE.PlaneGeometry(
                innerFrame.__width,
                innerFrame.__height
            ),
        });
    }
}
