import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  BoxGeometry, CameraHelper, Clock, DirectionalLight, DynamicDrawUsage, Euler, InstancedMesh, Matrix4,
  Mesh, MeshNormalMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera, PlaneGeometry, Quaternion,
  Scene, ShaderMaterial, SphereGeometry,
  TextureLoader, TorusKnotGeometry, Vector3,
  WebGLRenderer
} from 'three';
import Stats from 'stats.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

/**
 * Stats
 */
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

/**
 * Base
 */
      // Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new Scene();

/**
 * Textures
 */
const textureLoader       = new TextureLoader();
const displacementTexture = textureLoader.load('/textures/displacementMap.png');

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
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(2, 2, 6);
scene.add(camera);

// Controls
const controls         = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer             = new WebGLRenderer({
  canvas,
  powerPreference: 'high-performance',
  antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type    = PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

/**
 * Test meshes
 */
// const cube         = new Mesh(
//   new BoxGeometry(2, 2, 2),
//   new MeshStandardMaterial()
// );
// cube.castShadow    = true;
// cube.receiveShadow = true;
// cube.position.set(-5, 0, 0);
// scene.add(cube);
//
// const torusKnot         = new Mesh(
//   new TorusKnotGeometry(1, 0.4, 128, 32),
//   new MeshStandardMaterial()
// );
// torusKnot.castShadow    = true;
// torusKnot.receiveShadow = true;
// scene.add(torusKnot);
//
// const sphere = new Mesh(
//   new SphereGeometry(1, 32, 32),
//   new MeshStandardMaterial()
// );
// sphere.position.set(5, 0, 0);
// sphere.castShadow    = true;
// sphere.receiveShadow = true;
// scene.add(sphere);
//
// const floor = new Mesh(
//   new PlaneGeometry(10, 10),
//   new MeshStandardMaterial()
// );
// floor.position.set(0, -2, 0);
// floor.rotation.x    = -Math.PI * 0.5;
// floor.castShadow    = true;
// floor.receiveShadow = true;
// scene.add(floor);

/**
 * Lights
 */
// const directionalLight      = new DirectionalLight('#ffffff', 1);
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.camera.far = 15;
// directionalLight.shadow.normalBias = 0.05;
// directionalLight.position.set(0.25, 3, 2.25);
// scene.add(directionalLight);

/**
 * Animate
 */
const clock = new Clock();

const tick = () => {
  stats.begin();

  const elapsedTime = clock.getElapsedTime();

  // Update test mesh
  // torusKnot.rotation.y = elapsedTime * 0.1;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  stats.end();
};

tick();

/**
 * Tips
 */

// // Tip 4
console.log(renderer.info);

// Tip 6
// scene.remove(cube)
// cube.geometry.dispose()
// cube.material.dispose()

// Tip 10
// directionalLight.shadow.camera.top    = 3;
// directionalLight.shadow.camera.right  = 6;
// directionalLight.shadow.camera.left   = -6;
// directionalLight.shadow.camera.bottom = -3;
// directionalLight.shadow.camera.far    = 10;
// directionalLight.shadow.mapSize.set(1024, 1024);
//
// const cameraHelper = new CameraHelper(directionalLight.shadow.camera);
// scene.add(cameraHelper);

// Tip 11
// cube.castShadow    = true;
// cube.receiveShadow = false;
//
// torusKnot.castShadow    = true;
// torusKnot.receiveShadow = false;
//
// sphere.castShadow    = true;
// sphere.receiveShadow = false;
//
// floor.castShadow    = false;
// floor.receiveShadow = true;

// Tip 12
renderer.shadowMap.autoUpdate  = false;
renderer.shadowMap.needsUpdate = true;

// Tip 18
// const geometries = [];
// const material   = new MeshNormalMaterial();
//
// for (let i = 0; i < 50; i++) {
//   const geometry = new BoxGeometry(0.5, 0.5, 0.5);
//
//   geometry.rotateX((Math.random() - 0.5) * Math.PI * 2);
//   geometry.rotateY((Math.random() - 0.5) * Math.PI * 2);
//
//   geometry.translate(
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10
//   );
//
//   geometries.push(geometry);
// }
//
// const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
// const mesh           = new Mesh(mergedGeometry, material);
// scene.add(mesh);

// Tip 22
// const geometry = new BoxGeometry(0.5, 0.5, 0.5);
//
// const material = new MeshNormalMaterial();
//
// const mesh = new InstancedMesh(geometry, material, 50);
// mesh.instanceMatrix.setUsage(DynamicDrawUsage);
// scene.add(mesh);
//
// for (let i = 0; i < 50; i++) {
//   const matrix = new Matrix4();
//
//   const position = new Vector3(
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10
//   );
//
//   const quaternion = new Quaternion();
//   quaternion.setFromEuler(new Euler(
//     (Math.random() - 0.5) * Math.PI * 2,
//     (Math.random() - 0.5) * Math.PI * 2,
//     0
//   ));
//
//   matrix.makeRotationFromQuaternion(quaternion);
//   matrix.setPosition(position);
//   mesh.setMatrixAt(i, matrix);
// }

// // Tip 29
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// // Tip 31, 32, 34 and 35
const shaderGeometry = new PlaneGeometry(10, 10, 256, 256);

const shaderMaterial = new ShaderMaterial({
  precision: 'lowp',
  uniforms:
    {
      uDisplacementTexture: {value: displacementTexture}
    },
  vertexShader: `
        #define uDisplacementStrength 1.5
        uniform sampler2D uDisplacementTexture;

        varying vec3 vColor;

        void main() {
            // Position
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            float elevation = texture2D(uDisplacementTexture, uv).r;
            modelPosition.y += max(elevation, 0.5) * uDisplacementStrength;
            gl_Position = projectionMatrix * viewMatrix * modelPosition;

            // Color
            vec3 depthColor = vec3(1.0, 0.1, 0.1);
            vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
            vec3 finalColor = mix(depthColor, surfaceColor, max(elevation, 0.25));
            
            vColor = finalColor;
        }
    `,
  fragmentShader: `
        varying vec3 vColor;

        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `
});

const shaderMesh      = new Mesh(shaderGeometry, shaderMaterial);
shaderMesh.rotation.x = -Math.PI * 0.5;
scene.add(shaderMesh);
