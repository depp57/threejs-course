import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Spherical,
  Texture,
  TextureLoader,
  Uniform,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import vertexShader from "./shaders/firework/vertex.glsl";
import fragmentShader from "./shaders/firework/fragment.glsl";
import gsap from "gsap";
import { Sky } from "three/examples/jsm/objects/Sky";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Scene
const scene = new Scene();

// Loaders
const textureLoader = new TextureLoader();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: new Vector2(
    window.innerWidth * Math.min(window.devicePixelRatio, 2),
    window.innerHeight * Math.min(window.devicePixelRatio, 2),
  ),
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.resolution.set(
    window.innerWidth * Math.min(window.devicePixelRatio, 2),
    window.innerHeight * Math.min(window.devicePixelRatio, 2),
  );
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
camera.position.set(1.5, 0, 6);
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

/**
 * Fireworks
 */
const textures = [
  textureLoader.load("./particles/1.png"),
  textureLoader.load("./particles/2.png"),
  textureLoader.load("./particles/3.png"),
  textureLoader.load("./particles/4.png"),
  textureLoader.load("./particles/5.png"),
  textureLoader.load("./particles/6.png"),
  textureLoader.load("./particles/7.png"),
  textureLoader.load("./particles/8.png"),
];

const createFirework = (
  count: number,
  centerPosition: Vector3,
  size: number,
  texture: Texture,
  radius: number,
  color: Color,
) => {
  // Geometry
  const positionsArray = new Float32Array(count * 3);
  const sizesArray = new Float32Array(count);
  const timeMultipliersArray = new Float32Array(count);

  const spherical = new Spherical();
  const currentParticlePosition = new Vector3();

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    spherical.set(
      radius * 0.8 + Math.random() * radius * 0.2,
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2,
    );

    currentParticlePosition.setFromSpherical(spherical);

    positionsArray[i3] = currentParticlePosition.x;
    positionsArray[i3 + 1] = currentParticlePosition.y;
    positionsArray[i3 + 2] = currentParticlePosition.z - 3;

    sizesArray[i] = Math.random();
    timeMultipliersArray[i] = 1 + Math.random();
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new Float32BufferAttribute(positionsArray, 3),
  );
  geometry.setAttribute("aSize", new Float32BufferAttribute(sizesArray, 1));
  geometry.setAttribute(
    "aTimeMultiplier",
    new Float32BufferAttribute(timeMultipliersArray, 1),
  );

  // Material
  texture.flipY = false;
  const material = new ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uSize: new Uniform(size),
      uResolution: new Uniform(sizes.resolution),
      uTexture: new Uniform(texture),
      uColor: new Uniform(color),
      uProgress: new Uniform(0),
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  // Points
  const firework = new Points(geometry, material);
  firework.position.copy(centerPosition);
  scene.add(firework);

  // Destroy
  const destroy = () => {
    scene.remove(firework);
    geometry.dispose();
    material.dispose();
  };

  // Animate
  gsap.to(material.uniforms.uProgress, {
    value: 1,
    duration: 3,
    ease: "linear",
    onComplete: destroy,
  });
};

const createRandomFirework = () => {
  const count = Math.round(400 + Math.random() * 600);
  const position = new Vector3(
    (Math.random() - 0.5) * 2,
    Math.random(),
    (Math.random() - 0.5) * 2,
  );
  const size = 0.1 + Math.random() * 0.2;
  const texture = textures[Math.floor(Math.random() * textures.length)];
  const radius = 0.5 + Math.random();
  const color = new Color();
  color.setHSL(Math.random(), 1, 0.7);

  createFirework(count, position, size, texture, radius, color);
};

createRandomFirework();

window.addEventListener("click", () => {
  createRandomFirework();
});

/**
 * Sky
 */
const sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);

const sun = new Vector3();

const skyParameters = {
  turbidity: 10,
  rayleigh: 3,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.95,
  elevation: -2.2,
  azimuth: 180,
  exposure: renderer.toneMappingExposure,
};

function updateSky() {
  const uniforms = sky.material.uniforms;
  uniforms["turbidity"].value = skyParameters.turbidity;
  uniforms["rayleigh"].value = skyParameters.rayleigh;
  uniforms["mieCoefficient"].value = skyParameters.mieCoefficient;
  uniforms["mieDirectionalG"].value = skyParameters.mieDirectionalG;

  const phi = MathUtils.degToRad(90 - skyParameters.elevation);
  const theta = MathUtils.degToRad(skyParameters.azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  uniforms["sunPosition"].value.copy(sun);

  renderer.toneMappingExposure = skyParameters.exposure;
  renderer.render(scene, camera);
}

gui.add(skyParameters, "turbidity", 0.0, 20.0, 0.1).onChange(updateSky);
gui.add(skyParameters, "rayleigh", 0.0, 4, 0.001).onChange(updateSky);
gui.add(skyParameters, "mieCoefficient", 0.0, 0.1, 0.001).onChange(updateSky);
gui.add(skyParameters, "mieDirectionalG", 0.0, 1, 0.001).onChange(updateSky);
gui.add(skyParameters, "elevation", -3, 10, 0.1).onChange(updateSky);
gui.add(skyParameters, "azimuth", -180, 180, 0.1).onChange(updateSky);
gui.add(skyParameters, "exposure", 0, 1, 0.0001).onChange(updateSky);

updateSky();

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
