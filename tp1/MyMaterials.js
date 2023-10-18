import * as THREE from "three";
import { textures } from "./MyTextures.js";

export const materials = {
    debug: {
        uvGrid: {
            map: textures.debug.uvGrid,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9,
            color: "#ffffff",
        }
    },
    line: {
        solidBlue: new THREE.LineBasicMaterial({ 
            color: "#5d7dc2" 
        }),
        greenDashed: new THREE.LineDashedMaterial({ 
            dashSize: 0.1, 
            gapSize: 0.05,
            color: "#00ff00", 
        }),
    },
    basic: {
        textured: {
            wood: new THREE.MeshStandardMaterial({
                map: textures.basic.wood,
                color: "#ffffff",
            }),
            porcelain: new THREE.MeshStandardMaterial({
                ...textures.basic.porcelain,
                side: THREE.DoubleSide,
                color: "#ffffff",
            }),
        },
        white: new THREE.MeshPhongMaterial({
            color: "#ffffff",
        }),
        porcelain: new THREE.MeshPhongMaterial({
            color: "#f2f2f2",
            specular: "#ffffff",
            shininess: 30,
        }),
        metal: new THREE.MeshPhongMaterial({
            color: "#7f7f7f",
            specular: "#afafaf",
            reflectivity: 90,
        }),
    },
    room: {
        velvet: new THREE.MeshStandardMaterial({
            ...textures.room.velvet,
            color: "#494a99",
        }),
        carpet: new THREE.MeshStandardMaterial({
            map: textures.room.carpet,
            color: "#5d7dc2",
        }),
    },
    clock: [
        new THREE.MeshPhongMaterial({
            color: "#000000",
        }),
        new THREE.MeshPhongMaterial({
            map: textures.clock,
            side: THREE.DoubleSide,
            color: "#ffffff",
        }),
        new THREE.MeshPhongMaterial({
            color: "#000000",
        }),
    ],
    guima: new THREE.MeshPhongMaterial({
        map: textures.guima,
        color: "#ffffff",
    }),
    box: new THREE.MeshStandardMaterial({
        ...textures.box,
        color: "#ffffff",
    }),
    newspaper: {
        firstPage: new THREE.MeshLambertMaterial({
            map: textures.newspaper.firstPage,
            side: THREE.DoubleSide,
        }),
        secondPage: new THREE.MeshLambertMaterial({
            map: textures.newspaper.secondPage,
            side: THREE.DoubleSide,
        }),
    },
    cake: {
        candle: {
            wick: new THREE.MeshPhongMaterial({
                side: THREE.DoubleSide,
                color: "#2a2a2a",
            }),
            flame: new THREE.MeshPhongMaterial({
                color: "#ff6600",
                specular: "#ff6600",
                emissive: "#ff6600",
                shininess: 10,
                transparent: true,
                opacity: 0.5,
            }),
        },
        base: new THREE.MeshPhongMaterial({
            map: textures.cake.outside,
            color: "#ffffff",
        }),
    },
    door: new THREE.MeshPhongMaterial({
        map: textures.door,
        color: "#ffffff",
    }),
    window: {
        landscape: new THREE.MeshPhongMaterial({
            map: textures.window.landscape,
            color: "#ffffff",
        }),
    },
    flower: {
        petal: new THREE.MeshPhongMaterial({
            color: "#ffd700"
        }),
        center: {
            front: new THREE.MeshPhongMaterial({
                color: "#8b4513"
            }),
            back: new THREE.MeshPhongMaterial({
                color: "#003300"
            }),
        },
        leaf: new THREE.MeshPhongMaterial({
            map: textures.flower.leaf,
            reflectivity: 90,
            side: THREE.DoubleSide,
            color: "#003300", 
        }),
        stem: new THREE.MeshBasicMaterial({
            map: textures.flower.leaf,
            color: "#003300",
        }),
    },
};
