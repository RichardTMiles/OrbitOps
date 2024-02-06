import {getDefaultUniforms} from "src/utilities/getDefaultUniforms";
import * as THREE from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";

/**
 * This function contains the boilerplate code to set up the environment for a threejs app;
 * e.g. HTML canvas, resize listener, mouse events listener, requestAnimationFrame
 * Consumer needs to provide the created renderer, camera and (optional) composer to this setup function
 * This has the benefit of bringing the app configurations directly to the consumer, instead of hiding/passing them down one more layer
 * @param {object} app a custom Threejs app instance that needs to call initScene and (optioal) updateScene if animation is needed
 * @param {object} scene Threejs scene instance
 * @param {object} renderer Threejs renderer instance
 * @param {object} camera Threejs camera instance
 * @param {bool} enableAnimation whether the app needs to animate stuff
 * @param {object} uniforms Uniforms object to be used in fragments, u_resolution/u_mouse/u_time got updated here
 * @param {object} composer Threejs EffectComposer instance
 * @returns a custom threejs app instance that has the basic setup ready that can be further acted upon/customized
 */
export const runApp = (app: { initScene: any; updateScene: any; },
                       scene: THREE.Scene, renderer: THREE.WebGLRenderer,
                       camera: THREE.PerspectiveCamera, enableAnimation: boolean = false,
                       uniforms = getDefaultUniforms(),
                       composer: EffectComposer = null) => {
    // Create the HTML container, styles defined in index.html
    const container = document.getElementById("container")
    container.appendChild(renderer.domElement)

    // Register resize listener
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        // update uniforms.u_resolution
        if (uniforms.u_resolution !== undefined) {
            uniforms.u_resolution.value.x = window.innerWidth * window.devicePixelRatio
            uniforms.u_resolution.value.y = window.innerHeight * window.devicePixelRatio
        }
    })

    // Register mouse move/touch listener
    const mouseListener = (e: TouchEvent|MouseEvent) => {
        uniforms.u_mouse.value.x = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
        uniforms.u_mouse.value.y = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY
    }
    if ("ontouchstart" in window) {
        window.addEventListener("touchmove", mouseListener)
    } else {
        window.addEventListener("mousemove", mouseListener)
    }

    // Define your app
    if (app.updateScene === undefined) {
        app.updateScene = (delta: number, elapsed: number) => {
        }
    }
    Object.assign(app, {...app, container})

    // The engine that powers your scene into movement
    const clock = new THREE.Clock()
    const animate = () => {
        if (enableAnimation) {
            requestAnimationFrame(animate)
        }

        const delta = clock.getDelta()
        const elapsed = clock.getElapsedTime()
        uniforms.u_time.value = elapsed

        app.updateScene(delta, elapsed)

        if (composer === null) {
            renderer.render(scene, camera)
        } else {
            composer.render()
        }
    }

    app.initScene()
        .then(() => {
            const veil = document.getElementById("veil")
            veil.style.opacity = '0'
            return true
        })
        .then(animate)
        .then(() => {
            // debugging info
            renderer.info.reset()
            // not sure if reliable enough, numbers change everytime...
            console.log("Renderer info", renderer.info)
        })
        .catch((error: any) => {
            console.log(error);
        });
}
