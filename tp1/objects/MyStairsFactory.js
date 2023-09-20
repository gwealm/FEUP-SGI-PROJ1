import * as materials from "../MyMaterials.js";

export class MyStairsFactory {
  constructor(variant) {
    this.material = materials.stairs[variant];
  }

    /**
     * displays the stairs
     * TODO: probably should only build the meshes (vertical and horizontal
     * planes) to sepparate concerns
     */
    #buildStair(width, height, thickness, depth, stepOffset) {
        //create the steps geometry
        let stepVertical = new THREE.BoxGeometry(
            width,
            height,
            thickness,
            depth
        );
        let stepHorizontal = new THREE.BoxGeometry(width, thickness, depth);

        let stepVerticalMaterial = this.material;
        let stepHorizontalMaterial = this.material;

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
            this.#buildStair(width, height, thickness, depth, stepOffset);
        }
    }
}
