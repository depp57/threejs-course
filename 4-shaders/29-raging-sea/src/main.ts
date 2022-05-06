import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
// @ts-ignore
import waterVertShader from './shaders/water.vert?raw';
// @ts-ignore
import waterFragShader from './shaders/water.frag?raw';
import { Color, DoubleSide, Vector2 } from 'three';

/**
 * Base
 */
// Debug
const gui = new dat.GUI({width: 340});

const debugObject: Record<string, any> = {};

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Water
 */
      // Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

// Color
debugObject.depthColor   = '#186691';
debugObject.surfaceColor = '#9bd8ff';

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertShader,
  fragmentShader: waterFragShader,
  uniforms: {
    uTime: {value: 0},

    uBigWavesElevation: {value: 0.2},
    uBigWavesFrequency: {value: new Vector2(4, 1.5)},
    uBigWavesSpeed: {value: 0.5},

    uSmallWavesElevation: {value: 0.15},
    uSmallWavesFrequency: {value: 3},
    uSmallWavesSpeed: {value: 0.2},
    uSmallIterations: {value: 4},

    uDepthColor: {value: new Color(debugObject.depthColor)},
    uSurfaceColor: {value: new Color(debugObject.surfaceColor)},
    uColorOffset: {value: 0.08},
    uColorMultiplier: {value: 5},
  },
  side: DoubleSide
});

gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value')
  .min(0).max(1).step(.001).name('BigWavesElevation');

gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x')
  .min(0).max(10).step(.001).name('BigWavesFrequencyX');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y')
  .min(0).max(10).step(.001).name('BigWavesFrequencyY');
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value')
  .min(0).max(4).step(.001).name('BigWavesSpeed');

gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value')
  .min(0).max(1).step(0.001).name('SmallWavesElevation');
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value')
  .min(0).max(30).step(0.001).name('SmallWavesFrequency');
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value')
  .min(0).max(1).step(0.001).name('SmallWavesSpeed');
gui.add(waterMaterial.uniforms.uSmallIterations, 'value')
  .min(0).max(7).step(1).name('SmallIterations');

gui.addColor(debugObject, 'depthColor').onChange(
  () => {waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);}
);
gui.addColor(debugObject, 'surfaceColor').onChange(
  () => {waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);}
);

gui.add(waterMaterial.uniforms.uColorOffset, 'value')
  .min(0).max(1).step(.001).name('ColorOffset');
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value')
  .min(0).max(10).step(.001).name('ColorMultiplier');

// Mesh
const water      = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 1);
scene.add(camera);

// Controls
const controls         = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update water
  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
