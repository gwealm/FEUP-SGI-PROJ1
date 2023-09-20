import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";

/**
 *  This class contains the contents of out application
 */
class MyContents {
    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app;

        // axis related attributes
        this.axis = null;
        this.displayAxis = true;

        // box related attributes
        this.boxMesh = null;
        this.boxMeshSize = 1.0;
        this.boxEnabled = true;
        this.lastBoxEnabled = null;
        this.boxDisplacement = new THREE.Vector3(0, 2, 0);

        // plane related attributes
        this.diffusePlaneColor = "#00ffff";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 30;
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffusePlaneColor,
            specular: this.diffusePlaneColor,
            emissive: "#000000",
            shininess: this.planeShininess,
        });
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {
        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
        });

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(
            this.boxMeshSize,
            this.boxMeshSize,
            this.boxMeshSize
        );
        this.boxMesh = new THREE.Mesh(box, boxMaterial);

        // this.boxMesh.position.z = this.boxDisplacement.z;
        // this.boxMesh.position.y = this.boxDisplacement.y;
        this.boxMesh.position.set(this.boxDisplacement);
        this.boxMesh.scale.set(1, 1, 2);
    }

    /**
     * displays the cylinder
     * TODO: probably should only build the mesh to sepparate concerns
     */
    buildCylinder(color, initialDisplacement, scale) {
        let cylinderMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
            clippingPlanes: this.planeMesh,
        });

        // Create a Cube Mesh with basic material
        let cylinder = new THREE.CylinderGeometry(5, 5, 20, 32);
        let cylinderMesh = new THREE.Mesh(cylinder, cylinderMaterial);

        // Sets cylinder initial position
        cylinderMesh.position.set(
            initialDisplacement.x,
            initialDisplacement.y,
            initialDisplacement.z
        );

        // Sets cylinder scale
        cylinderMesh.scale.set(scale.x, scale.y, scale.z);

        this.app.scene.add(cylinderMesh);
    }

    /**
     * displays the stairs
     * TODO: probably should only build the meshes (vertical and horizontal
     * planes) to sepparate concerns
     */
    buildStair(width, height, thickness, depth, stepOffset) {
        //create the steps geometry
        let stepVertical = new THREE.BoxGeometry(
            width,
            height,
            thickness,
            depth
        );
        let stepHorizontal = new THREE.BoxGeometry(width, thickness, depth);

        let stepVerticalMaterial = new THREE.MeshPhongMaterial({
            color: 0x306b7e,
            side: THREE.DoubleSide,
        });
        let stepHorizontalMaterial = new THREE.MeshPhongMaterial({
            color: 0xfcc544,
            side: THREE.DoubleSide,
        });

        //create the mesh. The actual step. Created by putting together the shape and the material
        let stepVerticalMesh = new THREE.Mesh(
            stepVertical,
            stepVerticalMaterial
        );

        // Step Position
        stepVerticalMesh.position.x = 0;
        stepVerticalMesh.position.y = stepOffset * height - thickness;
        stepVerticalMesh.position.z = -depth * stepOffset + thickness;

        //add the step mesh to the scene
        this.app.scene.add(stepVerticalMesh);

        //it can be added to the previous mesh
        let stepHorizontalMesh = new THREE.Mesh(
            stepHorizontal,
            stepHorizontalMaterial
        );

        let stepHalfTickness = thickness / 2;

        stepHorizontalMesh.position.x = 0;
        stepHorizontalMesh.position.y = height * stepOffset + thickness;
        stepHorizontalMesh.position.z = -depth * stepOffset;

        this.app.scene.add(stepHorizontalMesh);
    }

    /**
     * loop for building a staircase
     */
    buildStairCase(width, height, thickness, stepNum, depth) {
        //change the number of step ups to change the steps
        for (var step = 0; step < stepNum; step++) {
            let stepOffset = step;
            this.buildStair(width, height, thickness, depth, stepOffset);
        }
    }

    /**
     * initializes the contents
     */
    init() {
        // create once
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this);
            this.app.scene.add(this.axis);
        }

        // add a point light on top of the model
        const pointLight = new THREE.PointLight(0xffffff, 500, 0);
        pointLight.position.set(0, 20, 0);
        this.app.scene.add(pointLight);

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(
            pointLight,
            sphereSize
        );
        this.app.scene.add(pointLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight);

        this.buildBox();

        // Create a Plane Mesh with basic material

        let plane = new THREE.PlaneGeometry(10, 10);
        this.planeMesh = new THREE.Mesh(plane, this.planeMaterial);
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.app.scene.add(this.planeMesh);

        // TODO: **Hard** check this stairs, because changing values breaks stuff
        let stepWidth = 7;
        let verticalStepHeight = 3;
        let stepThickness = 1;
        let horizontalStepDepth = 3;

        this.buildStairCase(
            stepWidth,
            verticalStepHeight,
            stepThickness,
            3,
            horizontalStepDepth
        );

        let cylinderPos = new THREE.Vector3(3, 0, 3);
        let cylinderScale = new THREE.Vector3(0.1, 0.5, 0.1);

        this.buildCylinder(0x555555, cylinderPos, cylinderScale);
    }

    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value;
        this.planeMaterial.color.set(this.diffusePlaneColor);
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value;
        this.planeMaterial.specular.set(this.specularPlaneColor);
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value
     */
    updatePlaneShininess(value) {
        this.planeShininess = value;
        this.planeMaterial.shininess = this.planeShininess;
    }

    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {
            this.app.scene.remove(this.boxMesh);
        }
        this.buildBox();
        this.lastBoxEnabled = null;
    }

    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled;
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh);
            } else {
                this.app.scene.remove(this.boxMesh);
            }
        }
    }

    /**
     * updates the axis if required
     * this method is called from the render method of the app
     * updates are trigered by displayAxis property changes
     */
    updateAxisIfRequired() {
        if (!this.displayAxis && this.axis != null)
            this.app.scene.remove(this.axis);
        else if (this.displayAxis) this.app.scene.add(this.axis);
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     *
     */
    update() {
        this.updateAxisIfRequired();

        // check if box mesh needs to be updated
        this.updateBoxIfRequired();

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x;
        this.boxMesh.position.y = this.boxDisplacement.y;
        this.boxMesh.position.z = this.boxDisplacement.z;
    }
}

export { MyContents };
