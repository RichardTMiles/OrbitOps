import * as THREE from "three";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";

/**
 * @param {string} url - Path to equirectandular .hdr
 * @returns {Promise<THREE.Texture>}
 */
export const loadHDRI = (url : string) => {
    return new Promise((resolve) => {
        const hdrEquirect = new RGBELoader().load(url, function () {
            hdrEquirect.mapping = THREE.EquirectangularReflectionMapping
            resolve(hdrEquirect)
        })
    })
}

