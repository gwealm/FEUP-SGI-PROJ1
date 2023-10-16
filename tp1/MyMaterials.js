import * as THREE from "three";
import * as textures from "./MyTextures.js";

export const wall = {
    velvet: new THREE.MeshPhongMaterial({
        color: "#494a99",
        // color: "#ffffff",
        specular: "#000000",
        emissive: "#000000",
        map: textures.wall.velvet,
        bumpMap: textures.wall.bump.velvet,
        // displacementMap: textures.wall.bump.velvet,
        // displacementScale: 0.1,
    }),
};

export const dish = {
    porcelain: new THREE.MeshPhongMaterial({
        color: "#f2f2f2", // Light porcelain color
        specular: "#ffffff", // White specular highlights
        emissive: "#dddddd", // Light gray emissive glow
        shininess: 30, // Adjust shininess for a porcelain look
    }),
};

export const pillar = {
    // TODO: Fix naming and colors
    vanilla: new THREE.MeshPhongMaterial({
        color: "#ffff77",
        specular: "#000000",
        emissive: "#000000",
        shininess: 90,
    }),
};

export const watch = {
    velvet: [
        new THREE.MeshPhongMaterial({
            color: "#000000",
        }),
        new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
            map: textures.watch.velvet,
            side: THREE.DoubleSide,
        }),
        new THREE.MeshPhongMaterial({
            color: "#000000",
        }),
    ],
};

export const frame = {
    inner: {
        gui: new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
            map: textures.frame.inner.guima,
        }),
        lima: new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
            map: textures.frame.inner.guima,
        }),
        canvas: new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
        }),
    },
    outter: {
        black: new THREE.MeshPhongMaterial({
            color: "#000000",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
        }),
        blue: new THREE.MeshStandardMaterial({
            color: "#494a90",
            map: textures.frame.border.blue_wood.diffuse,
            bumpMap: textures.frame.border.blue_wood.bump,
            metalnessMap: textures.frame.border.blue_wood.metalness,
            roughnessMap: textures.frame.border.blue_wood.roughness,
            aoMap: textures.frame.border.blue_wood.ambientOcclusion,
            normalMap: textures.frame.border.blue_wood.normal,
        }),
    },
};

export const table = {
    wood: {
        top: new THREE.MeshStandardMaterial({
            map: textures.box.wood.baseColor,
            aoMap: textures.box.wood.ambientOcclusion,
            normalMap: textures.box.wood.normal,
            roughnessMap: textures.box.wood.roughness,
            color: "#ffffff",
        }),
        leg: new THREE.MeshPhongMaterial({
            color: "#808080",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
        }),
    },
    regular: {
        top: new THREE.MeshPhongMaterial({
            color: "#7f3300",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
        }),
        leg: new THREE.MeshPhongMaterial({
            color: "#808080",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
        }),
    },
};

export const box = {
    wood: new THREE.MeshStandardMaterial({
        map: textures.box.wood.baseColor,
        aoMap: textures.box.wood.ambientOcclusion,
        normalMap: textures.box.wood.normal,
        roughnessMap: textures.box.wood.roughness,
        color: "#ffffff",
    }),
};

export const floor = {
    carpet: new THREE.MeshStandardMaterial({
        color: "#5d7dc2",
        side: THREE.DoubleSide,
        map: textures.floor.carpet,
    }),
};

export const cake = {
    candle: {
        wick: new THREE.MeshPhongMaterial({
            color: "#2a2a2a", // Dark wick color
            specular: "#000000",
            emissive: "#000000",
            shininess: 0, // Reduce shininess for the wick
            side: THREE.DoubleSide,
        }),
        flame: new THREE.MeshPhongMaterial({
            color: "#ff6600", // Warm flame color
            specular: "#ff6600", // Match the flame color for specular highlights
            emissive: "#ff6600", // Match the flame color for emissive glow
            shininess: 10, // Some shininess for the flame
            transparent: true,
            opacity: 0.8, // Make the flame slightly transparent
        }),
    },
    base: new THREE.MeshPhongMaterial({
        color: "#ffffff", // Light brown base color
        specular: "#000000",
        emissive: "#000000",
        shininess: 20, // Adjust shininess for the base
        map: textures.cake.outter,
    }),
    inner: new THREE.MeshPhongMaterial({
        color: "#ffffff", // Light brown base color
        specular: "#000000",
        emissive: "#000000",
        shininess: 20, // Adjust shininess for the base
        map: textures.cake.inner,
    }),
};



export const line = {
    basic: new THREE.LineBasicMaterial({ 
        color: "#5d7dc2" 
    }),
    dashed: new THREE.LineDashedMaterial({ 
        color: 0x00ff00, 
        dashSize: 0.1, 
        gapSize: 0.05 
    }),
};

export const nurb = {
    pot: {
        periodicTable: new THREE.MeshLambertMaterial({
            map: textures.nurb.periodicTable,
            side: THREE.DoubleSide,
            transparent: true, 
            opacity: 0.90 
        }),
        blue: new THREE.MeshStandardMaterial({
            color: "#ffffff",
            map: textures.pot.blue.baseColor,
            aoMap: textures.pot.blue.ambientOcclusion,
            normalMap: textures.pot.blue.normal,
            roughnessMap: textures.pot.blue.roughness,
            side: THREE.DoubleSide,
        }),
    },
    

    newspaper: new THREE.MeshLambertMaterial({
        map: textures.nurb.newspaper,
        side: THREE.DoubleSide,
        // transparent: true, 
        opacity: 0.90 
    })
};

export const window = {
    metal: {
        frame: new THREE.MeshPhongMaterial({
            color: "#7f7f7f",
            // specular: "#afafaf",
            reflectivity: 90,
        }),
        glass: new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#000000",
            map: textures.window.landscape,
        }),
    }
}

export const flower = {
    leaf: new THREE.MeshPhongMaterial({
            map: textures.flower.leaf,
            color: 0x003300, 
            reflectivity: 90,
            side: THREE.DoubleSide,
        }),
    stem: new THREE.MeshBasicMaterial({
      color: "#003300",
      wireframe: false,
    })
}