import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import {
  BufferAttribute,
  Clock, Color,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  RawShaderMaterial,
  Scene, ShaderMaterial,
  TextureLoader, Vector2,
  WebGLRenderer
} from 'three';
// @ts-ignore
import testVertShader from './shaders/test3.vert?raw';
// @ts-ignore
import testFragShader from './shaders/test3.frag?raw';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new Scene();

/**
 * Textures
 */
const textureLoader = new TextureLoader();
const flagTexture   = textureLoader.load('/textures/flag-french.jpg');

/**
 * Test mesh
 */
      // Geometry
const geometry = new PlaneGeometry(1, 1, 32, 32);

const count   = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for (let i = 0; i < count; i++) {
  randoms[i] = Math.random();
}

geometry.setAttribute('aRandom', new BufferAttribute(randoms, 1));

// Material
const material = new ShaderMaterial({
  vertexShader: testVertShader,
  fragmentShader: testFragShader,
  uniforms: {
    uFrequency: {value: new Vector2(10, 5)},
    uTime: {value: 0},
    uColor: {value: new Color('orange')},
    uTexture: {value: flagTexture}
  }
});

gui.add(material.uniforms.uFrequency.value, 'x')
  .min(0).max(20).step(.01).name('frequencyX');

gui.add(material.uniforms.uFrequency.value, 'y')
  .min(0).max(20).step(.01).name('frequencyY');

// Mesh
const mesh = new Mesh(geometry, material);
scene.add(mesh);

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
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0.25, -0.25, 1);
scene.add(camera);

// Controls
const controls         = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update material

  // not sure about performance, but at least I'm sure that
  // the number won't overflow. Need to check google :)
  material.uniforms.uTime.value = elapsedTime % (2 * Math.PI);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
