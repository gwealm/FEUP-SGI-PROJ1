import * as THREE from "three";
import { MyNurbsBuilder } from "./MyNurbsBuilder.js";

/** @typedef {{ worldMatrix: THREE.Matrix4, activeMaterials: THREE.Material[] }} PrimitiveContext */
/** @typedef {{ geometry: THREE.BufferGeometry, offset: [number, number, number] }} PrimitiveDescriptor */

const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    wireframe: true,
});

export class MyPrimitiveBuilder {

    constructor() {
        this.nurbsBuilder = new MyNurbsBuilder();
    }

    /**
     * @param {PrimitiveContext} ctx
     */
    buildRepresentation(representation, ctx) {
        const { geometry, offset } = this.#buildGeometry(representation);

        if (!geometry)
            console.log(representation)
        if (!('groups' in geometry))
            console.log(geometry);
        const materials = 'groups' in geometry && geometry.groups.length === 0
            ? ctx.activeMaterials[0] // no groups, so there can only be one material (rectangles, for instance)
            : ctx.activeMaterials;

        const mesh = new THREE.Mesh(geometry, materials);

        mesh.position.set(...offset);
        mesh.applyMatrix4(ctx.worldMatrix);

        mesh.receiveShadow = true;

        return mesh;
    }

    #buildGeometry(representation) {
        switch (representation.type) {
            case 'cylinder':
                return this.#buildCylinder(representation)
            case 'rectangle':
                return this.#buildRectangle(representation)
            case 'triangle':
                return this.#buildTriangle(representation)
            case 'sphere':
                return this.#buildSphere(representation)
            case 'nurbs':
                return this.#buildNURBS(representation)
            case 'box':
                return this.#buildBox(representation)
        
            default:
                throw new Error(`Representation of type ${representation.type} not supported.`);
        }
    }

    /**
     * @return {PrimitiveDescriptor}
     */
    #buildCylinder(representation) {
        const {
            base,
            top,
            height,
            slices,
            stacks,
            capsclose,
            thetastart,
            thetalength,
        } = representation;

        return {
            geometry: new THREE.CylinderGeometry(
                top,
                base,
                height,
                slices,
                stacks,
                !capsclose,
                thetastart,
                thetalength,
            ),
            offset: [0, 0, 0],
        };
    }
    
    /**
     * @return {PrimitiveDescriptor}
     */
    #buildRectangle(representation) {
        const {
            xy1,
            xy2,
            parts_x,
            parts_y,
        } = representation;

        const width = Math.abs(xy1[0] - xy2[0]);
        const height = Math.abs(xy1[1] - xy2[1]);

        const offsetX = (xy1[0] + xy2[0]) / 2;
        const offsetY = (xy1[1] + xy2[1]) / 2;

        return {
            geometry: new THREE.PlaneGeometry(width, height, parts_x, parts_y),
            offset: [offsetX, offsetY, 0],
        }
    }
    
    /**
     * @return {PrimitiveDescriptor}
     */
    #buildTriangle(representation) {
        const {
            xyz1,
            xyz2,
            xyz3,
        } = representation;
        
        const geometry = new THREE.BufferGeometry();
        
        const vertices = new Float32Array([
            ...xyz1,
            ...xyz2,
            ...xyz3,
        ]);
        
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        
        return {
            geometry,
            offset: [0, 0, 0],
        };
    }
    
    /**
     * @return {PrimitiveDescriptor}
     */
    #buildSphere(representation) {
        const {
            radius,
            slices,
            stacks,
            thetastart,
            thetalength,
            phistart,
            philength,
        } = representation;

        return {
            geometry: new THREE.SphereGeometry(
                radius,
                slices,
                stacks,
                phistart,
                philength,
                thetastart,
                thetalength,
            ),
            offset: [0, 0, 0]
        };
    }

    /*
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
    */
    
    /**
     * @return {PrimitiveDescriptor}
     */
    #buildNURBS(representation) {

        const {
            degree_u,
            degree_v,
            parts_u,
            parts_v,
            distance,
            controlpoints,
        } = representation;


        const vectorControlPoints = controlpoints.map(
            (point) => [point.xx, point.yy, point.zz]
        );

        const cPoints = [];
        let k = 0;

        for (let i = 0; i <= degree_u; i++) {
            let subControlPoints = [];
            for (let v = 0; v <= degree_v; v++) {
                subControlPoints.push(vectorControlPoints[k]);
                k++;
            }
            cPoints.push(subControlPoints);
        }


        const surfaceData = this.nurbsBuilder.build(
            cPoints,
            degree_u,
            degree_v,
            parts_u,
            parts_v
        );

        return {
            geometry: surfaceData,
            offset: [0, 0, 0],
        }
    }

    /**
     * @returns {PrimitiveDescriptor}
     */
    #buildBox(representation) {
        const {
            xyz1,
            xyz2,
            parts_x,
            parts_y,
            parts_z,
        } = representation;

        const width = Math.abs(xyz1[0] - xyz2[0]);
        const height = Math.abs(xyz1[1] - xyz2[1]);
        const depth = Math.abs(xyz1[2] - xyz2[2]);

        const offsetX = (xyz1[0] + xyz2[0]) / 2;
        const offsetY = (xyz1[1] + xyz2[1]) / 2;
        const offsetZ = (xyz1[2] + xyz2[2]) / 2;

        return {
            geometry: new THREE.BoxGeometry(width, height, depth, parts_x, parts_y, parts_z),
            offset: [offsetX, offsetY, offsetZ],
        };
        
    }
}
