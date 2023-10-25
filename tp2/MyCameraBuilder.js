import * as THREE from "three";

export class MyCameraBuilder {

    buildRepresentation(representation) {
        console.log("MyCameraBuilder#buildRepresentation")

        const camera = this.#buildBaseRepresentation(representation);

        return camera;
    }

    #buildBaseRepresentation(representation, ctx) {
        switch (representation.type) {
            case 'orthogonal': 
                return this.#buildOrthogonalCamera(representation)
            case 'perspective':
                return this.#buildPerspectiveCamera(representation)
        
            default:
                throw new Error(`Representation of type ${representation.type} not supported.`);
        }
    }

    #buildOrthogonalCamera(representation) {
        const {
            id,
            near,
            far,
            location,
            target,
            left,
            right,
            bottom,
            top,
        } = representation;

        const orthogonalCamera = new THREE.OrthographicCamera(
            left,
            right,
            top,
            bottom,
            near,
            far
        );

        orthogonalCamera.position.set(...location);

        const targetObject = new THREE.Object3D();
        targetObject.position.set(...target);

        orthogonalCamera.lookAt(targetObject.position);

        return orthogonalCamera;
    }

    #buildPerspectiveCamera(representation) {
        const {
            id,
            angle,
            near,
            far,
            location,
            target,
        } = representation;

        const perspectiveCamera = new THREE.PerspectiveCamera(
            angle,
            window.innerWidth / window.innerHeight,
            near,
            far
        );

        perspectiveCamera.position.set(...location);

        const targetObject = new THREE.Object3D();

        targetObject.position.set(...target);

        perspectiveCamera.lookAt(targetObject.position);

        return perspectiveCamera;
    }
}
