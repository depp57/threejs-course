import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Uniform,
  Vector2,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import GUI from "lil-gui";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";
import { gsap } from "gsap";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const debugObject = {
  clearColor: 0x160920,
};

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Scene
const scene = new Scene();

// Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

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

  // Materials
  if (particles) {
    particles.material.uniforms.uResolution.value.set(
      sizes.width * sizes.pixelRatio,
      sizes.height * sizes.pixelRatio,
    );
  }

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
camera.position.set(0, 0, 8 * 2);
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

gui.addColor(debugObject, "clearColor").onChange(() => {
  renderer.setClearColor(debugObject.clearColor);
});
renderer.setClearColor(debugObject.clearColor);

/**
 * Particles
 */
type Particles = {
  geometry: BufferGeometry;
  material: ShaderMaterial;
  points: Points;
  maxCount: number;
  positions: Float32BufferAttribute[];
  index: number;
  morph: (toIndex: number) => void;
  colorA: number;
  colorB: number;
};

let particles: Particles = null!;

gltfLoader.load("./models.glb", (gltf: { scene: Scene }) => {
  particles = {
    geometry: null!,
    material: null!,
    points: null!,
    maxCount: 0,
    positions: [],
    index: 0,
    morph: (toIndex: number) => {
      particles.geometry.attributes.position =
        particles.positions[particles.index];
      particles.geometry.attributes.aPositionTarget =
        particles.positions[toIndex];

      gsap.fromTo(
        particles.material.uniforms.uProgress,
        { value: 0 },
        { value: 1, duration: 3, ease: "linear" },
      );

      particles.index = toIndex;
    },
    colorA: 0xff7300,
    colorB: 0x0091ff,
  };

  // Positions
  const positions = gltf.scene.children.map(
    (child) => child.geometry.attributes.position,
  );

  for (const position of positions) {
    if (position.count > particles.maxCount) {
      particles.maxCount = position.count;
    }
  }

  for (const position of positions) {
    const originalArray = position.array;
    const newArray = new Float32Array(particles.maxCount * 3);

    // Copy original array and fill the rest with 0
    newArray.set(originalArray);

    if (originalArray.length < newArray.length) {
      for (let i3 = originalArray.length; i3 < newArray.length; i3 += 3) {
        const randomIndex = Math.floor(position.count * Math.random()) * 3;
        newArray[i3] = originalArray[randomIndex];
        newArray[i3 + 1] = originalArray[randomIndex + 1];
        newArray[i3 + 2] = originalArray[randomIndex + 2];
      }
    }

    particles.positions.push(new Float32BufferAttribute(newArray, 3));
  }

  // Geometry
  const sizeArray = Float32Array.from({ length: particles.maxCount }, (_) =>
    Math.random(),
  );

  particles.geometry = new BufferGeometry();
  particles.geometry.setAttribute(
    "position",
    particles.positions[particles.index],
  );
  particles.geometry.setAttribute("aPositionTarget", particles.positions[1]);
  particles.geometry.setAttribute(
    "aSize",
    new Float32BufferAttribute(sizeArray, 1),
  );
  // particles.geometry.setIndex(null);

  // Material
  particles.material = new ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms: {
      uSize: new Uniform(0.3),
      uResolution: new Uniform(
        new Vector2(
          sizes.width * sizes.pixelRatio,
          sizes.height * sizes.pixelRatio,
        ),
      ),
      uProgress: new Uniform(0),
      uColorA: new Uniform(new Color(particles.colorA)),
      uColorB: new Uniform(new Color(particles.colorB)),
    },
    blending: AdditiveBlending,
    depthWrite: false,
  });

  // Points
  particles.points = new Points(particles.geometry, particles.material);
  particles.points.frustumCulled = false;
  scene.add(particles.points);

  // Tweaks
  gui.addColor(particles, "colorA").onChange(() => {
    particles.material.uniforms.uColorA.value.set(particles.colorA);
  });
  gui.addColor(particles, "colorB").onChange(() => {
    particles.material.uniforms.uColorB.value.set(particles.colorB);
  });

  gui
    .add(particles.material.uniforms.uProgress, "value")
    .min(0)
    .max(1)
    .step(0.01)
    .listen()
    .name("Progress");

  gui.add({ morph: () => particles.morph(0) }, "morph").name("Morph 0");
  gui.add({ morph: () => particles.morph(1) }, "morph").name("Morph 1");
  gui.add({ morph: () => particles.morph(2) }, "morph").name("Morph 2");
  gui.add({ morph: () => particles.morph(3) }, "morph").name("Morph 3");
});

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render normal scene
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
