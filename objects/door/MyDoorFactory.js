import * as THREE from "three";
import { MyRectangularFrameFactory } from "../painting/frame/MyRectangularFrameFactory.js";
import { MyPaintingFactory } from "../painting/MyPaintingFactory.js";

/**
 * Class for creating rectangular frames.
 */
export class MyDoorFactory {
    /**
     * Constructor for MyRectangularFrameFactory class.
     * @param {import('../painting/frame/MyRectangularFrameFactory.js').MyRectangularFrameFactory} rectangularFrameFactory 
     * @param {import('../painting/MyPaintingFactory.js').MyPaintingFactory} paintingFactory 
     */
    constructor(rectangularFrameFactory, paintingFactory) {
        this.rectangularFrameFactory = rectangularFrameFactory;
        this.paintingFactory = paintingFactory;
    }
    
    /**
     * Builds a complete 3D door.
     * @param {object} options The options to control the door construction.
     * @param {object} options.materials The materials to use for the door.
     * @param {THREE.Material} options.materials.frame The material to use for the door frame.
     * @param {THREE.Material} options.materials.door The material to use for the door itself.
     * @param {number=} options.width Width of the door.
     * @param {number=} options.height Height of the door.
     * @param {number=} options.depth Depth of the door.
     * @returns The 3D object representing the complete door.
     */
    buildDoor(options) {
        const { width = 3, height = 3, depth = 3 } = options;

        const frame = this.rectangularFrameFactory.build({
            material: options.materials.frame,
            scaleX: width,
            scaleY: height,
            scaleZ: depth * 8
        });

        const painting = this.paintingFactory.build(frame, options.materials.door);
        painting.position.y += height / 2 - painting.__bevelThickness 
        painting.position.x += 0.1; 

        return painting;
    }
}
