import * as THREE from "three";

/**
 * Class for building cameras in the scene.
 */
export class MyCameraBuilder {
    /**
     * Build a camera based on the provided camera specification.
     * @param {import('./types').SceneGraph.Camera} camera - The camera specification.
     * @returns {THREE.Camera} - The built camera.
     */
    buildCamera(camera) {
        const baseCamera = this.#buildBaseCamera(camera);

        const { id, location, target } = camera;

        baseCamera.name = id;
        baseCamera.position.set(...location);
        return Object.assign(baseCamera, {
            __target: new THREE.Vector3(...target),
        });
    }

    /**
     * Build a base camera based on its type.
     * @param {import('./types').SceneGraph.Camera} camera - The camera specification.
     * @returns {THREE.Camera} - The built base camera.
     * @throws {Error} - Throws an error if the camera type is not supported.
     */
    #buildBaseCamera(camera) {
        switch (camera.type) {
            case "orthogonal":
                return this.#buildOrthogonalCamera(camera);
            case "perspective":
                return this.#buildPerspectiveCamera(camera);

            default:
                // @ts-ignore
                throw new Error(`Camera of type ${camera.type} not supported.`);
        }
    }

    /**
     * Build an orthogonal camera based on the provided specification.
     * @param {import('./types').SceneGraph.Camera & { type: "orthogonal" }} camera - The orthogonal camera specification.
     * @returns {THREE.OrthographicCamera} - The built orthogonal camera.
     */
    #buildOrthogonalCamera(camera) {
        const { near, far, left, right, bottom, top } = camera;

        const orthogonalCamera = new THREE.OrthographicCamera(
            left,
            right,
            top,
            bottom,
            near,
            far
        );

        return orthogonalCamera;
    }

    /**
     * Build a perspective camera based on the provided specification.
     * @param {import('./types').SceneGraph.Camera & { type: "perspective" }} representation - The perspective camera specification.
     * @returns {THREE.PerspectiveCamera} - The built perspective camera.
     */
    #buildPerspectiveCamera(representation) {
        const { angle, near, far } = representation;

        const perspectiveCamera = new THREE.PerspectiveCamera(
            angle,
            window.innerWidth / window.innerHeight,
            near,
            far
        );

        return perspectiveCamera;
    }
}
