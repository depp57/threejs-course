import './style.css';
import * as dat from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock, Color, DoubleSide, Mesh,
  MeshBasicMaterial,
  PerspectiveCamera, Points,
  Scene, ShaderMaterial, sRGBEncoding,
  TextureLoader,
  WebGLRenderer
} from 'three';
// @ts-ignore
import firefliesVertShader from './shaders/fireflies.vert?raw';
// @ts-ignore
import firefliesFragShader from './shaders/fireflies.frag?raw';
// @ts-ignore
import portalVertShader from './shaders/portal.vert?raw';
// @ts-ignore
import portalFragShader from './shaders/portal.frag?raw';

/**
 * Base
 */
const debugObject: Record<string, any> = {
  clearColor: '#201919',
  portalColorStart: '#ff0000',
  portalColorEnd: '#0000ff'
};

const gui = new dat.GUI({
  width: 400
});
gui.addColor(debugObject, 'clearColor').onChange(
  () => renderer.setClearColor(debugObject.clearColor)
);
gui.addColor(debugObject, 'portalColorStart').onChange(
  () => portalLightMaterial.uniforms.uColorStart.value.set(debugObject.portalColorStart)
);
gui.addColor(debugObject, 'portalColorEnd').onChange(
  () => portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd)
);

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
const bakedMaterial = new MeshBasicMaterial({map: bakedTexture, side: DoubleSide});

const poleLightMaterial = new MeshBasicMaterial({color: 0xffffe5});

const portalLightMaterial = new ShaderMaterial({
  uniforms: {
    uTime: {value: 0},
    uColorStart: {value: new Color(debugObject.portalColorStart)},
    uColorEnd: {value: new Color(debugObject.portalColorEnd)}
  },
  vertexShader: portalVertShader,
  fragmentShader: portalFragShader,
  side: DoubleSide
});

/**
 * Model
 */
gltfLoader.load(
  'portal3.glb',
  (gltf) => {

    const bakedMesh      = gltf.scene.children.find(child => child.name === 'baked') as Mesh;
    const poleLightAMesh = gltf.scene.children.find(child => child.name === 'poleLightA') as Mesh;
    const poleLightBMesh = gltf.scene.children.find(child => child.name === 'poleLightB') as Mesh;
    const portalLight    = gltf.scene.children.find(child => child.name === 'portalLight') as Mesh;

    bakedMesh.material      = bakedMaterial;
    poleLightAMesh.material = poleLightMaterial;
    poleLightBMesh.material = poleLightMaterial;
    portalLight.material    = portalLightMaterial;

    scene.add(gltf.scene);
  }
);

/**
 * Fireflies
 */
const firefliesGeometry = new BufferGeometry();
const firefliesCount    = 30;
const positionArray     = new Float32Array(firefliesCount * 3);
const scaleArray        = new Float32Array(firefliesCount);

for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3]     = (Math.random() - 0.5) * 4;
  positionArray[i * 3 + 1] = Math.random() * 2;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

  scaleArray[i] = Math.random();
}

firefliesGeometry.setAttribute('position', new BufferAttribute(positionArray, 3));
firefliesGeometry.setAttribute('aScale', new BufferAttribute(scaleArray, 1));

const firefliesMaterial = new ShaderMaterial({
  transparent: true,
  uniforms: {
    uPixelRatio: {value: Math.min(window.devicePixelRatio, 2)},
    uSize: {value: 100},
    uTime: {value: 0}
  },
  vertexShader: firefliesVertShader,
  fragmentShader: firefliesFragShader,
  blending: AdditiveBlending,
  depthWrite: false
});
const fireflies         = new Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);

gui.add(firefliesMaterial.uniforms.uSize, 'value').min(1).max(200).step(1);

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
  firefliesMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();
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

renderer.setClearColor(debugObject.clearColor);

/**
 * Animate
 */
const clock = new Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update materials
  firefliesMaterial.uniforms.uTime.value   = elapsedTime;
  portalLightMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
