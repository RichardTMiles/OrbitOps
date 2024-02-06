/**
 * Initializes a reasonable uniforms object ready to be used in fragments
 * @returns a uniforms object with u_time, u_mouse and u_resolution
 */
export const getDefaultUniforms = () => {
    return {
        u_time: { value: 0.0 },
        u_mouse: {
            value: {
                x: 0.0,
                y: 0.0
            }
        },
        u_resolution: {
            value: {
                x: window.innerWidth * window.devicePixelRatio,
                y: window.innerHeight * window.devicePixelRatio
            }
        }
    }
}
