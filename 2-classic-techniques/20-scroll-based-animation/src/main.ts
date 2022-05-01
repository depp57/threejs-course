import './style.css';
import * as THREE from 'three';
import * as dat from 'lil-gui';
import {
  BufferAttribute,
  BufferGeometry,
  ConeGeometry,
  DirectionalLight, Group,
  Mesh,
  MeshToonMaterial, NearestFilter, Points, PointsMaterial, TextureLoader,
  TorusGeometry,
  TorusKnotGeometry
} from 'three';
import gsap from 'gsap';

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: '#ffeded',
  directionalLightColor: '#ffffff'
};

gui.addColor(parameters, 'materialColor')
  .onChange(() => {
    material.color.set(parameters.materialColor);
    particlesMaterial.color.set(parameters.materialColor);
  });
gui.addColor(parameters, 'directionalLightColor')
  .onChange(() => directionalLight.color.set(parameters.directionalLightColor));


/**
 * Base
 */
      // Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const textureLoader       = new TextureLoader();
const gradientTexture     = textureLoader.load('/textures/gradients/3.jpg');
gradientTexture.magFilter = NearestFilter;

const material = new MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture
});

const objectsDistance = 4;

const mesh1 = new Mesh(
  new TorusGeometry(1, 0.4, 16, 60),
  material
);

const mesh2 = new Mesh(
  new ConeGeometry(1, 2, 32),
  material
);

const mesh3 = new Mesh(
  new TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

mesh1.position.y = -0;
mesh2.position.y = -objectsDistance;
mesh3.position.y = -objectsDistance * 2;

const sectionMeshes = [mesh1, mesh2, mesh3];

for (let i = 0; i < sectionMeshes.length; i++) {
  sectionMeshes[i].position.x = i % 2 ? -2 : 2;
}

scene.add(mesh1, mesh2, mesh3);

/**
 * Particles
 */
const particlesCount     = 200;
const particlesPositions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesPositions.length; i++) {
  particlesPositions[i * 3]     = (Math.random() - .5) * 6;
  particlesPositions[i * 3 + 1] = objectsDistance * .5 - Math.random() * objectsDistance * sectionMeshes.length;
  particlesPositions[i * 3 + 2] = (Math.random() - .5) * 6;
}

const particlesGeometry = new BufferGeometry();
particlesGeometry.setAttribute('position', new BufferAttribute(particlesPositions, 3));

const particlesMaterial = new PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: .03
});

const particles = new Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Lights
 */
const directionalLight = new DirectionalLight(parameters.directionalLightColor, 1);
directionalLight.position.set(1, 1, 0);

scene.add(directionalLight);

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
const cameraGroup = new Group();
scene.add(cameraGroup);

const camera      = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */
let scrollYComputed = 0;
let currentSection  = 0;

window.addEventListener('scroll', () => {
  const ratio     = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  scrollYComputed = -ratio * objectsDistance * 2;

  const newSection = Math.round(scrollYComputed / -objectsDistance);

  if (newSection !== currentSection) {
    currentSection = newSection;

    gsap.to(
      sectionMeshes[currentSection].rotation, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=6',
        y: '+=3',
        z: '+=1.5'
      }
    );
  }
});

/**
 * Cursor
 */
let cursorX = 0;
let cursorY = 0;

window.addEventListener('mousemove', (event: MouseEvent) => {
  cursorX = (event.clientX / sizes.width) - .5;
  cursorY = (event.clientY / sizes.height) - .5;
});

/**
 * Animate
 */
const clock      = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime   = elapsedTime - previousTime;
  previousTime      = elapsedTime;

  // Animate camera
  camera.position.y = scrollYComputed; // I could also ease this value, but it feels strange
  // Because it isn't following the html content

  const parallaxX = cursorX * .5;
  const parallaxY = -cursorY * .5;

  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 2 * deltaTime;
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 2 * deltaTime;

  // Animate meshes
  sectionMeshes.forEach(mesh => {
    mesh.rotation.x += deltaTime * .1;
    mesh.rotation.y += deltaTime * .15;
  });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
