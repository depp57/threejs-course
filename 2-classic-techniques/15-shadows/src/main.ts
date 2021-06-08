import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import {
    BasicShadowMap,
    CameraHelper, Mesh, MeshBasicMaterial,
    PCFSoftShadowMap, PlaneGeometry,
    PointLight,
    SpotLight,
    TextureLoader,
    VSMShadowMap
} from 'three';

/**
 * Textures
 */
const textureLoader = new TextureLoader();
const bakedShadow   = textureLoader.load('textures/bakedShadow.jpg');
const simpleShadow  = textureLoader.load('textures/simpleShadow.jpg');

/**
 * Base
 */
      // Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
      // Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001);
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(directionalLight);

directionalLight.shadow.mapSize.width  = 1024;
directionalLight.shadow.mapSize.height = 1024;

directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far  = 6;

directionalLight.shadow.camera.top    = 2;
directionalLight.shadow.camera.right  = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left   = -2;

// directionalLight.shadow.radius = 5;

const directionalLightCameraHelper = new CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightCameraHelper);

// Spot light
const spotLight      = new SpotLight(0xffffff, .3, 10, Math.PI * .3);
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2);

spotLight.shadow.mapSize.width  = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far  = 5;

spotLight.shadow.camera.fov = 30;

scene.add(spotLight);
scene.add(spotLight.target);

const spotLightCameraHelper = new CameraHelper(spotLight.shadow.camera);
// scene.add(spotLightCameraHelper);

// Point light
const pointLight      = new PointLight(0xffffff, .3);
pointLight.castShadow = true;
pointLight.position.set(-1, 1, 0);

pointLight.shadow.mapSize.width  = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near    = .1;
pointLight.shadow.camera.far     = 5;


scene.add(pointLight);

const pointLightCameraHelper = new CameraHelper(pointLight.shadow.camera);
// scene.add(pointLightCameraHelper);


/**
 * Materials
 */
const material     = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, 'metalness').min(0).max(1).step(0.001);
gui.add(material, 'roughness').min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere      = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
);
sphere.castShadow = true;

const plane         = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    // new MeshBasicMaterial({
    //     map: bakedShadow
    // })
    material
);
plane.rotation.x    = -Math.PI * 0.5;
plane.position.y    = -0.5;
plane.receiveShadow = true;

scene.add(sphere, plane);

const sphereShadow      = new Mesh(
    new PlaneGeometry(),
    new MeshBasicMaterial({
        color: 0x000000,
        alphaMap: simpleShadow,
        transparent: true
    })
);
sphereShadow.rotation.x = -Math.PI / 2;
sphereShadow.position.y = plane.position.y + .01;
scene.add(sphereShadow);

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
const camera      = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls         = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = false;
renderer.shadowMap.type    = PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update the sphere
    sphere.position.x = Math.cos(elapsedTime) * 1.5;
    sphere.position.z = Math.sin(elapsedTime) * 1.5;
    sphere.position.y = Math.sin((elapsedTime * 3) % Math.PI);

    sphereShadow.position.x       = sphere.position.x;
    sphereShadow.position.z       = sphere.position.z;
    sphereShadow.material.opacity = 1 / sphere.position.y;
    sphereShadow.scale.x          = 1 - (sphere.position.y * .3);
    sphereShadow.scale.y          = 1 - (sphere.position.y * .3);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
