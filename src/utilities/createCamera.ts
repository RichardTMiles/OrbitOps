import * as THREE from "three";

/**
 * This function creates the three.js camera
 * @param {number} fov Field of view, def = 45
 * @param {number} near nearest distance of camera render range
 * @param {number} far furthest distance of camera render range
 * @param {object} camPos {x,y,z} of camera position
 * @param {object} camLookAt {x,y,z} where camera's looking at
 * @param {number} aspect Aspect ratio of camera, def = screen aspect
 * @returns the created camera object
 */
export const createCamera = (
    fov = 45,
    near = 0.1,
    far = 100,
    camPos = { x: 0, y: 0, z: 5 },
    camLookAt = { x: 0, y: 0, z: 0 },
    aspect = window.innerWidth / window.innerHeight,
) => {
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(camPos.x, camPos.y, camPos.z)
    camera.lookAt(camLookAt.x, camLookAt.y, camLookAt.z) // this only works when there's no OrbitControls
    camera.updateProjectionMatrix()
    return camera
}
