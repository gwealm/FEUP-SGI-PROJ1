export type WorldContext = {
    activeMaterials: THREE.MeshPhongMaterial[];
    receiveShadows: boolean;
    castShadows: boolean;
};

export namespace Descriptors {
    type Globals = {
        background: Utils.Color;
        ambient: Utils.Color;
    };

    type Fog = {
        color: Utils.Color;
        near: number;
        far: number;
    };

    type Texture = {
        id: string;
        filepath: string;
        isVideo: boolean;
        magFilter: string;
        minFilter: string;
        mipmaps: boolean;
        anisotropy: number;
        mipmap0: string | null;
        mipmap1: string | null;
        mipmap2: string | null;
        mipmap3: string | null;
        mipmap4: string | null;
        mipmap5: string | null;
        mipmap6: string | null;
        mipmap7: string | null;
    };

    type Material = {
        id: string;
        color: Utils.Color;
        specular: Utils.Color;
        emissive: Utils.Color;
        shininess: number;
        wireframe: boolean;
        shading: "none" | "flat" | "smooth";
        textureref: string | null;
        texlength_s: number;
        texlength_t: number;
        twosided: boolean;
        bumpref: string | null;
        bumpscale: number;
        specularref: string | null;
    };

    namespace Cameras {
        type Orthogonal = {
            id: string;
            near: number;
            far: number;
            location: Utils.Vector3;
            target: Utils.Vector3;
            left: number;
            right: number;
            bottom: number;
            top: number;
        };

        type Perspective = {
            id: string;
            angle: number;
            near: number;
            far: number;
            location: Utils.Vector3;
            target: Utils.Vector3;
        };
    }

    namespace Primitives {
        type Cylinder = {
            base: number;
            top: number;
            height: number;
            slices: number;
            stacks: number;
            capsclose: boolean;
            thetastart: number;
            thetalength: number;
            distance: number;
        };

        type Rectangle = {
            xy1: Utils.Vector2;
            xy2: Utils.Vector2;
            parts_x: number;
            parts_y: number;
            distance: number;
        };

        type Triangle = {
            xyz1: Utils.Vector3;
            xyz2: Utils.Vector3;
            xyz3: Utils.Vector3;
            distance: number;
        };

        type Model3D = {
            filepath: string;
            distance: number;
        };

        type Sphere = {
            radius: number;
            slices: number;
            stacks: number;
            thetastart: number;
            thetalength: number;
            phistart: number;
            philength: number;
            distance: number;
        };

        type Box = {
            xyz1: Utils.Vector3;
            xyz2: Utils.Vector3;
            parts_x: number;
            parts_y: number;
            parts_z: number;
            distance: number;
        };

        type NURBS = {
            degree_u: number;
            degree_v: number;
            parts_u: number;
            parts_v: number;
            distance: number;
            controlpoints: Utils.ControlPoint[];
        };

        type Polygon = {
            radius: number;
            stacks: number;
            slices: number;
            color_c: Utils.Color;
            color_p: Utils.Color;
        };
    }

    type Skybox = {
        size: Utils.Vector3;
        center: Utils.Vector3;
        emissive: Utils.Color;
        intensity: number;
        up: string;
        down: string;
        left: string;
        right: string;
        front: string;
        back: string;
    };

    namespace Lights {
        type SpotLight = {
            id: string;
            color: Utils.Color;
            position: Utils.Vector3;
            target: Utils.Vector3;
            angle: number;
            enabled: boolean;
            intensity: number;
            distance: number;
            decay: number;
            penumbra: number;
            castshadow: boolean;
            shadowfar: number;
            shadowmapsize: number;
        };

        type PointLight = {
            id: string;
            color: Utils.Color;
            position: Utils.Vector3;
            enabled: boolean;
            intensity: number;
            distance: number;
            decay: number;
            castshadow: boolean;
            shadowfar: number;
            shadowmapsize: number;
        };

