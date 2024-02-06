

// Vertex shader program
// language=GLSL
export const VSHADER_SOURCE_FLAT_SHADING = `
        //
        //  *** Vertex shader program (GLSL code) for flat (faceted) shading
        //
        //  This shader is identical to "shader-vsG".


        //  a_Position = vertex position in world coordinates
        //  a_Normal = vertex normal vector in world coordinates

        attribute vec3 a_Position;
        attribute vec3 a_Normal;

        //  u_MvMatrix = Modelview matrix
        //  u_MvpMatrix = Modelview-projection matrix
        //  u_NormalMatrix = Inverse transpose of modelview matrix

        uniform mat4 u_MvMatrix;
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_NormalMatrix;

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

        //  v_Color = Vertex color from illumination model

        varying vec4 v_Color;

        void main(void) {

            //  gl_Position = vertex position in clip coordinates

            gl_Position = u_MvpMatrix * vec4(a_Position, 1.0);

            //  vPosition = vertex position in eye coordinates
            //  vNormal = vertex normal in eye coordinates

            vec3 vPosition = vec3(u_MvMatrix * vec4(a_Position, 1.0));
            vec3 vNormal = vec3(u_NormalMatrix * vec4(a_Normal, 0.0));

            //  Determine whether the vertex lies on a front or back face, and
            //  choose the material color accordingly

            vec3 normal = normalize(vNormal);
            vec4 matColor = u_FrontColor;
            vec3 viewDirection;
            if (u_Perspective) {
                viewDirection = normalize(-vPosition);
            } else {
                viewDirection = vec3(0.0, 0.0, 1.0);
            }
            if (dot(normal, viewDirection) <= 0.0) {
                matColor = u_BackColor;
                normal = -normal;
            }

            //  Compute vertex color from Phong's illumination model

            vec3 ambient = u_AmbientLight * matColor.rgb;
            float nDotL = max(dot(u_LightDirection, normal), 0.0);
            float specular = 0.0;
            if (nDotL > 0.0) {
                vec3 reflectDirection = reflect(-u_LightDirection, normal);
                float eDotR = max(dot(reflectDirection, viewDirection), 0.0);
                specular = pow(eDotR, u_Shininess);
            }
            vec3 diffuse = matColor.rgb * nDotL;
            v_Color = vec4(diffuse + ambient + specular * u_LightColor,
            matColor.a);
        }
    `;

// Fragment shader program
// language=GLSL
export const FSHADER_SOURCE_FLAT_SHADING = `
        //
        //  ### Fragment shader program for flat shading
        //
        //  This shader is identical to "shader-fsG".

        #ifdef GL_ES
        precision mediump float;
        #endif

        //  v_Color = Interpolated fragment color

        varying vec4 v_Color;

        void main() {
            gl_FragColor = v_Color;
        }
    `;

