import * as THREE from "three";
import { window } from "../../MyMaterials.js";

export class MyCircularWindowFactory {

    constructor(/** @type {keyof window} */ variant, lod = 15) {
        this.twoPi = 2 * Math.PI;
        this.material = window[variant];
        this.lod = lod;
    }
    

    #buildCircularFrame(scaleX, scaleY, scaleZ, bezelScale) {
        const radiusX = scaleX, radiusY = scaleY;

        const outerCircle = new THREE.Shape();
        outerCircle.ellipse(0, 0, radiusX, radiusY, 0, this.twoPi);

        const bezelThickness = 0.2 * bezelScale;
        const innerRadiusX = radiusX -  bezelThickness;
        const innerRadiusY = radiusY - bezelThickness;
        
        const innerCircle = new THREE.Shape();
        innerCircle.ellipse(0, 0, innerRadiusX, innerRadiusY, 0, this.twoPi);
        outerCircle.holes = [innerCircle];

        const depth = 0.2 * scaleZ;
        const curveSegments = Math.ceil(this.lod * Math.sqrt((radiusX * radiusX + radiusY * radiusY)));
        const frame = new THREE.ExtrudeGeometry(outerCircle, {
            bevelEnabled: false,
            curveSegments,
            depth,
        });

        const frameMesh = new THREE.Mesh(frame, this.material.frame);
        return Object.assign(
            frameMesh, {
                __radiusX: radiusX,
                __radiusY: radiusY,
                __innerRadiusX: innerRadiusX,
                __innerRadiusY: innerRadiusY,
            }
        );
    }

    build(scaleX = 1, scaleY = 1, scaleZ = 1, bezelScale = 1) {
        const frame = this.#buildCircularFrame(scaleX, scaleY, scaleZ, bezelScale);
        return frame;
    }
}