        type DirectionalLight = {
            id: string;
            color: Utils.Color;
            position: Utils.Vector3;
            enabled: boolean;
            intensity: number;
            castshadow: boolean;
            shadowleft: number;
            shadowright: number;
            shadowbottom: number;
            shadowtop: number;
            shadowfar: number;
            shadowmapsize: number;
        };
    }

    namespace Utils {
        type Vector2 = [number, number];
        type Vector3 = [number, number, number];

        type ControlPoint = {
            xx: number;
            yy: number;
            zz: number;
        };

        type Color = THREE.Color & { a: number };
    }
}

export namespace SceneGraph {
    export type Data = {
        activeCameraId: string;
        cameras: Record<string, Camera>;
        customAttributeName: string;
        fog: Fog;
        lods: Record<string, Lod>;
        materials: Record<string, Material>;
        nodes: Record<string, Node>;
        options: Globals;
        rootId: string;
        skyboxes: Record<string, Skybox>;
        textures: Record<string, Texture>;
    };

    type Camera =
        | ({ type: "perspective" } & Descriptors.Cameras.Perspective)
        | ({ type: "orthogonal" } & Descriptors.Cameras.Orthogonal);

    type Fog = { type: "fog" } & Descriptors.Fog;

    type Lod = {
        type: "lod";
        id: string;
        children: LodNodeRef[];
    };

    type LodNodeRef = {
        type: "lodnoderef";
        mindist: number;
        node: CompositeNode;
    };

    type Material = { type: "material" } & Descriptors.Material;

    type Node = Lod | CompositeNode | PrimitiveNode | LightNode;

    type CompositeNode = {
        type: "node";
        id: string;
        castShadows: boolean;
        receiveShadows: boolean;
        materialIds: string[];
        transformations: Transformation[];
        children: Node[];
    };

    type Transformation =
        | { type: "T"; translate: Descriptors.Utils.Vector3 }
        | { type: "R"; rotation: Descriptors.Utils.Vector3 }
        | { type: "S"; scale: Descriptors.Utils.Vector3 };

    type PrimitiveNode = { type: "primitive" } & (
        | {
              subtype: "cylinder";
              representations: [Descriptors.Primitives.Cylinder];
          }
        | {
              subtype: "rectangle";
              representations: [Descriptors.Primitives.Rectangle];
          }
        | {
              subtype: "triangle";
              representations: [Descriptors.Primitives.Triangle];
          }
        | {
              subtype: "model3d";
              representations: [Descriptors.Primitives.Model3D];
          }
        | {
              subtype: "sphere";
              representations: [Descriptors.Primitives.Sphere];
          }
        | { subtype: "box"; representations: [Descriptors.Primitives.Box] }
        | { subtype: "nurbs"; representations: [Descriptors.Primitives.NURBS] }
        | {
              subtype: "polygon";
              representations: [Descriptors.Primitives.Polygon];
          }
    );

    type LightNode =
        | ({ type: "pointlight" } & Descriptors.Lights.PointLight)
        | ({ type: "directionallight" } & Descriptors.Lights.DirectionalLight)
        | ({ type: "spotlight" } & Descriptors.Lights.SpotLight);

    type Globals = { type: "globals" } & Descriptors.Globals;

    type Skybox = {
        type: "skybox";
        id: string;
    } & Descriptors.Skybox;

    type Texture = { type: "texture" } & Descriptors.Texture;
}

export type CustomEventDispatcher = THREE.EventDispatcher<{
    "custom:material:setvisualization": {
        mode: "as-is" | "wireframe" | "fill";
    };
    "custom:light:helpers:setvisible": {
        visible: boolean;
    };
    "custom:light:setvisible": {
        name: string;
        visible: boolean;
    };
}>;

export type ArrayOfLength<
    TLen extends number,
    TObj,
    TAcc extends readonly TObj[] = []
> = TAcc["length"] extends TLen
    ? TAcc
    : ArrayOfLength<TLen, TObj, readonly [...TAcc, TObj]>;
