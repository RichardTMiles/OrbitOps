import {Camera, Scene, WebGLRenderer} from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";

/**
 * This function creates the EffectComposer object for post processing
 * @param {object} renderer The threejs renderer
 * @param {object} scene The threejs scene
 * @param {object} camera The threejs camera
 * @param {function} extraPasses custom function that takes composer as the only parameter, for the consumer to add custom passes
 * @returns The created composer object used for post processing
 */
export const createComposer = (renderer: WebGLRenderer, scene: Scene, camera: Camera, extraPasses: (comp: EffectComposer) => void) => {
    const renderScene = new RenderPass(scene, camera)

    let composer = new EffectComposer(renderer)
    composer.addPass(renderScene)

    // custom passes that the consumer wants to add
    extraPasses(composer)

    return composer
}