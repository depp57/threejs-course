varying vec2 vUv;

#define PI 3.1415926535

void main() {
    vec2 center = vec2(0.5);

    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    angle /= PI * 2.0;
    angle += 0.5;
    float sinusoid = sin(angle * 100.0);

    float radius = 0.25 + sinusoid * 0.02;
    float strength = 1.0 - step(0.01, abs(distance(vUv, center) - radius));

    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
