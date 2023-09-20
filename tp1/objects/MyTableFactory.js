import { table } from "../MyMaterials";

export class MyTableFactory {
    #buildTop(width, height, depth) {
        let box = new THREE.BoxGeometry(
            width,
            height,
            depth,
        );

        return new THREE.Mesh(box, table.top);
    }

    #buildLeg(height, radius) {
        let leg = new THREE.CylinderGeometry(radius, radius, height);

        return new THREE.Mesh(leg, table.leg);
    }

    buildTable(width, height, depth, legHeight, legRadius) {
        let top = this.#buildTop(width, height, depth);
        let leg = this.#buildLeg(legHeight, legRadius);

        let table = new THREE.Group();
        table.add(top);

        
        table.add(leg);
    }
}