import * as THREE from "three";
import * as textures from "./MyTextures.js";

export const wall = {
    velvet: new THREE.MeshPhongMaterial({
        color: "#494a99",
        specular: "#000000",
        emissive: "#000000",
        map: textures.wall.velvet,
        bumpMap: textures.wall.bump.velvet,
        displacementMap: textures.wall.bump.velvet,
        displacementScale: 0.1,
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
            map: textures.frame.guima,
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
            metalness: 0.5,
            
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
        color: "#ffffff",
        specular: "#000000",
        emissive: "#000000",
        shininess: 90,
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
    periodicTable: new THREE.MeshLambertMaterial({
        map: textures.nurb.periodicTable,
        side: THREE.DoubleSide,
        transparent: true, 
        opacity: 0.90 
    }),
    newspaper: new THREE.MeshLambertMaterial({
        map: textures.nurb.newspaper,
        side: THREE.DoubleSide,
        // transparent: true, 
        opacity: 0.90 
    })
}
