import './style.css';
import * as THREE from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const group = new THREE.Group();
scene.add(group);
group.position.y = .5;
group.rotation.y = Math.PI / 4;
group.scale.set(.5, .5, 1);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0xff0000})
);

const cube2      = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0x00ff00})
);
cube2.position.x = -1.5;

const cube3      = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0x0000ff})
);
cube3.position.x = 1.5;

group.add(cube1, cube2, cube3);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({color: 0xff0000});
// const mesh     = new THREE.Mesh(geometry, material);
// scene.add(mesh);
//
// mesh.position.set(.7, -.6, 0);
// mesh.scale.set(.5, 1, 3);
// mesh.rotation.set(.1, .5, -.5);
// mesh.rotation.reorder('YXZ');
// mesh.rotation.y = Math.PI * .5;
// mesh.rotation.z = Math.PI * -.25;


const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);
// console.log(mesh.position.length()); length from the origin
// mesh.position.normalize(); // normalize the length => 1
// console.log(mesh.position.distanceTo(camera.position));

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 0, 3);
scene.add(camera);
// camera.lookAt(mesh.position);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas as HTMLCanvasElement,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
