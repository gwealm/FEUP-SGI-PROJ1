import * as THREE from "three";
import { window } from "../../MyMaterials.js";
import { MySpotlightFactory } from "../../lights/MySpotlightFactory.js";

export class MyCircularWindowFactory {

    constructor(/** @type {keyof window} */ variant, lod = 15) {
        this.twoPi = 2 * Math.PI;
        this.material = window[variant];
        this.lod = lod;

        this.spotlightFactory = new MySpotlightFactory();
    }
    

    #buildWindow(scaleXY, scaleZ, bezelScale) {
        const radius = scaleXY;

        const outerCircle = new THREE.Shape();
        outerCircle.ellipse(0, 0, radius, radius, 0, this.twoPi);

        const bezelThickness = 0.1 * bezelScale;
        const innerRadius = radius -  bezelThickness;
        
        const innerCircle = new THREE.Shape();
        innerCircle.ellipse(0, 0, innerRadius, innerRadius, 0, this.twoPi);
        outerCircle.holes = [innerCircle];

        const group = new THREE.Group();

        const depth = 0.1 * scaleZ;
        const curveSegments = Math.ceil(this.lod * radius);
        const frame = new THREE.ExtrudeGeometry(outerCircle, {
            bevelEnabled: false,
            curveSegments,
            depth,
        });

        const frameMesh = new THREE.Mesh(frame, this.material.frame);
        group.add(frameMesh);

        const glass = new THREE.CircleGeometry(innerRadius, curveSegments);
        const glassMesh = new THREE.Mesh(glass, this.material.glass);
        glassMesh.position.z = depth / 2;
        group.add(glassMesh);

        return Object.assign(
            group, {
                __radius: radius,
                __innerRadius: innerRadius,
                __depth: depth,
            }
        );
    }

    #calculateSpotlightPosition(innerRadius, depth, moonAngle, lightAmplitude) {
        const target = new THREE.Vector3(0, 0, -depth / 2);
        const direction = new THREE.Vector3(0, Math.sin(moonAngle), -Math.cos(moonAngle));
        const distance = innerRadius / Math.tan(lightAmplitude / 2);

        const spotlightPosition = new THREE.Vector3();
        spotlightPosition.addVectors(direction.multiplyScalar(distance), target);
        return spotlightPosition;
    }

    build(scaleXY = 1, scaleZ = 1, bezelScale = 1, moonAngle = 0, lightAmplitude = Math.PI / 6) {
        const group = new THREE.Group();

        const frame = this.#buildWindow(scaleXY, scaleZ, bezelScale);
        group.add(frame);
        
        const lightSourcePosition = this.#calculateSpotlightPosition(frame.__innerRadius, frame.__depth, moonAngle, lightAmplitude);
        const distance = lightSourcePosition.sub(frame.position).length();
        const lightSource = this.spotlightFactory.buildSpotlight({
            angle: lightAmplitude / 2,
            distance: distance + 99,
            intensity: 5,
            color: 0xafafff,
            castShadows: true,
            shadowsOptions: {
                near: distance - 1,
                far: distance + 99,
                fov: lightAmplitude,
            }
        });

        lightSource.position.copy(lightSourcePosition);
        lightSource.target = frame;
        group.add(lightSource);

        const ambientLightSourcePosition = new THREE.Vector3(0, 0, 1.5);
        const ambientLigthAmplitude = 2 * Math.atan(frame.__radius / ambientLightSourcePosition.z);
        const ambientLightSource = this.spotlightFactory.buildSpotlight({
            angle: ambientLigthAmplitude / 2,
            distance: 1 + ambientLightSourcePosition.z,
            intensity: 5,
            penumbra: 0,
            color: 0xafafff,
        });

        ambientLightSource.position.copy(ambientLightSourcePosition);
        ambientLightSource.target = frame;
        group.add(ambientLightSource);

        return Object.assign(
            group, {
                __radius: frame.__radius,
                __depth: frame.__depth,
            }
        );
    }
}