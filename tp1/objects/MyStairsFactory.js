import * as materials from "../MyMaterials.js";

export class MyStairsFactory {
  constructor(variant) {
    this.material = materials.pillar[variant];
  }

  buildPillar(width, height, depth) {
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    // Create a Cylinder Mesh with basic material
    let cylinder = new THREE.CylinderGeometry(5, 5, 20, 32);

    return new THREE.Mesh(cylinder, this.material);
  }
}
