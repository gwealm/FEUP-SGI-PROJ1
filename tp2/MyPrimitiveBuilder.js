import * as THREE from "three";

const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    wireframe: true,
});

export class MyPrimitiveBuilder {

    buildRepresentation(representation, ctx) {
        switch (representation.type) {
            case 'cylinder':
                return this.#buildCylinder(representation, ctx)
            case 'rectangle':
                return this.#buildRectangle(representation, ctx)
            case 'triangle':
                return this.#buildTriangle(representation, ctx)
            case 'sphere':
                return this.#buildSphere(representation, ctx)
            case 'nurbs':
                return this.#buildCylinder(representation, ctx)
            case 'box':
                return this.#buildBox(representation, ctx)
        
            default:
                throw new Error(`Representation of type ${representation.type} not supported.`);
        }
    }

    #buildCylinder(representation, ctx) {
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

        const geometry = new THREE.CylinderGeometry(
            top,
            base,
            height,
            slices,
            stacks,
            !capsclose,
            thetastart,
            thetalength,
        );

        return new THREE.Mesh(geometry, material);
    }

    #buildRectangle(representation, ctx) {
        const {
            xy1,
            xy2,
            parts_x,
            parts_y,
        } = representation;

        const width = Math.abs(xy1.x - xy2.x);
        const height = Math.abs(xy1.y - xy2.y);

        const geometry = new THREE.PlaneGeometry(
            width,
            height,
            parts_x,
            parts_y,
        );

        return new THREE.Mesh(geometry, material);
    }

    #buildTriangle(representation, ctx) {
        const {
            xyz1,
            xyz2,
            xyz3,
        } = representation;
        
        const geometry = new THREE.Triangle(xyz1, xyz2, xyz3);
        return new THREE.Mesh(geometry, material);
    }

    #buildSphere(representation, ctx) {
        const {
            radius,
            slices,
            stacks,
            thetastart,
            thetalength,
            phistart,
            philength,
        } = representation;

        const geometry = new THREE.SphereGeometry(
            radius,
            slices,
            stacks,
            phistart,
            philength,
            thetastart,
            thetalength,
        );

        return new THREE.Mesh(geometry, material);
    }

    #buildNURBS(representation, ctx) {
        const {
            degree_u,
            degree_v,
            parts_u,
            parts_v,
        } = representation;

        const geometry = new THREE.PlaneGeometry(5, 5);
        return new THREE.Mesh(geometry, material);
    }

    #buildBox(representation, ctx) {
        const {
            xyz1,
            xyz2,
            parts_x,
            parts_y,
            parts_z,
        } = representation;

        const width = Math.abs(xyz1.x - xyz2.x);
        const height = Math.abs(xyz1.y - xyz2.y);
        const depth = Math.abs(xyz1.z - xyz2.z);

        const boxGeometry = new THREE.BoxGeometry(width, height, depth, parts_x, parts_y, parts_z);
        return new THREE.Mesh(boxGeometry, material);
    }
}