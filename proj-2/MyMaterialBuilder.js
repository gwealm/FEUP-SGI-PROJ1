import * as THREE from "three";

export class MyMaterialBuilder {
    /**
     * Creates an instance of MyMaterialBuilder.
     * @param {import('./types').CustomEventDispatcher} eventDispatcher - The custom event dispatcher.
     */
    constructor(eventDispatcher) {
        this.eventDispatcher = eventDispatcher;
    }

    /**
     * Builds a Phong material based on the provided material specifications and textures.
     *
     * @param {import('./types').SceneGraph.Material} materialSpec - The material specifications.
     * @param {Map<string, THREE.Texture>} textures - The textures to be used in the material.
     * @returns {THREE.MeshPhongMaterial} - The constructed material.
     */
    buildMaterial(materialSpec, textures) {
        const {
            bumpref,
            bumpscale,
            color,
            emissive,
            shading,
            shininess,
            id,
            specular,
            specularref,
            textureref,
            texlength_s,
            texlength_t,
            twosided,
            wireframe,
        } = materialSpec;

        const material = new THREE.MeshPhongMaterial({
            name: id,
            color,
            opacity: color.a,
            transparent: true,
            emissive,
            flatShading: shading === "flat",
            shininess,
            specular,
            side: twosided ? THREE.DoubleSide : THREE.FrontSide,
            wireframe,
        });

        if (!!textureref) {
            // @ts-expect-error
            const map = textures.get(textureref).clone();
            map.repeat.set(1 / texlength_s, 1 / texlength_t);

            material.map = map;
        }

        if (!!specularref) {
            // @ts-expect-error
            const specularMap = textures.get(specularref).clone();
            specularMap.repeat.set(1 / texlength_s, 1 / texlength_t);
            material.specularMap = specularMap;
        }

        if (!!bumpref) {
            // @ts-expect-error
            const bumpMap = textures.get(bumpref).clone();
            material.bumpMap = bumpMap;
            material.bumpScale = bumpscale;
        }

        this.#injectVisualizationModeListeners(material);

        return material;
    }

    /**
     * Builds a Phong material for polygon visualization based on the provided active material.
     *
     * @param {THREE.MeshPhongMaterial} activeMaterial - The active material.
     * @returns {THREE.MeshPhongMaterial} - The constructed polygon material.
     */
    buildPolygonMaterial(activeMaterial) {
        const material = new THREE.MeshPhongMaterial({
            flatShading: activeMaterial.flatShading,
            wireframe: activeMaterial.wireframe,
            side: activeMaterial.side,
            vertexColors: true,
            transparent: true,
        });

        this.#injectVisualizationModeListeners(material);
        return material;
    }

    /**
     * @param {THREE.MeshPhongMaterial | THREE.MeshLambertMaterial | THREE.MeshBasicMaterial} material
     */
    /**
     * Injects event listeners for visualization mode changes into the provided material.
     *
     * @param {THREE.MeshPhongMaterial | THREE.MeshLambertMaterial | THREE.MeshBasicMaterial} material
     */
    #injectVisualizationModeListeners(material) {
        const initialWireframe = material.wireframe;
        this.eventDispatcher.addEventListener(
            "custom:material:setvisualization",
            (ev) => {
                const value = ev.mode;

                switch (value) {
                    case "as-is":
                        material.wireframe = initialWireframe;
                        break;

                    case "wireframe":
                        material.wireframe = true;
                        break;

                    case "fill":
                        material.wireframe = false;
                        break;

                    default:
                        throw new Error(`Invalid visualization mode ${value}`);
                }
            }
        );
    }
}
