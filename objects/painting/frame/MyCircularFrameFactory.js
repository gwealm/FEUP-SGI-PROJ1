import * as THREE from "three";

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
     * @param {number} scale - The scale factor for the circular shape.
     * @returns The circular shape.
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
     * @param {object} options The options to control the frame construction.
     * @param {object} options.material The material to use for the frame.
     * @param {number=} options.scaleXY The scale factor for the circular frame in the XY plane.
     * @param {number=} options.scaleZ The scale factor for the circular frame in the Z direction.
     * @param {number=} options.bezelScale The scale factor for the bezel of the frame.
     * @returns The 3D mesh representing the circular frame.
     */
    build(options) {
        const {
            scaleXY = 1,
            scaleZ = 1,
            bezelScale = 1,
        } = options;

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

        const mesh = new THREE.Mesh(frame, options.material);

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        return Object.assign(mesh, {
            __radius: outerFrame.__radius,
            __innerRadius: innerFrame.__radius,
            __depth: depth,
            __placeholder: new THREE.CircleGeometry(innerFrame.__radius),
        });
    }
}
