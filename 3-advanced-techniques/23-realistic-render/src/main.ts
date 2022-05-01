import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import {
  ACESFilmicToneMapping, CameraHelper,
  CineonToneMapping,
  CubeTextureLoader,
  DirectionalLight, LinearToneMapping,
  Mesh,
  MeshStandardMaterial, NoToneMapping, PCFSoftShadowMap,
  ReinhardToneMapping,
  sRGBEncoding
} from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * Loaders
 */
const gltfLoader        = new GLTFLoader();
const cubeTextureLoader = new CubeTextureLoader();

/**
 * Base
 */
      // Debug
const gui         = new dat.GUI();
const debugObject = {
  envMapIntensity: 4
};

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
      // child.material.envMap          = environmentMap;
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.castShadow               = true;
      child.receiveShadow            = true;
      child.material.needsUpdate     = true;
    }
  });
};

/**
 * Environment map
 */
const environmentMap    = cubeTextureLoader.load([
  'textures/environmentMaps/1/px.jpg',
  'textures/environmentMaps/1/nx.jpg',
  'textures/environmentMaps/1/py.jpg',
  'textures/environmentMaps/1/ny.jpg',
  'textures/environmentMaps/1/pz.jpg',
  'textures/environmentMaps/1/nz.jpg'
]);
environmentMap.encoding = sRGBEncoding;
scene.background        = environmentMap;
scene.environment       = environmentMap;

debugObject.envMapIntensity = 4;
gui.add(debugObject, 'envMapIntensity')
  .min(0).max(10).step(.001)
  .onChange(updateAllMaterials);

/**
 * Models
 */
gltfLoader.load('models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf: GLTF) => {
  const group = gltf.scene;
  group.scale.set(10, 10, 10);
  group.position.set(0, -4, 0);
  group.rotation.y = Math.PI * .5;

  scene.add(group);

  gui.add(group.rotation, 'y')
    .min(-Math.PI).max(Math.PI)
    .step(.001)
    .name('rotation');

  updateAllMaterials();
});


/**
 * Lights
 */
const directionalLight = new DirectionalLight('#ffffff', 3);
directionalLight.position.set(.25, 3, -2.25);
directionalLight.castShadow        = true;
directionalLight.shadow.camera.far = 10;
directionalLight.shadow.mapSize.set(1024, 1024);
scene.add(directionalLight);

// const directionalLightCameraHelper = new CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightCameraHelper);

gui.add(directionalLight, 'intensity').min(0).max(10).step(.001).name('lightIntensity');
gui.add(directionalLight.position, 'x').min(-5).max(5).step(.001).name('lightX');
gui.add(directionalLight.position, 'y').min(-5).max(5).step(.001).name('lightY');
gui.add(directionalLight.position, 'z').min(-5).max(5).step(.001).name('lightZ');

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
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls         = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.outputEncoding          = sRGBEncoding;
renderer.shadowMap.enabled       = true;
renderer.shadowMap.type          = PCFSoftShadowMap;

gui.add(renderer, 'toneMapping', {
  No: NoToneMapping,
  Linear: LinearToneMapping,
  Reinhard: ReinhardToneMapping,
  Cineon: CineonToneMapping,
  ACESFilmic: ACESFilmicToneMapping
}).onChange(updateAllMaterials);

gui.add(renderer, 'toneMappingExposure')
  .min(0).max(10).step(.001);

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
