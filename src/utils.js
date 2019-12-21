import * as Three from "../vendor/threejs/build/three.module.js";

export function random_sign() {
    return Math.round(Math.random()) ? 1 : -1;
}

export function randomVector(low, high) {
    let vector = new Three.Vector3();

    do {
        vector.x = Math.random() * high;
        vector.y = Math.random() * high;
        vector.z = Math.random() * high;
    } while(vector.x < low && vector.y < low && vector.z < low);

    vector.x *= random_sign();
    vector.y *= random_sign();
    vector.z *= random_sign();
    return vector;
}

export function within(val, base, variation) {
    if (val > base + variation) {
        return base + variation;
    } else if (val < base - variation) {
        return base - variation;
    }

    return val;
}

Object.isObject = function(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
};

export function merge(base, other) {
    if(Object.isObject(base) && Object.isObject(other)) {
        for(const [key, val] of Object.entries(other)) {
            if(base[key] !== undefined) {
                base[key] = merge(base[key], val);
            } else {
                base[key] = val;
            }
        }

        return base;
    } else {
        return other;
    }
}
