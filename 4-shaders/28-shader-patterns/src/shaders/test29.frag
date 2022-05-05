varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 center = vec2(0.5);
    vec2 lightUv = vec2(
        vUv.x * 0.1 + 0.45,
        vUv.y
    );

    float strength = 0.015 / distance(lightUv, center);

    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
