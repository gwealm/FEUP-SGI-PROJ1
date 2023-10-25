import * as THREE from "three";
import { trueClone } from "../../utils.js";

export class MyBookshelfFactory {

    /**
     * Constructor for MyRectangularFrameFactory class.
     * @param {import('../painting/frame/MyRectangularFrameFactory.js').MyRectangularFrameFactory} rectangularFrameFactory 
     */
    constructor(rectangularFrameFactory) {
        this.rectangularFrameFactory = rectangularFrameFactory;
    }
    
    /** 
     * Builds a shelf.
     * @param {object} options The options to control the shelf construction.
     * @param {THREE.Material} options.material The material to use for the shelf.
     * @param {number} options.scaleX The x scale of the shelf.
     * @param {number} options.scaleY The y scale of the shelf.
     * @param {number} options.scaleZ The z scale of the shelf.
     * @returns The 3D object representing the shelf.
     */
    #buildShelf(options) {
        const { scaleX, scaleY, scaleZ } = options;

        const shelf = new THREE.BoxGeometry(scaleX, scaleY, scaleZ);
        const shelfMesh = new THREE.Mesh(shelf, options.material);
        return Object.assign(
            shelfMesh, {
                __width: scaleX,
                __height: scaleY,
                __depth: scaleZ,
            }
        );
    }

    /**
     * Builds a stack of shelfs.
     * @param {object} options The options to control the shelf stack construction.
     * @param {THREE.Material} options.material The material to use for the shelf stack.
     * @param {number} options.scaleX The x scale of the shelf stack.
     * @param {number} options.scaleY The y scale of the shelf stack.
     * @param {number} options.scaleZ The z scale of the shelf stack.
     * @returns The 3D object representing the shelf stack.
     */
    #buildShelfs(options) {
        const { scaleX, scaleY, scaleZ } = options;

        const shelfCount = 2;
        const shelfScaleY = 0.05;        
        const shelfSpacing = 0.6;

        const shelfHeight = (shelfCount + 1) * shelfSpacing + shelfCount * shelfScaleY;
        const realScaleY = scaleY / shelfHeight;

        const realShelfScaleY = shelfScaleY * realScaleY;
        const realShelfSpacing = shelfSpacing * realScaleY;

        const shelfs = new THREE.Group();

        const shelf = this.#buildShelf({ material: options.material, scaleX, scaleY: realShelfScaleY, scaleZ });
        shelf.position.y = -0.5 * scaleY + shelf.__height / 2;

        shelf.castShadow = true;
        shelf.receiveShadow = true;

        for (let i = 1; i <= shelfCount; i++) {
            const clonedShelf = trueClone(shelf);
            clonedShelf.position.y += i * realShelfSpacing + (i - 1) * shelf.__height;
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

    /**
     * Builds the shelf structure.
     * @param {object} options The options to control the shelf structure construction.
     * @param {THREE.Material} options.material The material to use for the shelf structure.
     * @param {number} options.scaleX The x scale of the shelf structure.
     * @param {number} options.scaleY The y scale of the shelf structure.
     * @param {number} options.scaleZ The z scale of the shelf structure.
     * @returns The 3D object representing the shelf structure.
     */
    #buildShelfStructure(options) {
        return this.rectangularFrameFactory.build(options);
    }
    
    /** 
     * Builds a bookshelf.
     * @param {object} options The options to control the bookshelf construction.
     * @param {object} options.materials The materials to use for the bookshelf.
     * @param {THREE.Material} options.materials.frame The material to use for the bookshelf frame.
     * @param {THREE.Material} options.materials.shelf The material to use for the bookshelf shelfs.
     * @param {number=} options.scaleX The x scale of the bookshelf.
     * @param {number=} options.scaleY The y scale of the bookshelf.
     * @param {number=} options.scaleZ The z scale of the bookshelf.
     * @returns The 3D object representing the bookshelf.
     */
    build(options) {
        const {
            scaleX = 1,
            scaleY = 1,
            scaleZ = 1,
            materials,
        } = options;

        const group = new THREE.Group();

        const shelfStructure = this.#buildShelfStructure({
            scaleX,
            scaleY: 3 * scaleY,
            scaleZ: 6 * scaleZ,
            material: materials.frame,
        });

        shelfStructure.position.z -= shelfStructure.__depth / 2;
        group.add(shelfStructure);

        const shelfs = this.#buildShelfs({
            scaleX: shelfStructure.__innerWidth,
            scaleY: shelfStructure.__innerHeight,
            scaleZ: shelfStructure.__depth,
            material: materials.shelf,
        });

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