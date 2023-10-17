import * as THREE from "three";
import { basic as bookshelf } from "../../MyMaterials.js";
import { trueClone } from "../../utils.js";
import { MyRectangularFrameFactory } from "../painting/frame/MyRectangularFrameFactory.js";

export class MyBookshelfFactory {

    constructor() {
        this.rectangularFrameFactory = new MyRectangularFrameFactory("wood");
    }
    
    #buildShelf(scaleX, scaleY, scaleZ) {
        const shelf = new THREE.BoxGeometry(scaleX, scaleY, scaleZ);
        const shelfMesh = new THREE.Mesh(shelf, bookshelf.white);
        return Object.assign(
            shelfMesh, {
                __width: scaleX,
                __height: scaleY,
                __depth: scaleZ,
            }
        );
    }

    #buildShelfs(scaleX, scaleY, scaleZ) {
        const shelfCount = 4;
        const shelfScaleY = 0.05;        
        const shelfSpacing = 0.6;

        const shelfHeight = (shelfCount + 1) * shelfSpacing + shelfCount * shelfScaleY;
        const realScaleY = scaleY / shelfHeight;
        console.log({ shelfHeight, scaleY, realScaleY, a: 1/shelfHeight})
        const realShelfScaleY = shelfScaleY * realScaleY;
        const realShelfSpacing = shelfSpacing * realScaleY;
        console.log({ realShelfScaleY, realShelfSpacing})

        const shelfs = new THREE.Group();

        const shelf = this.#buildShelf(scaleX, realShelfScaleY, scaleZ);
        shelf.position.y = -0.5 * scaleY + shelf.__height / 2;

        for (let i = 1; i <= shelfCount; i++) {
            const clonedShelf = trueClone(shelf);
            clonedShelf.position.y += i * realShelfSpacing + (i - 1) * shelf.__height;
            console.log({pos: clonedShelf.position.y, shelfHeight: clonedShelf.__height})
            shelfs.add(clonedShelf);
        }


        return Object.assign(
            shelfs, {
                __width: scaleX,
                __height: scaleY,
                __depth: scaleZ,
                __count: shelfCount,
                __shelf: {
                    __width: shelf.__width,
                    __height: shelf.__height,
                    __depth: shelf.__depth,
                    __spacing: shelfSpacing,
                },
            }
        )
    }

    #buildShelfStructure(scaleX, scaleY, scaleZ) {
        return this.rectangularFrameFactory.build(scaleX, scaleY, scaleZ);
    }
    
    build(scaleX = 1, scaleY = 1, scaleZ = 1) {
        const group = new THREE.Group();

        const shelfStructure = this.#buildShelfStructure(scaleX, 3 * scaleY, 6 * scaleZ);
        shelfStructure.position.z -= shelfStructure.__depth / 2;
        group.add(shelfStructure);

        const shelfs = this.#buildShelfs(shelfStructure.__innerWidth, shelfStructure.__innerHeight, shelfStructure.__depth);
        group.add(shelfs);

        return Object.assign(
            group, {
                __width: shelfStructure.__width,
                __height: shelfStructure.__height,
                __depth: shelfStructure.__depth,
                __shelfs: shelfs,
            }
        );
    }
}