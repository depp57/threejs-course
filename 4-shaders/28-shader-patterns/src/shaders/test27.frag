varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 center = vec2(0.5);
    float strength = 1.0 - distance(vUv, center);

    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
