varying vec2 vUv;

#define PI 3.1415926535

void main() {
    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    angle /= 2.0 * PI;
    angle += 0.5;

    float strength = sin(angle * 100.0);

    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
