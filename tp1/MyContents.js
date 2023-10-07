import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyNurbsBuilder } from "./MyNurbsBuilder.js";

class MyContents {
    constructor(app) {
        this.app = app;
        this.axis = null;

        const map = new THREE.TextureLoader().load(
            "textures/uv_grid_opengl.jpg"
        );
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;

        this.material = new THREE.MeshLambertMaterial({
            map: map,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9,
        });

        this.builder = new MyNurbsBuilder();
        this.meshes = [];
        this.samplesU = 16;
        this.samplesV = 16;

        this.init();
        this.createNurbsSurfaces();
    }

    init() {
        if (this.axis === null) {
            this.axis = new MyAxis(this);
            this.app.scene.add(this.axis);
        }

        const pointLight = new THREE.PointLight(0xffffff, 1000, 0);
        pointLight.position.set(0, 20, 20);
        this.app.scene.add(pointLight);

        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(
            pointLight,
            sphereSize
        );
        this.app.scene.add(pointLightHelper);

        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight);
    }

    createNurbsSurfaces() {
        if (this.meshes !== null) {
            for (let i = 0; i < this.meshes.length; i++) {
                this.app.scene.remove(this.meshes[i]);
            }
            this.meshes = [];
        }

        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 1;
        let orderV = 1;

        controlPoints = [
            [
                // U = 0
                [-2.0, -2.0, 0.0, 5],
                [-2.0, 2.0, 0.0, 1],
            ],
            [
                // U = 1
                [2.0, -2.0, 0.0, 1],
                [2.0, 2.0, 0.0, 1],
            ],
        ];

        surfaceData = this.builder.build(
            controlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );
        mesh = new THREE.Mesh(surfaceData, this.material);

        mesh.rotation.x = 0;
        mesh.rotation.y = 0;
        mesh.rotation.z = 0;
        mesh.scale.set(1, 1, 1);
        mesh.position.set(-4, 3, 0);

        this.app.scene.add(mesh);
        this.meshes.push(mesh);

        controlPoints = [
            // U = 0

            [
                // V = 0..1;

                [-1.5, -1.5, 0.0, 1],

                [-1.5, 1.5, 0.0, 1],
            ],

            // U = 1

            [
                // V = 0..1

                [0, -1.5, 3.0, 1],

                [0, 1.5, 3.0, 1],
            ],

            // U = 2

            [
                // V = 0..1

                [1.5, -1.5, 0.0, 1],

                [1.5, 1.5, 0.0, 1],
            ],
        ];

        orderU = 2;
        orderV = 1;

        surfaceData = this.builder.build(
            controlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );
        mesh = new THREE.Mesh(surfaceData, this.material);

        mesh.rotation.x = 0;
        mesh.rotation.y = 0;
        mesh.rotation.z = 0;
        mesh.scale.set(1, 1, 1);
        mesh.position.set(4, 3, 0);

        this.app.scene.add(mesh);
        this.meshes.push(mesh);

        surfaceData = this.builder.build(
            controlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );
        mesh = new THREE.Mesh(surfaceData, this.material);

        mesh.rotation.x = 0;
        mesh.rotation.y = 0;
        mesh.rotation.z = 0;
        mesh.scale.set(1, 1, 1);
        mesh.position.set(-4, 3, 0);

        orderU = 2;
        orderV = 3;

        controlPoints = [
            // U = 0
            [
                // V = 0..3;
                [-1.5, -1.5, 0.0, 1],
                [-2.0, -2.0, 2.0, 1],
                [-2.0, 2.0, 2.0, 1],
                [-1.5, 1.5, 0.0, 1],
            ],

            // U = 1
            [
                // V = 0..3
                [0.0, 0.0, 3.0, 1],
                [0.0, -2.0, 3.0, 1],
                [0.0, 2.0, 3.0, 1],
                [0.0, 0.0, 3.0, 1],
            ],

            // U = 2
            [
                // V = 0..3
                [1.5, -1.5, 0.0, 1],
                [2.0, -2.0, 2.0, 1],
                [2.0, 2.0, 2.0, 1],
                [1.5, 1.5, 0.0, 1],
            ],
        ];

        surfaceData = this.builder.build(
            controlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );
        mesh = new THREE.Mesh(surfaceData, this.material);

        mesh.rotation.x = 0;
        mesh.rotation.y = 0;
        mesh.rotation.z = 0;
        mesh.scale.set(1, 1, 1);
        mesh.position.set(-4, -3, 0);

        this.app.scene.add(mesh);
        this.meshes.push(mesh);

        surfaceData = this.builder.build(
            controlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );
        mesh = new THREE.Mesh(surfaceData, this.material);

        mesh.rotation.x = 0;
        mesh.rotation.y = 0;
        mesh.rotation.z = 0;
        mesh.scale.set(1, 1, 1);

        orderU = 3;
        orderV = 2;

        controlPoints = [
            // U = 0
            [
                // V = 0..2;
                [-2.0, -2.0, 1.0, 1],
                [0, -2.0, 0, 1],
                [2.0, -2.0, -1.0, 1],
            ],

            // U = 1
            [
                // V = 0..2
                [-2.0, -1.0, -2.0, 1],
                [0, -1.0, -1.0, 1],
                [2.0, -1.0, 2.0, 1],
            ],

            // U = 2
            [
                // V = 0..2
                [-2.0, 1.0, 5.0, 1],
                [0, 1.0, 1.5, 1],
                [2.0, 1.0, -5.0, 1],
            ],

            // U = 3
            [
                // V = 0..2
                [-2.0, 2.0, -1.0, 1],
                [0, 2.0, 0, 1],
                [2.0, 2.0, 1.0, 1],
            ],
        ];

        surfaceData = this.builder.build(
            controlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );
        mesh = new THREE.Mesh(surfaceData, this.material);

        mesh.rotation.x = 0;
        mesh.rotation.y = 0;
        mesh.rotation.z = 0;
        mesh.scale.set(1, 1, 1);
        mesh.position.set(4, -3, 0);

        this.app.scene.add(mesh);
        this.meshes.push(mesh);
    }

    update() {
        // Your update logic goes here
    }
}

export { MyContents };
