import { dish } from "../../MyMaterials.js";
import * as THREE from "three";


export class MyDishFactory {
    constructor(variant) {
        this.material = dish[variant];
    }

    buildDish(scale = 1) {
        const radiusTop = scale;
        const radiusBottom = 0.4 * scale;
        const height = scale * 0.2;

        if (radiusTop <= radiusBottom) {
            throw "radiusTop must be bigger than radiusBottom";
        }

        let radialSegments = 32;
        let heightSegments = 15;

        // Create a Cylinder Mesh with basic material
        let cylinder = new THREE.CylinderGeometry(
            radiusTop,
            radiusBottom,
            height,
            radialSegments,
            heightSegments
        );

        let dishMesh = Object.assign(new THREE.Mesh(cylinder, this.material), {
            __radius_top: radiusTop,
            __radius_bottom: radiusBottom,
            __height: height,
        });

        dishMesh.castShadow = true;
        dishMesh.receiveShadow = true;

        return dishMesh;
    }
}
