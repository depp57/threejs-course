varying vec2 vUv;

void main() {
    vec2 center = vec2(0.5);

    float strength = step(0.25, distance(vUv, center));

    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
