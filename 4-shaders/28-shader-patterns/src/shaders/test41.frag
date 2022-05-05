varying vec2 vUv;

#define PI 3.1415926535

void main() {
    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    angle /= 2.0 * PI;
    angle += 0.5;

    float strength = angle;

    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(1.0, vUv);
    vec3 mixedColor = mix(blackColor, uvColor, strength);

    gl_FragColor = vec4(mixedColor, 1.0);
}
