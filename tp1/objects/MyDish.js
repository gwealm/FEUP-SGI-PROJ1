import {dish} from "../MyMaterials.js";
import * as THREE from 'three';

export class MyDishFactory {
  constructor(variant) {
    this.material = dish[variant];
  }

  buildDish(radiusTop = 1, radiusBottom = 0.4, height = 0.5) {
    if (radiusTop <= radiusBottom) {
      throw "radiusTop must be bigger than radiusBottom";
    }

    let radialSegments = 32;
    let heightSegments = 15;

    // Create a Cylinder Mesh with basic material
    let cylinder = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments);

    return new THREE.Mesh(cylinder, this.material);
  }
}
