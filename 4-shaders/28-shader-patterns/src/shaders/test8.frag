varying vec2 vUv;

void main() {
    float strength = round(mod(vUv.y * 10.0, 1.0));
    // or step(0.5, mod...)

    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
