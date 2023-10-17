import * as THREE from "three";
import { door } from "../../MyMaterials.js";
import { MyRectangularFrameFactory } from "../painting/frame/MyRectangularFrameFactory.js";
import { MyPaintingFactory } from "../painting/MyPaintingFactory.js";

/**
 * Class for creating rectangular frames.
 */
export class MyDoorFactory {
    constructor(variant) {
        this.material = door[variant];
        this.rectangularFrameFactory = new MyRectangularFrameFactory("wood");
        this.paintingFactory = new MyPaintingFactory();
    }
    
    /**
     * Builds a complete 3D door.
     * @param {number} width - Width of the door.
     * @param {number} height - Height of the door.
     * @param {number} depth - Depth of the door.
     * @returns {THREE.Mesh} - The 3D object representing the complete door.
     */
    buildDoor(width = 3, height = 3, depth = 3) {
        const rectangularFrameFactory = new MyRectangularFrameFactory("wood");
        const frame = rectangularFrameFactory.build(width, height, depth * 8);

        const painting = this.paintingFactory.build(frame, this.material);
        painting.position.y += height / 2 - painting.__bevelThickness 
        painting.position.x += 0.1; 

        return painting;
    }
}
