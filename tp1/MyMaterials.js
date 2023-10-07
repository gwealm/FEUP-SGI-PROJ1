import * as THREE from 'three';
import * as textures from './MyTextures.js';

export const wall = {
    velvet: new THREE.MeshPhongMaterial({
        color: "#494a99",
        specular: "#000000",
        emissive: "#000000",
        map: textures.wall.velvet,
        bumpMap: textures.wall.bump.velvet,
        displacementMap: textures.wall.bump.velvet,
        displacementScale: 0.1,
    }),
};

export const dish = {
    // TODO: Fix naming and colors
    vanilla: new THREE.MeshPhongMaterial({
        color: "#ff0000",
        specular: "#000000",
        emissive: "#000000",
        shininess: 90,
    })
}

export const pillar = {
    // TODO: Fix naming and colors
    vanilla: new THREE.MeshPhongMaterial({
        color: "#ffff77",
        specular: "#000000",
        emissive: "#000000",
        shininess: 90,
    })
};

export const table = {
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
};

export const floor = {
    carpet: new THREE.MeshStandardMaterial({
        color: "#5d7dc2",
        specular: "#000000",
        emissive: "#000000",
        side: THREE.DoubleSide,
        map: textures.floor.carpet,
    }),
}

export const cake = {
    candle: {
        wick: new THREE.MeshPhongMaterial({
            color: "#ffff88",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
            side: THREE.DoubleSide,
        }),
        flame: new THREE.MeshPhongMaterial({
            color: "#ff9900",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
        }),
    },
    base: new THREE.MeshPhongMaterial({
        color: "#ffff",
        specular: "#000000",
        emissive: "#000000",
        shininess: 90,
    }),
};