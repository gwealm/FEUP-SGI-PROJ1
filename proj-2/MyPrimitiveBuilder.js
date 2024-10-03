import * as THREE from "three";
import { MyNurbsBuilder } from "./MyNurbsBuilder.js";

/** @typedef {{ geometry: THREE.BufferGeometry, offset: [number, number, number] }} PrimitiveDescriptor */

/**
 * Class for building various primitives.
 */
export class MyPrimitiveBuilder {
    /**
     * Constructor for MyPrimitiveBuilder.
     *
     * @param {import('./MyMaterialBuilder').MyMaterialBuilder} materialBuilder - An instance of MyMaterialBuilder for building materials.
     */
    constructor(materialBuilder) {
        this.nurbsBuilder = new MyNurbsBuilder();
        this.materialBuilder = materialBuilder;
    }

    /**
     * Builds a primitive based on the provided primitive node and world context.
     *
     * @param {import('./types').SceneGraph.PrimitiveNode} primitive - The primitive node specification.
     * @param {import('./types').WorldContext} ctx - The world context.
     * @returns {THREE.Mesh} - The created primitive as a Three.js Mesh.
     */
    buildPrimitive(primitive, ctx) {
        const { geometry, offset } = this.#buildGeometry(primitive);

        const activeMaterial = ctx.activeMaterials[0];
        const material =
            primitive.subtype === "polygon"
                ? this.materialBuilder.buildPolygonMaterial(activeMaterial)
                : activeMaterial;

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(...offset);

        mesh.receiveShadow = ctx.receiveShadows;
        mesh.castShadow = ctx.castShadows;

        return mesh;
    }

