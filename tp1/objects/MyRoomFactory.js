import * as THREE from 'three';
import  {MyWallFactory} from './MyWallFactory.js'

export class MyRoomFactory {
    constructor(variant) {
        this.variant = variant;
    }

    buildRoom(width, height, depth) {
        let roomGroup = new THREE.Group();

        let wallFactory = new MyWallFactory(this.variant);
        
        let wall1 = wallFactory.buildWall(width, height, depth);
        wall1.position.set(0, 0, -depth / 2);
        roomGroup.add(wall1);

        let wall2 = wallFactory.buildWall(width, height, depth);
        wall2.position.set(0, 0, depth / 2);
        roomGroup.add(wall2);

        let wall3 = wallFactory.buildWall(depth, height, width);
        wall3.position.set(-width / 2, 0, 0);
        wall3.rotation.y = Math.PI / 2;
        roomGroup.add(wall3);

        let wall4 = wallFactory.buildWall(depth, height, width);
        wall4.position.set(width / 2, 0, 0);
        wall4.rotation.y = Math.PI / 2;
        roomGroup.add(wall4);

        let ceiling = wallFactory.buildWall(width, depth, width);
        ceiling.position.set(0, height / 2, 0);
        ceiling.rotation.x = Math.PI / 2;
        roomGroup.add(ceiling);

        return roomGroup;
    }
}