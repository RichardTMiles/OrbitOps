// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
// language=GLSL
export const VSHADER_SOURCE_PHONG_SHADING = `
        //
        //  *** Vertex shader program (GLSL code) for Phong shading
        //
        //  a_Position = vertex position in world coordinates
        //  a_Normal = vertex normal vector in world coordinates
        // 
        //  u_MvMatrix = Modelview matrix
        //  u_MvpMatrix = Modelview-projection matrix
        //  u_NormalMatrix = Inverse transpose of modelview matrix

        attribute vec3 a_Position;
        attribute vec3 a_Normal;

        uniform mat4 u_MvMatrix;
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_NormalMatrix;

        varying vec3 v_Position;
        varying vec3 v_Normal;

        void main(void) {

            //  gl_Position = vertex position in clip coordinates
            //  v_Position = vertex position in eye coordinates
            //  v_Normal = vertex normal vector in eye coordinates

            gl_Position = u_MvpMatrix * vec4(a_Position, 1.0);
            vec4 vPosition = u_MvMatrix * vec4(a_Position, 1.0);
            v_Position = vec3(vPosition);
            v_Normal = vec3(u_NormalMatrix * vec4(a_Normal, 0.0));
        }
    `;

// Fragment shader program
// language=GLSL
export const FSHADER_SOURCE_PHONG_SHADING = `
        //
        //  ### Fragment shader program for Phong shading
        //
        #ifdef GL_ES
        precision mediump float;
        #endif

        //  u_FrontColor = material front face color
        //  u_BackColor = material back face color
        //  u_AmbientLight = Color of ambient light
        //  u_LightDirection = Direction to point source in eye coordinates
        //  u_LightColor = Color of point light source
        //  u_Perspective = Perspective vs orthogonal projection option
        //  u_Shininess = Exponent in specular reflection term 

        uniform vec4 u_FrontColor;
        uniform vec4 u_BackColor;
        uniform vec3 u_AmbientLight;
        uniform vec3 u_LightDirection;
        uniform vec3 u_LightColor;
        uniform bool u_Perspective;
        uniform float u_Shininess;

        //  v_Position = interpolated fragment position in eye coordinates
        //  v_Normal = interpolated normal vector in eye coordinates

        varying vec3 v_Position;
        varying vec3 v_Normal;

        void main() {

            //  Determine whether the fragment lies on a front or back face, and
            //  choose the material color accordingly

            vec3 normal = normalize(v_Normal);
            vec4 matColor = u_FrontColor;
            vec3 viewDirection;
            if (u_Perspective) {
                viewDirection = normalize(-v_Position);
            } else {
                viewDirection = vec3(0.0, 0.0, 1.0);
            }
            if (dot(normal, viewDirection) <= 0.0) {
                matColor = u_BackColor;
                normal = -normal;
            }

            //  Compute fragment color from Phong's illumination model

            vec3 ambient = u_AmbientLight * matColor.rgb;
            float nDotL = max(dot(u_LightDirection, normal), 0.0);
            float specular = 0.0;
            if (nDotL > 0.0) {
                vec3 reflectDirection = reflect(-u_LightDirection, normal);
                float eDotR = max(dot(reflectDirection, viewDirection), 0.0);
                specular = pow(eDotR, u_Shininess);
            }
            vec3 diffuse = matColor.rgb * nDotL;
            gl_FragColor = vec4(diffuse + ambient + specular * u_LightColor,
            matColor.a);
        }
    `;
