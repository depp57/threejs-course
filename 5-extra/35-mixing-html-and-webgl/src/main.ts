import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import {
  CubeTextureLoader, DirectionalLight,
  LoadingManager,
  Mesh,
  MeshStandardMaterial, PCFSoftShadowMap, PerspectiveCamera,
  PlaneGeometry, Raycaster, ReinhardToneMapping,
  Scene,
  ShaderMaterial, sRGBEncoding, Vector3, WebGLRenderer
} from 'three';

/**
 * Loaders
 */
let isSceneReady        = false;
const loadingBarElement = document.querySelector('.loading-bar') as HTMLDivElement;
const loadingManager    = new LoadingManager(
  // Loaded
  () => {
    // Wait a little
    window.setTimeout(() => {
      // Animate overlay
      gsap.to(overlayMaterial.uniforms.uAlpha, {duration: 3, value: 0, delay: 1});

      // Update loadingBarElement
      loadingBarElement.classList.add('ended');
      loadingBarElement.style.transform = '';
    }, 500);

    window.setTimeout(() => {
      isSceneReady = true;
    }, 2000);
  },

  // Progress
  (_, itemsLoaded, itemsTotal) => {
    // Calculate the progress and update the loadingBarElement
    const progressRatio               = itemsLoaded / itemsTotal;
    loadingBarElement.style.transform = `scaleX(${progressRatio})`;
  }
);
const gltfLoader        = new GLTFLoader(loadingManager);
const cubeTextureLoader = new CubeTextureLoader(loadingManager);

/**
 * Base
 */
      // Debug
const debugObject = {};

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new Scene();

/**
 * Overlay
 */
const overlayGeometry = new PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new ShaderMaterial({
  // wireframe: true,
  transparent: true,
  uniforms:
    {
      uAlpha: {value: 1}
    },
  vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
  fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
});
const overlay         = new Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
      // child.material.envMap = environmentMap
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.material.needsUpdate     = true;
      child.castShadow               = true;
      child.receiveShadow            = true;
    }
  });
};

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg'
]);

environmentMap.encoding = sRGBEncoding;

scene.background  = environmentMap;
scene.environment = environmentMap;

debugObject.envMapIntensity = 2.5;

/**
 * Models
 */
gltfLoader.load(
  '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
  (gltf) => {
    gltf.scene.scale.set(2.5, 2.5, 2.5);
    gltf.scene.rotation.y = Math.PI * 0.5;
    scene.add(gltf.scene);

    updateAllMaterials();
  }
);

/**
 * Points of interest
 */
const points = [
  {
    position: new Vector3(1.55, 0.3, -0.6),
    element: document.querySelector('.point-0') as HTMLDivElement
  },
  {
    position: new Vector3(0.5, 0.8, -1.6),
    element: document.querySelector('.point-1') as HTMLDivElement
  },
  {
    position: new Vector3(1.6, -1.3, -0.7),
    element: document.querySelector('.point-2') as HTMLDivElement
  }
];

const raycaster = new Raycaster();

/**
 * Lights
 */
const directionalLight             = new DirectionalLight('#ffffff', 3);
directionalLight.castShadow        = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
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
      // Base camera
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls         = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer                   = new WebGLRenderer({
  canvas,
  antialias: true
});
renderer.physicallyCorrectLights = true;
renderer.outputEncoding          = sRGBEncoding;
renderer.toneMapping             = ReinhardToneMapping;
renderer.toneMappingExposure     = 3;
renderer.shadowMap.enabled       = true;
renderer.shadowMap.type          = PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Go through each point
  if (isSceneReady) {
    points.forEach(point => {
      const screenPosition = point.position.clone();
      screenPosition.project(camera);

      raycaster.setFromCamera(screenPosition, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length === 0) {
        point.element.classList.add('visible');
      }
      else {
        const intersectionDistance = intersects[0].distance;
        const pointDistance        = point.position.distanceTo(camera.position);

        intersectionDistance > pointDistance ?
          point.element.classList.add('visible') : point.element.classList.remove('visible');
      }

      const translateX              = screenPosition.x * sizes.width * 0.5;
      const translateY              = -screenPosition.y * sizes.height * 0.5;
      point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
    });
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
