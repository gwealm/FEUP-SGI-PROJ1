import * as THREE from "three";
import { MyPrimitiveBuilder } from "./MyPrimitiveBuilder.js";

export class MyParser {
    constructor(nodes) {
        this.nodes = nodes;
        this.primitiveBuilder = new MyPrimitiveBuilder();
    }
    
    visitNodes() {
        return this.#visitNode(this.nodes["scene"], {});
    }

    #visitChild(child, ctx) {
        if (child.type === "primitive") return this.#visitPrimitive(child, ctx);
        
        const node = this.nodes[child.id];
        if (!node) return null;

        return this.#visitNode(node, ctx);
    }

    #visitNode(node, ctx) {
        if (node.type !== "node")
            throw new Error("Object is not a node");

        const { children, custom, materialIds, transformations } = node;

        const group = new THREE.Group();
        for (const child of children) {
            const builtChild = this.#visitChild(child, ctx);
            if (!builtChild) continue;

            group.add(builtChild);
        }

        return group;
    }

    #visitPrimitive(primitive, ctx) {
        if (primitive.type !== "primitive")
            throw new Error("Object is not a primitive");

        const group = new THREE.Group();
        for (const representation of primitive.representations) {
            const builtRepresentation = this.primitiveBuilder.buildRepresentation(representation);
            group.add(builtRepresentation);
        }

        return group;
    }


    
    searchNodeByID(id) {
        
    }
}