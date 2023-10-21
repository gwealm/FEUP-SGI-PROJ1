import { MyApp } from './MyApp.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import { MyContents } from './MyContents.js';

import * as THREE from 'three';
import { MyTransformations } from './MyTransformations.js';

const t = (x, y, z) => new THREE.Matrix4().makeTranslation(x, y, z);
// | 'YXZ' | 'ZXY' | 'ZYX' | 'YZX' | 'XZY'
const r = (x, y, z) => new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(x, y, z, 'XYZ'));
const s = (x, y, z) => new THREE.Matrix4().makeScale(x, y, z);

/**
 * @param {THREE.Matrix4} m
 */
function displayMatrix4(m) {
    console.log(m.toArray())
    let str = '';

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; ++j) {
            // Round each element to 2 decimal placs
            str += m.elements[i * 4 + j].toFixed(2).toString().padStart(5, ' ') + '\t';
        }

        str += '\n';
    }
    console.log(str)
}

// [1, 1.41, 0]
const point = new THREE.Vector3(1, 0, 0);

const parentTransformations = [r(0, 0, Math.PI / 4), t(1, 0, 0)]
const childTransformations = [r(0, 0, Math.PI / 2), t(1, 0, 0)]

// point.applyMatrix4(childTransformations[0])
// point.applyMatrix4(childTransformations[1])
// point.applyMatrix4(parentTransformations[0])
// point.applyMatrix4(parentTransformations[1])

const parentMatrix = new THREE.Matrix4();
parentMatrix.premultiply(parentTransformations[0])
parentMatrix.premultiply(parentTransformations[1])

const childMatrix = new THREE.Matrix4()
childMatrix.premultiply(childTransformations[0])
childMatrix.premultiply(childTransformations[1])

const matrix = new THREE.Matrix4()
matrix.multiply(parentMatrix)
matrix.multiply(childMatrix)

// matrix.premultiply(transformations[0])
// matrix.premultiply(transformations[1])
point.applyMatrix4(matrix)
console.log(point)

const root = new MyTransformations();
const parent = root.applyTransformations([
    { type: "R", rotation: [0, 0, 45] },
    { type: "T", translate: [1, 0, 0] },
])

const child = parent.applyTransformations([
    { type: "R", rotation: [0, 0, 90] },
    { type: "T", translate: [1, 0, 0] },
])

const point2 = new THREE.Vector3(1, 0, 0);
point2.applyMatrix4(child.toMatrix4())
console.log(point2)

// create the application object
let app = new MyApp()
// initializes the application
app.init()

// create the contents object
let contents = new MyContents(app)
// initializes the contents
contents.init()
// hooks the contents object in the application object
app.setContents(contents);

// create the gui interface object
let gui = new MyGuiInterface(app)
// set the contents object in the gui interface object
gui.setContents(contents)

// we call the gui interface init 
// after contents were created because
// interface elements may control contents items
gui.init();

// main animation loop - calls every 50-60 ms.
app.render()
