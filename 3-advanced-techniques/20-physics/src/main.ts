import './style.css';
import * as THREE from 'three';
import {
  BoxBufferGeometry,
  BufferGeometry,
  Material,
  Mesh,
  MeshStandardMaterial,
  SphereBufferGeometry,
  Vector3
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import * as CANNON from 'cannon-es';

/**
 * Debug
 */
const gui         = new dat.GUI();
const debugObject = {
  createSphere: () => createSphere(Math.random() + .2, {
    x: (Math.random() - .5) * 10,
    y: Math.random() * 3,
    z: (Math.random() - .5) * 10,
  }),
  createBox: () => createBox({
    x: Math.random() + .2,
    y: Math.random() + .2,
    z: Math.random() + .2
  }, {
    x: (Math.random() - .5) * 10,
    y: Math.random() * 3,
    z: (Math.random() - .5) * 10,
  }),
  reset: () => {
    for (const object of objectsToUpdate) {
      object.body.removeEventListener('collide', playHitSound);
      world.removeBody(object.body);
      scene.remove(object.mesh);
    }

    objectsToUpdate.length = 0; // empty the array
  }
};
gui.add(debugObject, 'createSphere');
gui.add(debugObject, 'createBox');
gui.add(debugObject, 'reset');

/**
 * Base
 */
      // Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3');

const normalize = (value: number, min: number, max: number) => (value - min) / (max - min);

// @ts-ignore
export const playHitSound = collision => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();

  if (impactStrength > 1.5) {
    hitSound.currentTime = 0;
    hitSound.volume      = normalize(impactStrength, 0, 50);
    hitSound.play();
  }
};

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

/**
 * Renderer
 */
const renderer             = new THREE.WebGLRenderer({
  canvas
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
      // const textureLoader     = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.png',
  '/textures/environmentMaps/0/nx.png',
  '/textures/environmentMaps/0/py.png',
  '/textures/environmentMaps/0/ny.png',
  '/textures/environmentMaps/0/pz.png',
  '/textures/environmentMaps/0/nz.png'
]);

/**
 * Physics
 */

      // World
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;

// Materials
// const plasticMaterial  = new CANNON.Material('plastic');
// const concreteMaterial = new CANNON.Material('concrete');
const defaultMaterial = new CANNON.Material('default');


// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//   concreteMaterial,
//   plasticMaterial,
//   {
//     friction: .1,
//     restitution: .7
//   }
// );
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: .1,
    restitution: .7
  }
);
// world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// Sphere
// const sphereShape = new CANNON.Sphere(.5);
// const sphereBody  = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape,
//   // material: defaultMaterial
// });
//
// sphereBody.applyLocalForce(
//   new CANNON.Vec3(150, 0, 0),
//   new CANNON.Vec3(0, 0, 0)
// );
//
// world.addBody(sphereBody);

// Floor
const floorShape = new CANNON.Plane();
const floorBody  = new CANNON.Body();
floorBody.mass   = 0; // make the object static
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI * .5);
// floorBody.material = defaultMaterial;

world.addBody(floorBody);


/**
 * Test sphere
 */
// const sphere      = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture
//   })
// );
// sphere.castShadow = true;
// sphere.position.y = 3;
// scene.add(sphere);

/**
 * Floor
 */
const floor         = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
  })
);
floor.receiveShadow = true;
floor.rotation.x    = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight      = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far    = 15;
directionalLight.shadow.camera.left   = -7;
directionalLight.shadow.camera.top    = 7;
directionalLight.shadow.camera.right  = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);


/**
 * Camera
 */
  // Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(-3, 3, 3);
scene.add(camera);

// Controls
const controls         = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Utils
 */
export type Vec3 = { x: number, y: number, z: number };
const vecToThree  = (vector: Vec3) =>
  new Vector3(vector.x, vector.y, vector.z);
const vecToCannon = (vector: Vec3) =>
  new CANNON.Vec3(vector.x, vector.y, vector.z);

const objectsToUpdate: { mesh: Mesh, body: CANNON.Body }[] = [];

const meshStandardMaterial = new MeshStandardMaterial({
  metalness: .3,
  roughness: .4,
  envMap: environmentMapTexture
});

const createSphere = (() => {
  const sphereBufferGeometry = new SphereBufferGeometry(1, 20, 20);

  return (radius: number, position: Vec3) => {
    createObject({x: radius, y: radius, z: radius}, position, {
        bufferGeometry: sphereBufferGeometry, material: meshStandardMaterial
      }, 'sphere'
    );
  };
})();

const createBox = (() => {
  const boxBufferGeometry = new BoxBufferGeometry(1, 1, 1);

  return (size: Vec3, position: Vec3) => {
    createObject(size, position, {
        bufferGeometry: boxBufferGeometry, material: meshStandardMaterial
      }, 'box'
    );
  };
})();

const createObject = (size: Vec3, position: Vec3,
                      mesh: { bufferGeometry: BufferGeometry, material: Material },
                      type: 'box' | 'sphere') => {

  // Three.js mesh
  const threeMesh = new Mesh(
    mesh.bufferGeometry,
    mesh.material
  );
  threeMesh.scale.set(size.x, size.y, size.z);

  threeMesh.castShadow = true;
  threeMesh.position.copy(vecToThree(position));
  scene.add(threeMesh);

  // Cannon.js body
  let shape: CANNON.Shape;
  switch (type) {
    case 'box' :
      shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
      break;
    case 'sphere' :
      shape = new CANNON.Sphere(size.x);
      break;
  }
  const body = new CANNON.Body({
    mass: 1,
    material: defaultMaterial,
    position: vecToCannon(position),
    shape,
  });

  body.addEventListener('collide', playHitSound);

  world.addBody(body);

  // Save in objects to update
  objectsToUpdate.push({
    mesh: threeMesh,
    body
  });
};

/**
 * Animate
 */
const clock        = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime   = elapsedTime - oldElapsedTime;
  oldElapsedTime    = elapsedTime;

  // Update physics world
  // sphereBody.applyForce(
  //   new CANNON.Vec3(-.5, 0, 0),
  //   sphereBody.position
  // );

  world.step(1 / 60, deltaTime, 3);

  for (const object of objectsToUpdate) {
    const {x, y, z} = object.body.position;
    object.mesh.position.copy(vecToThree({x, y, z}));
    // @ts-ignore
    object.mesh.quaternion.copy(object.body.quaternion);
  }


  // sphere.position.x = sphereBody.position.x;
  // sphere.position.y = sphereBody.position.y;
  // sphere.position.z = sphereBody.position.z;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
