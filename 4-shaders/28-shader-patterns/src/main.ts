import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import vertShader1 from './shaders/test1.vert?raw';
import vertShader2 from './shaders/test2.vert?raw';
import vertShader3 from './shaders/test3.vert?raw';
import vertShader4 from './shaders/test4.vert?raw';
import vertShader5 from './shaders/test5.vert?raw';
import vertShader6 from './shaders/test6.vert?raw';
import vertShader7 from './shaders/test7.vert?raw';
import vertShader8 from './shaders/test8.vert?raw';
import vertShader9 from './shaders/test9.vert?raw';
import vertShader10 from './shaders/test10.vert?raw';
import vertShader11 from './shaders/test11.vert?raw';
import vertShader12 from './shaders/test12.vert?raw';
import vertShader13 from './shaders/test13.vert?raw';
import vertShader14 from './shaders/test14.vert?raw';
import vertShader15 from './shaders/test15.vert?raw';
import vertShader16 from './shaders/test16.vert?raw';
import vertShader17 from './shaders/test17.vert?raw';
import vertShader18 from './shaders/test18.vert?raw';
import vertShader19 from './shaders/test19.vert?raw';
import vertShader20 from './shaders/test20.vert?raw';
import vertShader21 from './shaders/test21.vert?raw';
import vertShader22 from './shaders/test22.vert?raw';
import vertShader23 from './shaders/test23.vert?raw';
import vertShader24 from './shaders/test24.vert?raw';
import vertShader25 from './shaders/test25.vert?raw';
import vertShader26 from './shaders/test26.vert?raw';
import vertShader27 from './shaders/test27.vert?raw';
import vertShader28 from './shaders/test28.vert?raw';
import vertShader29 from './shaders/test29.vert?raw';
import vertShader30 from './shaders/test30.vert?raw';
import vertShader31 from './shaders/test31.vert?raw';
import vertShader32 from './shaders/test32.vert?raw';
import vertShader33 from './shaders/test33.vert?raw';
import vertShader34 from './shaders/test34.vert?raw';
import vertShader35 from './shaders/test35.vert?raw';
import vertShader36 from './shaders/test36.vert?raw';
import vertShader37 from './shaders/test37.vert?raw';
import vertShader38 from './shaders/test38.vert?raw';
import vertShader39 from './shaders/test39.vert?raw';
import vertShader40 from './shaders/test40.vert?raw';
import vertShader41 from './shaders/test41.vert?raw';
import vertShader42 from './shaders/test42.vert?raw';
import vertShader43 from './shaders/test43.vert?raw';
import vertShader44 from './shaders/test44.vert?raw';
import vertShader45 from './shaders/test45.vert?raw';
import vertShader46 from './shaders/test46.vert?raw';
import vertShader47 from './shaders/test47.vert?raw';
import vertShader48 from './shaders/test48.vert?raw';
import vertShader49 from './shaders/test49.vert?raw';
import vertShader50 from './shaders/test50.vert?raw';

import fragShader1 from './shaders/test1.frag?raw';
import fragShader2 from './shaders/test2.frag?raw';
import fragShader3 from './shaders/test3.frag?raw';
import fragShader4 from './shaders/test4.frag?raw';
import fragShader5 from './shaders/test5.frag?raw';
import fragShader6 from './shaders/test6.frag?raw';
import fragShader7 from './shaders/test7.frag?raw';
import fragShader8 from './shaders/test8.frag?raw';
import fragShader9 from './shaders/test9.frag?raw';
import fragShader10 from './shaders/test10.frag?raw';
import fragShader11 from './shaders/test11.frag?raw';
import fragShader12 from './shaders/test12.frag?raw';
import fragShader13 from './shaders/test13.frag?raw';
import fragShader14 from './shaders/test14.frag?raw';
import fragShader15 from './shaders/test15.frag?raw';
import fragShader16 from './shaders/test16.frag?raw';
import fragShader17 from './shaders/test17.frag?raw';
import fragShader18 from './shaders/test18.frag?raw';
import fragShader19 from './shaders/test19.frag?raw';
import fragShader20 from './shaders/test20.frag?raw';
import fragShader21 from './shaders/test21.frag?raw';
import fragShader22 from './shaders/test22.frag?raw';
import fragShader23 from './shaders/test23.frag?raw';
import fragShader24 from './shaders/test24.frag?raw';
import fragShader25 from './shaders/test25.frag?raw';
import fragShader26 from './shaders/test26.frag?raw';
import fragShader27 from './shaders/test27.frag?raw';
import fragShader28 from './shaders/test28.frag?raw';
import fragShader29 from './shaders/test29.frag?raw';
import fragShader30 from './shaders/test30.frag?raw';
import fragShader31 from './shaders/test31.frag?raw';
import fragShader32 from './shaders/test32.frag?raw';
import fragShader33 from './shaders/test33.frag?raw';
import fragShader34 from './shaders/test34.frag?raw';
import fragShader35 from './shaders/test35.frag?raw';
import fragShader36 from './shaders/test36.frag?raw';
import fragShader37 from './shaders/test37.frag?raw';
import fragShader38 from './shaders/test38.frag?raw';
import fragShader39 from './shaders/test39.frag?raw';
import fragShader40 from './shaders/test40.frag?raw';
import fragShader41 from './shaders/test41.frag?raw';
import fragShader42 from './shaders/test42.frag?raw';
import fragShader43 from './shaders/test43.frag?raw';
import fragShader44 from './shaders/test44.frag?raw';
import fragShader45 from './shaders/test45.frag?raw';
import fragShader46 from './shaders/test46.frag?raw';
import fragShader47 from './shaders/test47.frag?raw';
import fragShader48 from './shaders/test48.frag?raw';
import fragShader49 from './shaders/test49.frag?raw';
import fragShader50 from './shaders/test50.frag?raw';


