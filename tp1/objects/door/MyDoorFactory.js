import * as THREE from "three";
import { door } from "../../MyMaterials.js";
import { MyRectangularFrameFactory } from "../painting/frame/MyRectangularFrameFactory.js";

/**
 * Class for creating rectangular frames.
 */
export class MyDoorFactory {
    constructor(variant) {
        this.material = door[variant];
    }
    
    /**
     * Builds a complete 3D door.
     * @param {number} width - Width of the door.
     * @param {number} height - Height of the door.
     * @param {number} depth - Depth of the door.
     * @returns {THREE.Group} - The 3D object representing the complete door.
     */
    buildDoor(width = 3, height = 3, depth = 3) {
        const doorGroup = new THREE.Group();
        
        const rectangularFrameFactory = new MyRectangularFrameFactory("wood");
        const frame = rectangularFrameFactory.build(width, height, depth * 8);
        doorGroup.add(frame); 

        let doorGeometry = new THREE.BoxGeometry(width, height, frame.__width / 8);


        let door = new THREE.Mesh(
            doorGeometry,
            this.material
        );

        doorGroup.add(door);

        doorGroup.position.y += height / 2 - frame.__bevelThickness 

        return doorGroup;
    }
}
