import * as THREE from "three";

/** @typedef {[number, number, number]} ArrayVector3 */
/** @typedef {{ type: "T", translate: ArrayVector3 }} TranslationTransformation */
/** @typedef {{ type: "R", rotation: ArrayVector3 }} RotationTransformation */
/** @typedef {{ type: "S", scale: ArrayVector3 }} ScaleTransformation */
/** @typedef { TranslationTransformation | RotationTransformation | ScaleTransformation } Transformation */


export class MyTransformations {

    #degreesToRadians = Math.PI / 180;

    /**
     * @param {THREE.Matrix4=} baseMatrix 
     */
    constructor(baseMatrix) {
        this.baseMatrix = baseMatrix ?? new THREE.Matrix4();
    }

    /**
     * @param {Transformation[]} transformations
     */
    applyTransformations(transformations) {
        const compositeMatrix = new THREE.Matrix4();

        for (const transformation of transformations) {
            const transformationMatrix = this.#getTransformationMatrix(transformation);
            compositeMatrix.multiply(transformationMatrix);
        }

        const newBaseMatrix = this.baseMatrix.clone();
        newBaseMatrix.multiply(compositeMatrix);
        
        return new MyTransformations(newBaseMatrix);
    }

    toMatrix4() {
        return this.baseMatrix;
    }

    /**
     * @param {Transformation} transformation 
     */
    #getTransformationMatrix(transformation) {
        if (transformation.type === "T") {
            return this.#getTranslationMatrix(transformation);
        }

        if (transformation.type === "R") {
            return this.#getRotationMatrix(transformation);
        }

        if (transformation.type === "S") {
            return this.#getScaleMatrix(transformation);
        }
    }

    /**
     * @param {TranslationTransformation} transformation 
     */
    #getTranslationMatrix({ translate }) {
        return new THREE.Matrix4().makeTranslation(
            ...translate
        );
    }

    /**
     * @param {RotationTransformation} transformation 
     */
    #getRotationMatrix({ rotation }) {
        /** @type {ArrayVector3} */
        const rotationInRadians = [
            rotation[0] * this.#degreesToRadians,
            rotation[1] * this.#degreesToRadians,
            rotation[2] * this.#degreesToRadians,
        ];

        return new THREE.Matrix4().makeRotationFromEuler(
            new THREE.Euler(...rotationInRadians, "XYZ")
        );
    }

    /**
     * @param {ScaleTransformation} transformation 
     */
    #getScaleMatrix({ scale }) {
        return new THREE.Matrix4().makeScale(
            ...scale
        );
    }
}
