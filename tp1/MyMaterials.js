import * as THREE from 'three';
import * as textures from './MyTextures.js';

export const wall = {
    velvet: new THREE.MeshPhongMaterial({
        color: "#494a99",
        specular: "#000000",
        emissive: "#000000",
        side: THREE.DoubleSide,
        map: textures.wall.velvet,
        bumpMap: textures.wall.bump.velvet,
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
    velvetFabric: new THREE.MeshStandardMaterial({
        map: textures.table.fabric.baseColor,
        aoMap: textures.table.fabric.ambientOcclusion,
        displacementMap: textures.table.fabric.height,
        displacementScale: 0.1,
        normalMap: textures.table.fabric.normal,
        roughnessMap: textures.table.fabric.roughness,
        color: "#ffffff",
        specular: "#000000",
        emissive: "#000000",
        shininess: 30
    })
};

export const floor = {
    carpet: new THREE.MeshPhongMaterial({
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
            color: "#ffffff",
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
        color: "#ff99ff",
        specular: "#000000",
        emissive: "#000000",
        shininess: 90,
    }),
};