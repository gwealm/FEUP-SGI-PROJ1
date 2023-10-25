import * as THREE from "three";
import { MySpotlightFactory } from "../../lights/MySpotlightFactory.js";

/**
 * Factory class for creating circular windows with frames.
 */
export class MyCircularWindowFactory {

  /**
   * Creates an instance of MyCircularWindowFactory.
   * @param {import('../../lights/MySpotlightFactory.js').MySpotlightFactory} spotlightFactory The spotlight factory to use for the window's light source.
   * @param {object} options The options to control this factory's behavior.
   * @param {number=} options.lod The level of detail for the window frames.
   */
    constructor(spotlightFactory, options = {}) {
        this.spotlightFactory = spotlightFactory;
        this.lod = options.lod ?? 15;

        this.twoPi = 2 * Math.PI;
    }

  /**
   * Builds a circular window with a frame and glass.
   * @param {object} options The options to control the window construction.
   * @param {object} options.materials The materials to use for the window.
   * @param {THREE.Material} options.materials.frame The material to use for the window frame.
   * @param {THREE.Material} options.materials.landscape The material to use for the window landscape.
   * @param {number} options.scaleXY Scale factor for the window's X and Y dimensions.
   * @param {number} options.scaleZ Scale factor for the window's Z dimension.
   * @param {number} options.bezelScale Scale factor for the window's bezel.
   * @returns The 3D object representing the circular window.
   */
    #buildWindow(options) {
        const { scaleXY, scaleZ, bezelScale } = options;
        
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

        const frameMesh = new THREE.Mesh(frame, options.materials.frame);
        group.add(frameMesh);

        const landscape = new THREE.CircleGeometry(innerRadius, curveSegments);
        const landscapeMesh = new THREE.Mesh(landscape, options.materials.landscape);
        landscapeMesh.position.z = depth / 2;
        group.add(landscapeMesh);

        return Object.assign(
            group, {
                __radius: radius,
                __innerRadius: innerRadius,
                __depth: depth,
            }
        );
    }

    /**
     * Calculates the position of the spotlight for the window.
     * @param {number} innerRadius The inner radius of the window frame.
     * @param {number} depth The depth of the window frame.
     * @param {number} moonAngle The angle of the moon in radians.
     * @param {number} lightAmplitude The amplitude of the spotlight in radians.
     * @returns The position of the "moon" spotlight.
     */
    #calculateSpotlightPosition(innerRadius, depth, moonAngle, lightAmplitude) {
        const target = new THREE.Vector3(0, 0, -depth / 2);
        const direction = new THREE.Vector3(0, Math.sin(moonAngle), -Math.cos(moonAngle));
        const distance = innerRadius / Math.tan(lightAmplitude / 2);

        const spotlightPosition = new THREE.Vector3();
        spotlightPosition.addVectors(direction.multiplyScalar(distance), target);
        return spotlightPosition;
    }

    /**
     * Builds a complete 3D circular window model with a frame and light source.
     * @param {object} options The options to control the window construction.
     * @param {object} options.materials The materials to use for the window.
     * @param {THREE.Material} options.materials.frame The material to use for the window frame.
     * @param {THREE.Material} options.materials.landscape The material to use for the window landscape.
     * @param {number=} options.scaleXY Scale factor for the window's X and Y dimensions.
     * @param {number=} options.scaleZ Scale factor for the window's Z dimension.
     * @param {number=} options.bezelScale Scale factor for the window's bezel.
     * @param {number=} options.moonAngle The angle of the moon in radians.
     * @param {number=} options.lightAmplitude The amplitude of the spotlight in radians.
     * @returns The 3D object representing the circular window.
     */
    build(options) {
        const {
            scaleXY = 1,
            scaleZ = 1,
            bezelScale = 1,
            moonAngle = 0,
            lightAmplitude = Math.PI / 6,
            materials,
        } = options;

        const group = new THREE.Group();

        const frame = this.#buildWindow({ scaleXY, scaleZ, bezelScale, materials });
        group.add(frame);
        
        const lightSourcePosition = this.#calculateSpotlightPosition(frame.__innerRadius, frame.__depth, moonAngle, lightAmplitude);
        const distance = lightSourcePosition.sub(frame.position).length();
        const lightSource = this.spotlightFactory.buildSpotlight({
            angle: lightAmplitude / 2,
            distance: distance + 99,
            intensity: 10,
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