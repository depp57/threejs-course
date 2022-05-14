import './style.css';
import * as dat from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import {
  Clock,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene, sRGBEncoding,
  TextureLoader,
  WebGLRenderer
} from 'three';

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
  width: 400
});

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new Scene();

/**
 * Loaders
 */
      // Texture loader
const textureLoader = new TextureLoader();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Textures
 */
const bakedTexture    = textureLoader.load('baked.jpg');
bakedTexture.flipY    = false;
bakedTexture.encoding = sRGBEncoding;

/**
 * Materials
 */
const bakedMaterial = new MeshBasicMaterial({map: bakedTexture});

const poleLightMaterial = new MeshBasicMaterial({color: 0xffffe5});

const portalLightMaterial = new MeshBasicMaterial({color: 0xffffff});

/**
 * Model
 */
gltfLoader.load(
  'portal3.glb',
  (gltf) => {

    const bakedMesh      = gltf.scene.children.find(child => child.name === 'baked');
    const poleLightAMesh = gltf.scene.children.find(child => child.name === 'poleLightA');
    const poleLightBMesh = gltf.scene.children.find(child => child.name === 'poleLightB');
    const portalLight    = gltf.scene.children.find(child => child.name === 'portalLight');

    bakedMesh.material      = bakedMaterial;
    poleLightAMesh.material = poleLightMaterial;
    poleLightBMesh.material = poleLightMaterial;
    portalLight.material    = portalLightMaterial;

    scene.add(gltf.scene);
  }
);

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
const camera      = new PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls         = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = sRGBEncoding;

/**
 * Animate
 */
const clock = new Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
