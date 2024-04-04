import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import GUI from "lil-gui";
import {
  ACESFilmicToneMapping,
  Clock,
  Color,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Mesh,
  MeshDepthMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  RGBADepthPacking,
  Scene,
  Uniform,
  WebGLRenderer,
} from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import wobbleVertexShader from "./shaders/wobble/vertex.glsl";
import wobbleFragmentShader from "./shaders/wobble/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 325 });
const debugObject = {
  colorA: 0x0000ff,
  colorB: 0xff0000,
};

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Scene
const scene = new Scene();

// Loaders
const rgbeLoader = new RGBELoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Environment map
 */
rgbeLoader.load("./urban_alley_01_1k.hdr", (environmentMap) => {
  environmentMap.mapping = EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

/**
 * Wobble
 */
const uniforms = {
  uTime: new Uniform(0),

  uPositionFrequency: new Uniform(0.5),
  uTimeFrequency: new Uniform(0.4),
  uStrength: new Uniform(0.3),

  uWarpPositionFrequency: new Uniform(0.38),
  uWarpTimeFrequency: new Uniform(0.12),
  uWarpStrength: new Uniform(1.7),

  uColorA: new Uniform(new Color(debugObject.colorA)),
  uColorB: new Uniform(new Color(debugObject.colorB)),
};

// Material
const material = new CustomShaderMaterial({
  // CustomShaderMaterial
  baseMaterial: MeshPhysicalMaterial,
  vertexShader: wobbleVertexShader,
  fragmentShader: wobbleFragmentShader,
  uniforms,
  silent: true,

  // MeshPhysicalMaterial
  metalness: 0,
  roughness: 0.5,
  color: "#ffffff",
  transmission: 0,
  ior: 1.5,
  thickness: 1.5,
  transparent: true,
  wireframe: false,
});

const depthMaterial = new CustomShaderMaterial({
  // CustomShaderMaterial
  baseMaterial: MeshDepthMaterial,
  vertexShader: wobbleVertexShader,
  uniforms,
  silent: true,

  // MeshDepthMaterial
  depthPacking: RGBADepthPacking,
});

// Tweaks
gui
  .add(uniforms.uPositionFrequency, "value", 0, 2, 0.01)
  .name("uPositionFrequency");
gui.add(uniforms.uTimeFrequency, "value", 0, 2, 0.01).name("uTimeFrequency");
gui.add(uniforms.uStrength, "value", 0, 2, 0.01).name("uStrength");

gui
  .add(uniforms.uWarpPositionFrequency, "value", 0, 2, 0.01)
  .name("uWarpPositionFrequency");
gui
  .add(uniforms.uWarpTimeFrequency, "value", 0, 2, 0.01)
  .name("uWarpTimeFrequency");
gui.add(uniforms.uWarpStrength, "value", 0, 2, 0.01).name("uWarpStrength");

gui.addColor(debugObject, "colorA").onChange(() => {
  uniforms.uColorA.value.set(debugObject.colorA);
});
gui.addColor(debugObject, "colorB").onChange(() => {
  uniforms.uColorB.value.set(debugObject.colorB);
});

gui.add(material, "metalness", 0, 1, 0.001);
gui.add(material, "roughness", 0, 1, 0.001);
gui.add(material, "transmission", 0, 1, 0.001);
gui.add(material, "ior", 0, 10, 0.001);
gui.add(material, "thickness", 0, 10, 0.001);
gui.addColor(material, "color");

// Geometry
// let geometry: BufferGeometry = new IcosahedronGeometry(2.5, 50);
// geometry = mergeVertices(geometry);
// geometry.computeTangents();
//
// // Mesh
// const wobble = new Mesh(geometry, material);
// wobble.customDepthMaterial = depthMaterial;
// wobble.receiveShadow = true;
// wobble.castShadow = true;
// scene.add(wobble);

// Model
gltfLoader.load("./suzanne.glb", (gltf) => {
  const model = gltf.scene.children[0] as Mesh;
  model.material = material;
  model.customDepthMaterial = depthMaterial;
  model.receiveShadow = true;
  model.castShadow = true;
  scene.add(model);
});

/**
 * Plane
 */
const plane = new Mesh(
  new PlaneGeometry(15, 15, 15),
  new MeshStandardMaterial(),
);
plane.receiveShadow = true;
plane.rotation.y = Math.PI;
plane.position.y = -5;
plane.position.z = 5;
scene.add(plane);

/**
 * Lights
 */
const directionalLight = new DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 2, -2.25);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.set(13, -3, -5);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Animate
 */
const clock = new Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update uniforms
  uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
