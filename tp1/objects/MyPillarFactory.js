import * as materials from "../MyMaterials.js";

export class MyPillarFactory {
  constructor(variant) {
    this.material = materials.pillar[variant];
  }

  buildPillar(radius, height) {
    let radialSegments = 32;

    // Create a Cylinder Mesh with basic material
    let cylinder = new THREE.CylinderGeometry(radius, radius, height, radialSegments);

    return new THREE.Mesh(cylinder, this.material);
  }
}
