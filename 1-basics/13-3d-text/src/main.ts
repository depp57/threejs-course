import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import {
    AxesHelper,
    Font,
    FontLoader,
    Mesh,
    MeshBasicMaterial,
    MeshMatcapMaterial,
    TextGeometry,
    TorusGeometry
} from 'three';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Axes helper
// const axesHelper = new AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font: Font) => {
        const textGeometry = new TextGeometry('Sacha Thommet', {
            font,
            size: .5,
            height: .2,
            curveSegments: 1,
            bevelEnabled: true,
            bevelThickness: .03,
            bevelSize: .02,
            bevelOffset: 0,
            bevelSegments: 1
        });

        // textGeometry.computeBoundingBox();
        // const boundingBoxMax = textGeometry.boundingBox?.max;
        // if (boundingBoxMax) {
        //     textGeometry.translate(
        //         -(boundingBoxMax.x - .02) * .5,
        //         -(boundingBoxMax.y - .02) * .5,
        //         -(boundingBoxMax.z - .03) * .5
        //     );
        // }
        textGeometry.center();

        const textMaterial = new MeshMatcapMaterial({
            matcap: textureLoader.load('textures/matcaps/9.png')
        });
        const text         = new Mesh(textGeometry, textMaterial);
        scene.add(text);

        console.time('donuts');

        const donutGeometry      = new TorusGeometry(.3, .2, 20, 45);
        const donutMatCapTexture = textureLoader.load('textures/matcaps/10.png');
        const donutMaterial      = new MeshMatcapMaterial({matcap: donutMatCapTexture});

        for (let i = 0; i < 300; i++) {
            const donut      = new Mesh(donutGeometry, donutMaterial);
            donut.position.x = (Math.random() - .5) * 10;

            donut.position.y = (Math.random() - .5) * 10;
            donut.position.z = (Math.random() - .5) * 10;
            donut.rotation.x = (Math.random() * Math.PI);

            donut.rotation.y = (Math.random() * Math.PI);
            const rand       = Math.random();

            donut.scale.set(rand, rand, rand);
            scene.add(donut);
        }

        console.timeEnd('donuts');
    }
);

/**
 * Object
 */


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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
