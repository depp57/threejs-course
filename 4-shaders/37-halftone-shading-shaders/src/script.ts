import {
  Clock,
  Color,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TorusKnotGeometry,
  Uniform,
  Vector2,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import halftoneVertexShader from "./shaders/halftone/vertex.glsl";
import halftoneFragmentShader from "./shaders/halftone/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Scene
const scene = new Scene();

// Loaders
const gltfLoader = new GLTFLoader();

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
const camera = new PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 7;
camera.position.y = 7;
camera.position.z = 7;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const rendererParameters = { clearColor: "" };
rendererParameters.clearColor = "#26132f";

const renderer = new WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setClearColor(rendererParameters.clearColor);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

gui.addColor(rendererParameters, "clearColor").onChange(() => {
  renderer.setClearColor(rendererParameters.clearColor);
});

/**
 * Material
 */
const materialParameters = {
  color: 0xff794d,
  shadowColor: 0x8e19b8,
  lightColor: 0xe5ffe0,
};

const material = new ShaderMaterial({
  vertexShader: halftoneVertexShader,
  fragmentShader: halftoneFragmentShader,
  uniforms: {
    uColor: new Uniform(new Color(materialParameters.color)),
    uResolution: new Uniform(new Vector2(sizes.width, sizes.height)),
    uShadowRepetitions: new Uniform(100),
    uShadowColor: new Uniform(new Color(materialParameters.shadowColor)),
    uLightRepetitions: new Uniform(130),
    uLightColor: new Uniform(new Color(materialParameters.lightColor)),
  },
});

gui.addColor(materialParameters, "color").onChange(() => {
  material.uniforms.uColor.value.set(materialParameters.color);
});
gui.add(material.uniforms.uShadowRepetitions, "value").min(1).max(300).step(1);
gui.addColor(materialParameters, "shadowColor").onChange(() => {
  material.uniforms.uShadowColor.value.set(materialParameters.shadowColor);
});
gui.add(material.uniforms.uLightRepetitions, "value").min(1).max(300).step(1);
gui.addColor(materialParameters, "lightColor").onChange(() => {
  material.uniforms.uLightColor.value.set(materialParameters.lightColor);
});

/**
 * Objects
 */
// Torus knot
const torusKnot = new Mesh(new TorusKnotGeometry(0.6, 0.25, 128, 32), material);
torusKnot.position.x = 3;
scene.add(torusKnot);

// Sphere
const sphere = new Mesh(new SphereGeometry(), material);
sphere.position.x = -3;
scene.add(sphere);

// Suzanne
let suzanne = null;
gltfLoader.load("./suzanne.glb", (gltf) => {
  suzanne = gltf.scene;
  suzanne.traverse((child) => {
    if (child.isMesh) child.material = material;
  });
  scene.add(suzanne);
});

/**
 * Animate
 */
const clock = new Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Rotate objects
  if (suzanne) {
    suzanne.rotation.x = -elapsedTime * 0.1;
    suzanne.rotation.y = elapsedTime * 0.2;
  }

  sphere.rotation.x = -elapsedTime * 0.1;
  sphere.rotation.y = elapsedTime * 0.2;

  torusKnot.rotation.x = -elapsedTime * 0.1;
  torusKnot.rotation.y = elapsedTime * 0.2;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
