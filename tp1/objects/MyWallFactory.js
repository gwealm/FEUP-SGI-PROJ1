import { wall } from "../MyMaterials";

export class MyWallFactory {

    buildWall(width, height, depth) {
        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(
            width,
            height,
            depth,
        );

        return new THREE.Mesh(box, wall.white);
    }
}