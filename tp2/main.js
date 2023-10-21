import { MyApp } from './MyApp.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import { MyContents } from './MyContents.js';

import * as THREE from 'three';

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

// [1, 1, 0]
const point = new THREE.Vector3(1, 0, 0);
const transformations = [r(0, 0, Math.PI / 2), t(1, 0, 0)]
const matrix = new THREE.Matrix4()
matrix.premultiply(transformations[0])
matrix.premultiply(transformations[1])
point.applyMatrix4(matrix)
console.log(point)
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
