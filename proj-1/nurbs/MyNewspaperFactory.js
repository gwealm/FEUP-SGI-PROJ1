import * as THREE from "three";

/**
 * Class for creating a 3D newspaper model using NURBS surfaces.
 */
export class MyNewspaperFactory {
    /**
     * Constructor for MyNewspaperFactory class.
     * @param {import('./MyNurbsBuilder.js').MyNurbsBuilder} nurbsBuilder
     */
    constructor(nurbsBuilder) {
        this.nurbsBuilder = nurbsBuilder;
        this.samplesU = 24;
        this.samplesV = 24;
    }

    /**
     * Builds a single page of the newspaper with specified scales.
     * @param {object} options Options to control page construction.
     * @param {THREE.Material} options.material The material to use for the page.
     * @param {number} options.scaleX The scale along the X-axis.
     * @param {number} options.scaleY The scale along the Y-axis.
     * @param {number} options.scaleZ The scale along the Z-axis.
     * @returns The 3D mesh representing a newspaper page.
     */
    #buildPage(options) {
        const { scaleX, scaleY, scaleZ } = options;

        let orderU = 3;
        let orderV = 1;

        const newspaperWidth = scaleX;
        const newspaperHeight = scaleY * Math.sqrt(2);
        const newspaperDepth = 0.2 * scaleZ;

        const controlPoints = [
            [
                [-0.5 * newspaperWidth, -0.5 * newspaperHeight, 0],
                [-0.5 * newspaperWidth, 0.5 * newspaperHeight, 0],
            ],
            [
                [-0.1 * newspaperWidth, -0.5 * newspaperHeight, newspaperDepth],
                [-0.1 * newspaperWidth, 0.5 * newspaperHeight, newspaperDepth],
            ],
            [
                [0.1 * newspaperWidth, -0.5 * newspaperHeight, 0],
                [0.1 * newspaperWidth, 0.5 * newspaperHeight, 0],
            ],
            [
                [0.5 * newspaperWidth, -0.5 * newspaperHeight, 0],
                [0.5 * newspaperWidth, 0.5 * newspaperHeight, 0],
            ],
        ];

        if (scaleX < 0) {
            controlPoints.reverse();
        }

        if (scaleY < 0) {
            controlPoints.forEach((row) => {
                row.reverse();
            });
        }

        const surfaceData = this.nurbsBuilder.build(
            controlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
        );

        const mesh = new THREE.Mesh(surfaceData, options.material);

        mesh.castShadow = true;
        return Object.assign(mesh, {
            __width: newspaperWidth,
            __height: newspaperHeight,
            __depth: newspaperDepth,
        });
    }

    /**
     * Builds a complete 3D newspaper model with two pages.
     * @param {object} options Options to control newspaper construction.
     * @param {[THREE.Material, THREE.Material]} options.materials The materials to use for the newspaper pages.
     * @param {number=} options.scaleX The scale along the X-axis.
     * @param {number=} options.scaleY The scale along the Y-axis.
     * @param {number=} options.scaleZ The scale along the Z-axis.
     * @returns The 3D group representing the newspaper.
     */
    build(options) {
        const scaleX = options.scaleX ?? 1;
        const scaleY = options.scaleY ?? 1;
        const scaleZ = options.scaleZ ?? 1;
        
        const group = new THREE.Group();

        const leftPage = this.#buildPage({
            scaleX: -scaleX,
            scaleY,
            scaleZ,
            material: options.materials[0],
        });

        leftPage.position.x += leftPage.__width / 2;
        group.add(leftPage);

        const rightPage = this.#buildPage({
            scaleX,
            scaleY,
            scaleZ,
            material: options.materials[1],
        });

        rightPage.position.x += rightPage.__width / 2;
        group.add(rightPage);

        return Object.assign(group, {
            __width: leftPage.__width + rightPage.__width,
            __height: leftPage.__height + rightPage.__height,
            __depth: leftPage.__depth + rightPage.__depth,
        });
    }
}
