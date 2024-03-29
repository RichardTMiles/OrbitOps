import * as THREE from "three";
import {maintainBgAspect} from "src/utilities/maintainBgAspect";
import {Scene} from "three";

/**
 * @param {object} scene the Three.js scene object
 * @param {object} image the path to the background image
 * @returns a Promise that resolves after the texture is loaded as the scene's background
 */
export const loadSceneBackground = (scene: Scene, image: string) => {
    return new Promise<void>((resolve, reject) => {
        var loader = new THREE.TextureLoader();
        loader.load(image, function (texture) {
            scene.background = texture
            // position scene background such that image aspect ratio is preserved
            maintainBgAspect(scene, texture.image.width, texture.image.height)
            // need to maintain background aspect ratio across window resizes
            window.addEventListener("resize", () => {
                maintainBgAspect(scene, texture.image.width, texture.image.height)
            })
            resolve()
        }, undefined, function (error) {
            console.log(error)
            reject(error)
        });
    })
}
