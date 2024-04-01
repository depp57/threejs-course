import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import earthVertexShader from "./shaders/earth/vertex.glsl";
import earthFragmentShader from "./shaders/earth/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphere/vertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphere/fragment.glsl";
import {
  BackSide,
  Clock,
  Color,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Spherical,
  SRGBColorSpace,
  TextureLoader,
  Uniform,
  Vector3,
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
const textureLoader = new TextureLoader();

/**
 * Earth
 */
const earthParameters = {
  atmosphereDayColor: 0x00aaff,
  atmosphereNightColor: 0xff6600,
};

gui
  .addColor(earthParameters, "atmosphereDayColor")
  .onChange((color: number) => {
    earthMaterial.uniforms.uAtmosphereDayColor.value.set(color);
    atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(color);
  });
gui
  .addColor(earthParameters, "atmosphereNightColor")
  .onChange((color: number) => {
    earthMaterial.uniforms.uAtmosphereNightColor.value.set(color);
    atmosphereMaterial.uniforms.uAtmosphereNightColor.value.set(color);
  });

// Textures
const earthDayTexture = textureLoader.load("/earth/day.jpg");
earthDayTexture.colorSpace = SRGBColorSpace;
earthDayTexture.anisotropy = 8;
const earthNightTexture = textureLoader.load("/earth/night.jpg");
earthNightTexture.colorSpace = SRGBColorSpace;
earthNightTexture.anisotropy = 8;
const earthSpecularCloudsTexture = textureLoader.load(
  "/earth/specularClouds.jpg",
);
earthSpecularCloudsTexture.anisotropy = 8;

// Mesh
const earthGeometry = new SphereGeometry(2, 64, 64);
const earthMaterial = new ShaderMaterial({
  vertexShader: earthVertexShader,
  fragmentShader: earthFragmentShader,
  uniforms: {
    uDayTexture: new Uniform(earthDayTexture),
    uNightTexture: new Uniform(earthNightTexture),
    uSpecularCloudsTexture: new Uniform(earthSpecularCloudsTexture),
    uSunDirection: new Uniform(new Vector3(0, 0, 1)),
    uAtmosphereDayColor: new Uniform(
      new Color(earthParameters.atmosphereDayColor),
    ),
    uAtmosphereNightColor: new Uniform(
      new Color(earthParameters.atmosphereNightColor),
    ),
  },
});
const earth = new Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Atmosphere
const atmosphereMaterial = new ShaderMaterial({
  vertexShader: atmosphereVertexShader,
  fragmentShader: atmosphereFragmentShader,
  uniforms: {
    uSunDirection: new Uniform(new Vector3(0, 0, 1)),
    uAtmosphereDayColor: new Uniform(
      new Color(earthParameters.atmosphereDayColor),
    ),
    uAtmosphereNightColor: new Uniform(
      new Color(earthParameters.atmosphereNightColor),
    ),
  },
  side: BackSide,
  transparent: true,
});
const atmosphere = new Mesh(earthGeometry, atmosphereMaterial);
atmosphere.scale.set(1.03, 1.03, 1.03);
scene.add(atmosphere);

/**
 * Sun
 */
const sunSpherical = new Spherical(1, Math.PI * 0.5, 0.5);
const sunDirection = new Vector3();

const debugSun = new Mesh(
  new IcosahedronGeometry(0.1, 2),
  new MeshBasicMaterial({ color: "yellow" }),
);
scene.add(debugSun);

const updateSun = () => {
  sunDirection.setFromSpherical(sunSpherical);

  debugSun.position.copy(sunDirection).multiplyScalar(5);
  earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
  atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);
};

updateSun();

gui.add(sunSpherical, "phi").min(0).max(Math.PI).onChange(updateSun);
gui
  .add(sunSpherical, "theta")
  .min(0)
  .max(Math.PI * 2)
  .onChange(updateSun);

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
camera.position.x = 12;
camera.position.y = 5;
camera.position.z = 4;
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.setClearColor("#000011");

/**
 * Animate
 */
const clock = new Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // earth.rotation.y = elapsedTime * 0.1;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
