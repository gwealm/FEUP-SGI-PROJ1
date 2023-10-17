import * as THREE from "three";
import { wall } from "../../../MyMaterials.js";

/**
 * Factory class for creating circular frames.
 */
export class MyCircularFrameFactory {
    /**
     * Creates an instance of MyCircularFrameFactory.
     */
    constructor() {
        this.twoPi = 2 * Math.PI;
    }

    /**
     * Builds a circular shape with the specified scale.
     * @private
     * @param {number} scale - The scale factor for the circular shape.
     * @returns {THREE.Shape} - The circular shape.
     */
    #buildCircle(scale) {
        const radius = 0.5 * scale;

        const circle = new THREE.Shape();
        circle.ellipse(0, 0, radius, radius, 0, this.twoPi);

        return Object.assign(circle, {
            __radius: radius,
        });
    }

    /**
     * Builds a 3D circular frame with specified scales.
     * @param {number} [scaleXY=1] - The scale factor for the circular frame in the XY plane.
     * @param {number} [scaleZ=1] - The scale factor for the circular frame in the Z direction.
     * @param {number} [bezelScale=1] - The scale factor for the bezel of the frame.
     * @returns {THREE.Mesh} - The 3D mesh representing the circular frame.
     */
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
        return Object.assign(mesh, {
            __radius: outerFrame.__radius,
            __innerRadius: innerFrame.__radius,
            __depth: depth,
            __placeholder: new THREE.CircleGeometry(innerFrame.__radius),
        });
    }
}
