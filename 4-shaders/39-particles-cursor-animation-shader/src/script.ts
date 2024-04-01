import {
  BufferAttribute,
  CanvasTexture,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Uniform,
  Vector2,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";

/**
 * Base
 */
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
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  // Materials
  particlesMaterial.uniforms.uResolution.value.set(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio,
  );

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
camera.position.set(0, 0, 18);
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
renderer.setClearColor("#181818");
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Displacement
 */
type Displacement = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  glowImage: HTMLImageElement;
  interactivePlane: Mesh;
  screenCursor: Vector2;
  canvasCursor: Vector2;
  canvasCursorPrevious: Vector2;
  raycaster: Raycaster;
  texture: CanvasTexture;
};
const displacement: Displacement = {
  canvas: null!,
  context: null!,
  glowImage: null!,
  interactivePlane: null!,
  screenCursor: null!,
  canvasCursor: null!,
  canvasCursorPrevious: null!,
  raycaster: null!,
  texture: null!,
};

// 2D canvas
displacement.canvas = document.createElement("canvas");
displacement.canvas.width = 256;
displacement.canvas.height = 256;
displacement.canvas.style.position = "fixed";
displacement.canvas.style.top = "0";
displacement.canvas.style.left = "0";
displacement.canvas.style.width = "256px";
displacement.canvas.style.height = "256px";
displacement.canvas.style.zIndex = "999";
document.body.append(displacement.canvas);

// Context
displacement.context = displacement.canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;
displacement.context.fillRect(
  0,
  0,
  displacement.canvas.width,
  displacement.canvas.height,
);

// Glow image
displacement.glowImage = new Image();
displacement.glowImage.src = "./glow.png";

// Interactive plane
displacement.interactivePlane = new Mesh(
  new PlaneGeometry(10, 10),
  new MeshBasicMaterial({ color: "red", side: DoubleSide }),
);
displacement.interactivePlane.visible = false;
scene.add(displacement.interactivePlane);

// Raycaster
displacement.raycaster = new Raycaster();
displacement.screenCursor = new Vector2(9999, 9999);
displacement.canvasCursor = new Vector2(9999, 9999);
displacement.canvasCursorPrevious = new Vector2(9999, 9999);
window.addEventListener("pointermove", (event) => {
  displacement.screenCursor.x = (event.clientX / sizes.width) * 2 - 1;
  displacement.screenCursor.y = -(event.clientY / sizes.height) * 2 + 1;
});

// Displacement texture
displacement.texture = new CanvasTexture(displacement.canvas);

/**
 * Particles
 */
const particlesGeometry = new PlaneGeometry(10, 10, 256, 256);
particlesGeometry.setIndex(null); // Remove indices as we use this geometry as points/particles (not as triangles)
particlesGeometry.deleteAttribute("normal");

const intensitiesArray = new Float32Array(
  particlesGeometry.attributes.position.count,
);
const anglesArray = new Float32Array(
  particlesGeometry.attributes.position.count,
);

for (let i = 0; i < particlesGeometry.attributes.position.count; i++) {
  intensitiesArray[i] = Math.random();
  anglesArray[i] = Math.random() * Math.PI * 2;
}

particlesGeometry.setAttribute("aAngle", new BufferAttribute(anglesArray, 1));
particlesGeometry.setAttribute(
  "aIntensity",
  new BufferAttribute(intensitiesArray, 1),
);

const particlesMaterial = new ShaderMaterial({
  vertexShader: particlesVertexShader,
  fragmentShader: particlesFragmentShader,
  uniforms: {
    uResolution: new Uniform(
      new Vector2(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio,
      ),
    ),
    uPictureTexture: new Uniform(textureLoader.load("./cat.jpg")),
    uDisplacementTexture: new Uniform(displacement.texture),
  },
});
const particles = new Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  /**
   * Raycaster
   */
  displacement.raycaster.setFromCamera(displacement.screenCursor, camera);
  const intersections = displacement.raycaster.intersectObject(
    displacement.interactivePlane,
  );
  if (intersections.length) {
    const uv = intersections[0].uv as Vector2;

    displacement.canvasCursor.x = uv.x * displacement.canvas.width;
    displacement.canvasCursor.y = displacement.canvas.height * (1 - uv.y);
  }

  /**
   * Displacement
   */
  // Fade out
  displacement.context.globalCompositeOperation = "source-over";
  displacement.context.globalAlpha = 0.02;
  displacement.context.fillRect(
    0,
    0,
    displacement.canvas.width,
    displacement.canvas.height,
  );

  // Speed alpha
  const cursorDistance = displacement.canvasCursorPrevious.distanceTo(
    displacement.canvasCursor,
  );
  displacement.canvasCursorPrevious.copy(displacement.canvasCursor);
  const alpha = Math.min(cursorDistance * 0.1, 1);

  // Draw glow
  displacement.context.globalCompositeOperation = "lighter";
  displacement.context.globalAlpha = alpha;
  const glowSize = displacement.canvas.width * 0.2;

  displacement.context.drawImage(
    displacement.glowImage,
    displacement.canvasCursor.x - glowSize * 0.5,
    displacement.canvasCursor.y - glowSize * 0.5,
    glowSize,
    glowSize,
  );

  // Update texture
  displacement.texture.needsUpdate = true;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
