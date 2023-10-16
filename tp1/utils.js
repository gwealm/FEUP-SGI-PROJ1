/**
 * @template {THREE.Object3D} T
 * @param {T} obj 
 * @returns {T}
 */
export function trueClone(obj) {
    return Object.assign(
        obj.clone(),
        Object.fromEntries(
            Object.entries(obj)
                .filter(([key]) => key.startsWith("__"))
        )
    );
}