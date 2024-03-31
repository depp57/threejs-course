import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import shadingVertexShader from "./shaders/shading/vertex.glsl";
import shadingFragmentShader from "./shaders/shading/fragment.glsl";
import {
  Clock,
  Color,
  DoubleSide,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TorusKnotGeometry,
  Uniform,
  WebGLRenderer,
} from "three";

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
const renderer = new WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 3
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Material
 */
const materialParameters = {
  color: "#ffffff",
};

const material = new ShaderMaterial({
  vertexShader: shadingVertexShader,
  fragmentShader: shadingFragmentShader,
  uniforms: {
    uColor: new Uniform(new Color(materialParameters.color)),
  },
});

gui.addColor(materialParameters, "color").onChange(() => {
  material.uniforms.uColor.value.set(materialParameters.color);
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
let suzanne: Scene | null = null;
gltfLoader.load("./suzanne.glb", (gltf: { scene: Scene }) => {
  suzanne = gltf.scene;
  suzanne.traverse((child) => {
    if (child.isMesh) child.material = material;
  });
  scene.add(suzanne);
});

/**
 * Light helpers
 */
const directionalLightHelper = new Mesh(
  new PlaneGeometry(),
  new MeshBasicMaterial(),
);
directionalLightHelper.material.color.setRGB(0.1, 0.1, 1);
directionalLightHelper.material.side = DoubleSide;
directionalLightHelper.position.set(0, 0, 3);
scene.add(directionalLightHelper);

const pointLightHelper = new Mesh(
  new IcosahedronGeometry(0.1, 2),
  new MeshBasicMaterial(),
);
pointLightHelper.material.color.setRGB(1, 0.1, 0.1);
pointLightHelper.position.set(0, 2.5, 0);
scene.add(pointLightHelper);

const pointLightHelper2 = new Mesh(
  new IcosahedronGeometry(0.1, 2),
  new MeshBasicMaterial(),
);
pointLightHelper2.material.color.setRGB(0.1, 1.0, 0.5);
pointLightHelper2.position.set(2, 2, 2);
scene.add(pointLightHelper2);

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
