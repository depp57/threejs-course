import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Color,
    Points,
    PointsMaterial, TextureLoader,
} from 'three';

/**
 * Base
 */
// Debug
const gui = new dat.GUI({width: 400});

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const parameters = {
    count: 100000,
    size: .01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: .2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
    revolutionPerMin: 2
};

gui.add(parameters, 'count', 100, 100000, 100).onFinishChange(generateGalaxy);
gui.add(parameters, 'size', .001, .1, .001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius', .01, 20, .01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches', 2, 20, 1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin', -5, 5, .01).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness', 0, 2, .01).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower', 1, 10, .1).onFinishChange(generateGalaxy);
gui.add(parameters, 'revolutionPerMin', 0, 10, 1);

gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

let geometry: BufferGeometry | null = null;
let material: PointsMaterial | null = null;
let particles: Points | null        = null;

function generateGalaxy(): void {
    if (particles) {
        geometry?.dispose();
        material?.dispose();
        scene.remove(particles);
    }

    material = new PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: AdditiveBlending,
        vertexColors: true
    });

    geometry        = new BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors    = new Float32Array(parameters.count * 3);

    const insideColor  = new Color(parameters.insideColor);
    const outsideColor = new Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        // Position
        const radius      = Math.pow(Math.random(), parameters.randomnessPower) * parameters.radius;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
        const spinAngle   = radius * parameters.spin;

        const randX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

        positions[i3]     = Math.cos(branchAngle + spinAngle) * radius + randX;
        positions[i3 + 1] = randY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randZ;

        // Color
        const mixedColor = insideColor.clone().lerp(outsideColor.clone(), radius / parameters.radius);

        colors[i3]     = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));

    particles = new Points(geometry, material);

    scene.add(particles);
}

generateGalaxy();

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width  = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
      // Base camera
const camera      = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls         = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update galaxy
    if (particles && parameters.revolutionPerMin !== 0) {
        particles.rotation.y = - elapsedTime * Math.PI * 2 / (60 / parameters.revolutionPerMin); // 2 revolutions per minute
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
