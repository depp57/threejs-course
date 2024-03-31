uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/pointLight.glsl

void main() {
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);

    // Base color
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = smoothstep(0.0, 1.0, mixStrength);
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    // Light
    vec3 light = vec3(0.0);

    light += pointLight(
        vec3(1.0),              // color
        10.0,                   // intensity
        normal,                 // normal
        vec3(0.0, 0.25, 0.0),   // light position
        viewDirection,          // view direction
        30.0,                   // specular
        vPosition,              // object position
        0.95                    // decay
    );

    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
    #include <tonemapping_fragment>
}