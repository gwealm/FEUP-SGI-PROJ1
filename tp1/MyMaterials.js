import * as THREE from 'three';

export const wall = {
    // TODO: Fix naming and colors
    white: new THREE.MeshPhongMaterial({
        color: "#ffffff",
        specular: "#000000",
        emissive: "#000000",
        shininess: 90,
        side: THREE.DoubleSide,
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

export const cake = {
    candle: {
        wick: new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
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