import {
  DoubleSide,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer
} from 'three';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new Scene();

/**
 * Test mesh
 */

const geometry = new PlaneGeometry(1, 1, 32, 32);


const meshes = [
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader1, fragmentShader: fragShader1, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader2, fragmentShader: fragShader2, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader3, fragmentShader: fragShader3, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader4, fragmentShader: fragShader4, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader5, fragmentShader: fragShader5, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader6, fragmentShader: fragShader6, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader7, fragmentShader: fragShader7, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader8, fragmentShader: fragShader8, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader9, fragmentShader: fragShader9, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader10, fragmentShader: fragShader10, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader11, fragmentShader: fragShader11, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader12, fragmentShader: fragShader12, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader13, fragmentShader: fragShader13, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader14, fragmentShader: fragShader14, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader15, fragmentShader: fragShader15, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader16, fragmentShader: fragShader16, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader17, fragmentShader: fragShader17, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader18, fragmentShader: fragShader18, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader19, fragmentShader: fragShader19, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader20, fragmentShader: fragShader20, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader21, fragmentShader: fragShader21, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader22, fragmentShader: fragShader22, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader23, fragmentShader: fragShader23, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader24, fragmentShader: fragShader24, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader25, fragmentShader: fragShader25, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader26, fragmentShader: fragShader26, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader27, fragmentShader: fragShader27, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader28, fragmentShader: fragShader28, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader29, fragmentShader: fragShader29, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader30, fragmentShader: fragShader30, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader31, fragmentShader: fragShader31, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader32, fragmentShader: fragShader32, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader33, fragmentShader: fragShader33, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader34, fragmentShader: fragShader34, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader35, fragmentShader: fragShader35, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader36, fragmentShader: fragShader36, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader37, fragmentShader: fragShader37, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader38, fragmentShader: fragShader38, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader39, fragmentShader: fragShader39, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader40, fragmentShader: fragShader40, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader41, fragmentShader: fragShader41, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader42, fragmentShader: fragShader42, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader43, fragmentShader: fragShader43, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader44, fragmentShader: fragShader44, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader45, fragmentShader: fragShader45, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader46, fragmentShader: fragShader46, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader47, fragmentShader: fragShader47, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader48, fragmentShader: fragShader48, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader49, fragmentShader: fragShader49, side: DoubleSide
  })),
  new Mesh(geometry, new ShaderMaterial({
    vertexShader: vertShader50, fragmentShader: fragShader50, side: DoubleSide
  }))
];

meshes.forEach((mesh, index) => {
  mesh.position.y = (-Math.floor(index / 10) + 3) * 1.02 - 1;

  mesh.position.x = (index - 4) * 1.02 - (Math.floor(index / 10) * 10.20) - .5;

  scene.add(mesh);
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
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 4.5);
scene.add(camera);

// Controls
const controls         = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new WebGLRenderer({
  canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
