
// Vertex shader program
// language=GLSL
export const VSHADER_SOURCE_WIRE_SHADING = `
        //
        //  *** Vertex shader program (GLSL code) for wireframe mesh
        //

        //  a_Position = vertex position in world coordinates
        //  a_Normal = vertex normal vector in world coordinates
        //  a_BaryCoords = vertex barycentric coordinates

        attribute vec3 a_Position;
        attribute vec3 a_Normal;
        attribute vec3 a_BaryCoords;

        //  u_MvMatrix = Modelview matrix
        //  u_MvpMatrix = Modelview-projection matrix
        //  u_NormalMatrix = Inverse transpose of modelview matrix

        uniform mat4 u_MvMatrix;
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_NormalMatrix;

        //  u_FrontColor = material front face color
        //  u_BackColor = material back face color
        //  u_Perspective = Perspective vs orthogonal projection option

        uniform vec4 u_FrontColor;
        uniform vec4 u_BackColor;
        uniform bool u_Perspective;

        //  v_BaryCoords = Vertex barycentric coordinates
        //  v_Color = Vertex color

        varying vec3 v_BaryCoords;
        varying vec4 v_Color;

        void main(void) {

            //  gl_Position = vertex position in clip coordinates
            //  v_BaryCoords = vertex barycentric coordinates

            gl_Position = u_MvpMatrix * vec4(a_Position, 1.0);
            v_BaryCoords = a_BaryCoords;

            //  vPosition = vertex position in eye coordinates
            //  vNormal = vertex normal in eye coordinates

            vec3 vPosition = vec3(u_MvMatrix * vec4(a_Position, 1.0));
            vec3 vNormal = vec3(u_NormalMatrix * vec4(a_Normal, 0.0));

            //  Determine whether the vertex lies on a front or back face, and
            //  choose the line color accordingly

            v_Color = u_FrontColor;
            vec3 viewDirection;
            if (u_Perspective) {
                viewDirection = -vPosition;
            } else {
                viewDirection = vec3(0.0, 0.0, 1.0);
            }
            if (dot(vNormal, viewDirection) <= 0.0) {
                v_Color = u_BackColor;
            }
        }
    `


// Fragment shader program
// language=GLSL
export const FSHADER_SOURCE_WIRE_SHADING = `
        //
        //  ### Fragment shader program for wireframe mesh
        //
        #ifdef GL_ES
        precision mediump float;
        #endif

        //  v_BaryCoords = Interpolated fragment barycentric coordinates
        //  v_Color = Interpolated fragment color

        varying vec3 v_BaryCoords;
        varying vec4 v_Color;

        void main() {

            //  The smallest barycentric coordinate is the minimum relative distance to
            //  an edge (relative to the distance from the opposite vertex to the line
            //  containing the edge)

            if (any(lessThan(v_BaryCoords, vec3(0.02)))) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            } else {
                gl_FragColor = v_Color;
            }
        }
    `;
