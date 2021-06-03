import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
    AmbientLight,
    BackSide, BufferAttribute, Color, CubeTextureLoader,
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    MeshDepthMaterial,
    MeshLambertMaterial,
    MeshMatcapMaterial,
    MeshNormalMaterial,
    MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshToonMaterial, NearestFilter,
    PlaneGeometry,
    PointLight,
    SphereGeometry,
    TextureLoader,
    TorusGeometry, Vector2
} from 'three';
import * as dat from 'dat.gui';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new TextureLoader();

// doors
const textureAlpha     = textureLoader.load('textures/door/alpha.jpg');
const textureAmbOcc    = textureLoader.load('textures/door/ambientOcclusion.jpg');
const textureColor     = textureLoader.load('textures/door/color.jpg');
const textureHeight    = textureLoader.load('textures/door/height.jpg');
const textureMetalness = textureLoader.load('textures/door/metalness.jpg');
const textureNormal    = textureLoader.load('textures/door/normal.jpg');
const textureRoughness = textureLoader.load('textures/door/roughness.jpg');

// gradients
const textureGradient1           = textureLoader.load('textures/gradients/5.jpg');
textureGradient1.minFilter       = NearestFilter;
textureGradient1.magFilter       = NearestFilter;
textureGradient1.generateMipmaps = false;

// matcaps
const textureMatCaps1 = textureLoader.load('textures/matcaps/8.png');


const cubeTextureLoader = new CubeTextureLoader();
const mapIndex          = 0;
let envMap: THREE.Texture | null;

const loadEnvMap = (mapIndex: number) => {
    envMap = cubeTextureLoader.load([
        `textures/environmentMaps/${mapIndex}/px.jpg`,
        `textures/environmentMaps/${mapIndex}/nx.jpg`,
        `textures/environmentMaps/${mapIndex}/py.jpg`,
        `textures/environmentMaps/${mapIndex}/ny.jpg`,
        `textures/environmentMaps/${mapIndex}/pz.jpg`,
        `textures/environmentMaps/${mapIndex}/nz.jpg`,
    ]);
};
loadEnvMap(mapIndex);


/**
 * Objects
 */
      // const material = new MeshBasicMaterial({
      // map: textureColor,
      // color: 0xff00ff,
      // wireframe: true,
      // opacity: .3,
      // transparent: true,
      // alphaMap: textureAlpha,
      // side: DoubleSide // DoubleSide => More work for the GPU
      // });

      // const material = new MeshNormalMaterial({
      //           wireframe: true,
      //           flatShading: true
      //       });

      // const material = new MeshMatcapMaterial({
      //           matcap: textureMatCaps1,
      //           flatShading: true
      //       });

      // const material = new MeshDepthMaterial();

      // const material = new MeshLambertMaterial(); // very performant, but strange artifacts

      // const material = new MeshPhongMaterial({
      //           shininess: 1000, // how shiny the reflection is
      //           specular: new Color(0xf1188ff) // the reflection color
      //       });

      // const material = new MeshToonMaterial({
      //           gradientMap: textureGradient1 // + specify texture's filters to NearestFilter
      //       });

const material = new MeshStandardMaterial({
          metalness: .7,
          roughness: .2,
          envMap
          // map: textureColor,
          // aoMap: textureAmbOcc,
          // aoMapIntensity: 1,
          // displacementMap: textureHeight,
          // displacementScale: .05,
          // metalnessMap: textureMetalness,
          // roughnessMap: textureRoughness,
          // normalMap: textureNormal,
          // normalScale: new Vector2(5, 5),
          // alphaMap: textureAlpha,
          // transparent: true
          // wireframe: true
      });

// const material = new MeshPhysicalMaterial({
//     // metalness: .45,
//     // roughness: .45,
//     map: textureColor,
//     aoMap: textureAmbOcc,
//     aoMapIntensity: 1,
//     displacementMap: textureHeight,
//     displacementScale: .05,
//     metalnessMap: textureMetalness,
//     roughnessMap: textureRoughness,
//     normalMap: textureNormal,
//     normalScale: new Vector2(5, 5),
//     alphaMap: textureAlpha,
//     transparent: true
//     // wireframe: true
// });

const sphere      = new Mesh(
    new SphereGeometry(.5, 64, 64),
    material
);
sphere.position.x = -1.5;
sphere.geometry.setAttribute('uv2', new BufferAttribute(
    sphere.geometry.attributes.uv.array, 2
));

const plane = new Mesh(
    new PlaneGeometry(1, 1, 64, 64),
    material
);
plane.geometry.setAttribute('uv2', new BufferAttribute(
    plane.geometry.attributes.uv.array, 2
));

const torus      = new Mesh(
    new TorusGeometry(.3, .2, 64, 128),
    material
);
torus.position.x = 1.5;
torus.geometry.setAttribute('uv2', new BufferAttribute(
    torus.geometry.attributes.uv.array, 2
));

scene.add(sphere, plane, torus);

/**
 * Lights
 */
const ambientLight = new AmbientLight(0xffffff, .5);
const pointLight   = new PointLight(0xffffff, .5);
pointLight.position.set(2, 3, 4);
scene.add(ambientLight, pointLight);

/**
 * Debug
 */
const debugObject = {
    mapIndex
};

const gui = new dat.GUI();
gui.add(material, 'metalness').min(0).max(1);
gui.add(material, 'roughness').min(0).max(1);
gui.add(material, 'aoMapIntensity').min(0).max(5);
gui.add(material, 'displacementScale').min(0).max(.1).step(.01);
gui.add(material.normalScale, 'x').min(0).max(10);
gui.add(material.normalScale, 'y').min(0).max(10);
gui.add(debugObject, 'mapIndex').min(0).max(3).step(1)
    .onChange(() => {
        loadEnvMap(debugObject.mapIndex);
        material.envMap = envMap;
    });

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
    canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.y = .1 * elapsedTime;
    // plane.rotation.y  = .1 * elapsedTime;
    torus.rotation.y  = .1 * elapsedTime;

    sphere.rotation.x = .15 * elapsedTime;
    // plane.rotation.x  = .15 * elapsedTime;
    torus.rotation.x  = .15 * elapsedTime;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