    /**
     * Builds the geometry for a primitive based on its subtype.
     *
     * @param {import('./types').SceneGraph.PrimitiveNode} primitive - The primitive node specification.
     * @returns {PrimitiveDescriptor} - The descriptor containing the geometry and offset for the primitive.
     */
    #buildGeometry(primitive) {
        switch (primitive.subtype) {
            case "cylinder":
                return this.#buildCylinder(primitive.representations[0]);
            case "rectangle":
                return this.#buildRectangle(primitive.representations[0]);
            case "triangle":
                return this.#buildTriangle(primitive.representations[0]);
            case "sphere":
                return this.#buildSphere(primitive.representations[0]);
            case "nurbs":
                return this.#buildNURBS(primitive.representations[0]);
            case "box":
                return this.#buildBox(primitive.representations[0]);
            case "polygon":
                return this.#buildPolygon(primitive.representations[0]);

            default:
                throw new Error(
                    `Representation of type ${primitive.subtype} not supported.`
                );
        }
    }

    /**
     * Builds a cylinder geometry based on the cylinder representation.
     *
     * @param {import('./types').Descriptors.Primitives.Cylinder} representation - The cylinder representation.
     * @return {PrimitiveDescriptor} - The descriptor containing the cylinder geometry and offset.
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
                thetalength
            ),
            offset: [0, 0, 0],
        };
    }

    /**
     * Builds a rectangle geometry based on the rectangle representation.
     *
     * @param {import('./types').Descriptors.Primitives.Rectangle} representation - The rectangle representation.
     * @return {PrimitiveDescriptor} - The descriptor containing the rectangle geometry and offset.
     */
    #buildRectangle(representation) {
        const { xy1, xy2, parts_x, parts_y } = representation;

        const width = Math.abs(xy1[0] - xy2[0]);
        const height = Math.abs(xy1[1] - xy2[1]);

        const offsetX = (xy1[0] + xy2[0]) / 2;
        const offsetY = (xy1[1] + xy2[1]) / 2;

        const geometry = new THREE.PlaneGeometry(
            width,
            height,
            parts_x,
            parts_y
        );

        const uvAttribute = geometry.getAttribute("uv");
        for (let i = 0; i < uvAttribute.count; i++) {
            let u = uvAttribute.getX(i);
            let v = uvAttribute.getY(i);

            uvAttribute.setXY(i, u * width, v * height);
        }

        uvAttribute.needsUpdate = true;

        return {
            geometry,
            offset: [offsetX, offsetY, 0],
        };
    }

    /**
     * Builds a triangle geometry based on the triangle representation.
     *
     * @param {import('./types').Descriptors.Primitives.Triangle} representation - The triangle representation.
     * @return {PrimitiveDescriptor} - The descriptor containing the triangle geometry and offset.
     */
    #buildTriangle(representation) {
        const { xyz1, xyz2, xyz3 } = representation;

        const geometry = new THREE.BufferGeometry();

        // Positions
        const positions = new Float32Array([...xyz1, ...xyz2, ...xyz3]);

        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );
        geometry.computeVertexNormals();

        // UV mapping
        const p1 = new THREE.Vector3(...xyz1);
        const p2 = new THREE.Vector3(...xyz2);
        const p3 = new THREE.Vector3(...xyz3);

        const asq = p1.distanceToSquared(p2);
        const bsq = p2.distanceToSquared(p3);
        const csq = p3.distanceToSquared(p1);

        const a = Math.sqrt(asq);
        const c = Math.sqrt(csq);

        const cosAlpha = (asq - bsq + csq) / (2 * a * c);
        const sinAlpha = Math.sqrt(1 - cosAlpha * cosAlpha);

        const uv = new Float32Array([0, 0, a, 0, c * cosAlpha, c * sinAlpha]);

        geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));

        return {
            geometry,
            offset: [0, 0, 0],
        };
    }

    /**
     * Builds a sphere geometry based on the sphere representation.
     *
     * @param {import('./types').Descriptors.Primitives.Sphere} representation - The sphere representation.
     * @return {PrimitiveDescriptor} - The descriptor containing the sphere geometry and offset.
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
                thetalength
            ),
            offset: [0, 0, 0],
        };
    }

    /**
     * Builds a NURBS geometry based on the NURBS representation.
     *
     * @param {import('./types').Descriptors.Primitives.NURBS} representation - The NURBS representation.
     * @return {PrimitiveDescriptor} - The descriptor containing the NURBS geometry and offset.
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

        const vectorControlPoints = controlpoints.map((point) => [
            point.xx,
            point.yy,
            point.zz,
        ]);

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
        };
    }

    /**
     * Builds a box geometry based on the box representation.
     *
     * @param {import('./types').Descriptors.Primitives.Box} representation - The box representation.
     * @returns {PrimitiveDescriptor} - The descriptor containing the box geometry and offset.
     */
    #buildBox(representation) {
        const { xyz1, xyz2, parts_x, parts_y, parts_z } = representation;

        const width = Math.abs(xyz1[0] - xyz2[0]);
        const height = Math.abs(xyz1[1] - xyz2[1]);
        const depth = Math.abs(xyz1[2] - xyz2[2]);

        const offsetX = (xyz1[0] + xyz2[0]) / 2;
        const offsetY = (xyz1[1] + xyz2[1]) / 2;
        const offsetZ = (xyz1[2] + xyz2[2]) / 2;

        return {
            geometry: new THREE.BoxGeometry(
                width,
                height,
                depth,
                parts_x,
                parts_y,
                parts_z
            ),
            offset: [offsetX, offsetY, offsetZ],
        };
    }

    /**
     * Builds a polygon geometry based on the polygon representation.
     *
     * @param {import('./types').Descriptors.Primitives.Polygon} representation - The polygon representation.
     * @return {PrimitiveDescriptor} - The descriptor containing the polygon geometry and offset.
     */
    #buildPolygon(representation) {
        const { radius, stacks, slices, color_c, color_p } = representation;

        // Positions
        const positions = new Float32Array(3 + 3 * slices * stacks); // Center + stack positions for each slice
        let currPositionIndex = 0;

        /**
         * Pushes a position into the positions array.
         *
         * @param {number} x - The x-coordinate.
         * @param {number} y - The y-coordinate.
         * @param {number} z - The z-coordinate.
         */
        function pushPosition(x, y, z) {
            positions[currPositionIndex++] = x;
            positions[currPositionIndex++] = y;
            positions[currPositionIndex++] = z;
        }

        const twoPi = 2 * Math.PI;

        let alpha = 0;
        const dAlpha = twoPi / slices;
        const dRadius = radius / stacks;

        pushPosition(0, 0, 0);

        for (let slice = 0; slice < slices; slice++) {
            const dx = -Math.sin(alpha) * dRadius;
            const dy = Math.cos(alpha) * dRadius;
            alpha += dAlpha;

            let x = 0;
            let y = 0;

            for (let stack = 0; stack < stacks; stack++) {
                x += dx;
                y += dy;
                pushPosition(x, y, 0);
            }
        }

        // Indices
        const indices = [];

        /**
         * Pushes indices for a triangle into the indices array.
         *
         * @param {number} first - The index of the first vertex.
         * @param {number} second - The index of the second vertex.
         * @param {number} third - The index of the third vertex.
         */
        function pushIndices(first, second, third) {
            indices.push(first, second, third);
        }

        // `nextInnerIndex` is the point in the same stack as `innerIndex`, but on the next slice
        let innerIndex = 1;
        let nextInnerIndex = innerIndex + stacks;

        const maxIndex = slices * stacks;
        for (let slice = 0; slice < slices; slice++) {
            // First, we'll take care of the inner stack triangle
            pushIndices(0, innerIndex, nextInnerIndex);

            // Secondly, we'll take care of the indices of the triangles
            // in the outer stacks
            let outerIndex = innerIndex + 1;
            let nextOuterIndex = nextInnerIndex + 1;

            for (let stack = 1; stack < stacks; stack++) {
                pushIndices(innerIndex, outerIndex, nextInnerIndex);
                pushIndices(nextInnerIndex, outerIndex, nextOuterIndex);
                innerIndex = outerIndex++;
                nextInnerIndex = nextOuterIndex++;
            }

            innerIndex++;
            nextInnerIndex = (nextInnerIndex % maxIndex) + 1;
        }

        // Colors
        const stackColors = new Float32Array(4 * stacks); // Stack colors
        let currStackColorIndex = 0;

        /**
         * Pushes a color into the stackColors array.
         *
         * @param {number} r - The red component.
         * @param {number} g - The green component.
         * @param {number} b - The blue component.
         * @param {number} a - The alpha component.
         */
        function pushStackColor(r, g, b, a) {
            stackColors[currStackColorIndex++] = r;
            stackColors[currStackColorIndex++] = g;
            stackColors[currStackColorIndex++] = b;
            stackColors[currStackColorIndex++] = a;
        }

        const dr = (color_p.r - color_c.r) / stacks;
        const dg = (color_p.g - color_c.g) / stacks;
        const db = (color_p.b - color_c.b) / stacks;
        const da = (color_p.a - color_c.a) / stacks;

        let r = color_c.r;
        let g = color_c.g;
        let b = color_c.b;
        let a = color_c.a;

        for (let stack = 0; stack < stacks; stack++) {
            r += dr;
            g += dg;
            b += db;
            a += da;

            pushStackColor(r, g, b, a);
        }

        const colors = new Float32Array(4 + 4 * slices * stacks); // Center + stack colors for each slice

        let currColorIndex = 0;
        colors[currColorIndex++] = color_c.r;
        colors[currColorIndex++] = color_c.g;
        colors[currColorIndex++] = color_c.b;
        colors[currColorIndex++] = color_c.a;

        for (let slice = 0; slice < slices; slice++) {
            colors.set(stackColors, currColorIndex);
            currColorIndex += stackColors.length;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setIndex(indices);

        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );

        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 4));

        geometry.computeVertexNormals();

        return {
            geometry: geometry,
            offset: [0, 0, 0],
        };
    }
}
