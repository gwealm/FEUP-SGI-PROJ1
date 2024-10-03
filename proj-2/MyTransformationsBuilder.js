import * as THREE from "three";

/** @typedef {[number, number, number]} ArrayVector3 */
/** @typedef {{ type: "T", translate: ArrayVector3 }} TranslationTransformation */
/** @typedef {{ type: "R", rotation: ArrayVector3 }} RotationTransformation */
/** @typedef {{ type: "S", scale: ArrayVector3 }} ScaleTransformation */
/** @typedef { TranslationTransformation | RotationTransformation | ScaleTransformation } Transformation */

/**
 * Class for building transformation matrices.
 */
export class MyTransformationsBuilder {
    /**
     * Builds a composite transformation matrix based on an array of transformation specifications.
     *
     * @param {Transformation[]} transformations - Array of transformation specifications.
     * @returns {THREE.Matrix4} - The composite transformation matrix.
     */
    buildMatrix(transformations) {
        const compositeMatrix = new THREE.Matrix4();

        for (const transformation of transformations) {
            const transformationMatrix =
                this.#getTransformationMatrix(transformation);
            compositeMatrix.multiply(transformationMatrix);
        }

        return compositeMatrix;
    }

    /**
     * Determines the appropriate transformation matrix based on the transformation type.
     *
     * @param {Transformation} transformation - The transformation specification.
     * @returns {THREE.Matrix4} - The transformation matrix.
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

        return transformation;
    }

    /**
     * Builds a translation matrix based on the translation transformation specification.
     *
     * @param {TranslationTransformation} transformation - The translation transformation specification.
     * @returns {THREE.Matrix4} - The translation matrix.
     */
    #getTranslationMatrix({ translate }) {
        return new THREE.Matrix4().makeTranslation(...translate);
    }

    /**
     * Builds a rotation matrix based on the rotation transformation specification.
     *
     * @param {RotationTransformation} transformation - The rotation transformation specification.
     * @returns {THREE.Matrix4} - The rotation matrix.
     */
    #getRotationMatrix({ rotation }) {
        /** @type {ArrayVector3} */
        const rotationInRadians = [rotation[0], rotation[1], rotation[2]];

        return new THREE.Matrix4().makeRotationFromEuler(
            new THREE.Euler(...rotationInRadians, "XYZ")
        );
    }

    /**
     * @param {ScaleTransformation} transformation
     */
    #getScaleMatrix({ scale }) {
        return new THREE.Matrix4().makeScale(...scale);
    }
}
