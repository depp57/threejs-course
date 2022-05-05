varying vec2 vUv;

void main() {
    vec2 center = vec2(0.5);

    float strength = 1.0 - step(0.01, abs(distance(vUv, center) - 0.25));

    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
