import * as THREE from "three";


export class MyLightBuilder {

    buildRepresentation(representation) {
        console.log("MyLightBuilder#buildRepresentation")

        const mesh = this.#buildBaseRepresentation(representation);

        return mesh;
    }

    #buildBaseRepresentation(representation, ctx) {
        switch (representation.type) {
            case 'spotlight': 
                return this.#buildSpotLight(representation)
            case 'pointlight':
                return this.#buildPointLight(representation)
            case 'directionallight':
                return this.#buildDirectionalLight(representation)
        
            default:
                throw new Error(`Representation of type ${representation.type} not supported.`);
        }
    }

    #buildSpotLight(representation) {
        const {
            id,
			color,
			position,
			target,
			angle,
            enabled,
			intensity,
			distance,
			decay,
			penumbra,
			castshadow,
            shadowfar,
            shadowmapsize,
        } = representation;

        const spotLight = new THREE.SpotLight(
            color,
            intensity,
            distance,
            angle,
            penumbra,
            decay
        );

        spotLight.position.set(position[0], position[1], position[2]);

        const targetObject = new THREE.Object3D();
        targetObject.position.set(target[0], target[1], target[2]);
        spotLight.target = targetObject;

        spotLight.visible = enabled;

        if (castshadow) {
            spotLight.castShadow = castshadow;
            spotLight.shadow.mapSize.width = shadowmapsize;
            spotLight.shadow.mapSize.height = shadowmapsize;
            spotLight.shadow.camera.far = shadowfar;
        }

        return spotLight;
    }

    #buildPointLight(representation) {
        const {
            id,
			color,
			position,
            enabled,
			intensity,
			distance,
			decay,
			castshadow,
            shadowfar,
            shadowmapsize,
        } = representation;

        const pointLight = new THREE.PointLight(color, intensity, distance, decay);

        pointLight.position.set(position.x, position.y, position.z);

        pointLight.visible = enabled;

        if (castshadow) {
            pointLight.castShadow = true;
            pointLight.shadow.mapSize.width = shadowmapsize;
            pointLight.shadow.mapSize.height = shadowmapsize;
            pointLight.shadow.camera.far = shadowfar;
        }

        return pointLight;
    }

    #buildDirectionalLight(representation) {
        const {
            id,
			color,
			position,
            enabled,
			intensity,
			castshadow,
            shadowleft,
            shadowright,
            shadowbottom,
            shadowtop,
            shadowfar,
            shadowmapsize,
        } = representation;
        
        const directionalLight = new THREE.DirectionalLight(color, intensity);

        directionalLight.visible = enabled;

        directionalLight.position.set(position[0], position[1], position[2]);

        if (castshadow) {
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = shadowmapsize;
            directionalLight.shadow.mapSize.height = shadowmapsize;
            directionalLight.shadow.camera.left = shadowleft;
            directionalLight.shadow.camera.right = shadowright;
            directionalLight.shadow.camera.bottom = shadowbottom;
            directionalLight.shadow.camera.top = shadowtop;
            directionalLight.shadow.camera.far = shadowfar;
        }

        return directionalLight;
    }
}
