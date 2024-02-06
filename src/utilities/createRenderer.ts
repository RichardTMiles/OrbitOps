import {WebGLRenderer} from "three";
import * as THREE from "three";

/**
 * This creates the renderer, by default calls renderer's setPixelRatio and setSize methods
 * further reading on color management: See https://www.donmccurdy.com/2020/06/17/color-management-in-threejs/
 * @param {object} rendererProps props fed to WebGlRenderer constructor
 * @param {function} configureRenderer custom function for consumer to tune the renderer, takes renderer as the only parameter
 * @returns created renderer
 */
export const createRenderer = (rendererProps = {}, configureRenderer = (renderer: WebGLRenderer) => { }) => {
    const renderer = new THREE.WebGLRenderer(rendererProps)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    // more configurations to the renderer from the consumer
    configureRenderer(renderer)

    return renderer
}
