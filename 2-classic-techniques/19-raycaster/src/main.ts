import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { Intersection, Material, Mesh, MeshBasicMaterial, Raycaster, SphereGeometry, Vector2, Vector3 } from 'three';

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
 * Objects
 */
const object1      = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({color: '#ff0000'})
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({color: '#ff0000'})
);

const object3      = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({color: '#ff0000'})
);
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * Raycaster
 */
const raycaster = new Raycaster();
// const rayOrigin    = new Vector3(-3, 0, 0);
// const rayDirection = new Vector3(10, 0, 0).normalize();
// raycaster.set(rayOrigin, rayDirection);
//
// const intersect = raycaster.intersectObject(object2);
// const intersects = raycaster.intersectObjects([object1, object2, object3]);

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
 * Mouse
 */
const mouse = new Vector2();

canvas.addEventListener('mousemove', (event: MouseEvent) => {
    mouse.x = event.x / sizes.width * 2 - 1;
    mouse.y = - (event.y / sizes.height * 2 - 1);
});

canvas.addEventListener('click', () => {
    if (currentIntersect) {
        switch (currentIntersect.object) {
            case object1: console.log('click on the sphere 1'); break;
            case object2: console.log('click on the sphere 2'); break;
            case object3: console.log('click on the sphere 3'); break;
        }
    }
})

let currentIntersect: Intersection | null = null;

/**
 * Camera
 */
      // Base camera
const camera      = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
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

    // Update spheres
    const objects = [object1, object2, object3];

    objects.forEach(((sphere, index) => {
        sphere.position.y = Math.sin(elapsedTime + index * Math.PI / 2) * 1.5;
    }));

    // Cast a ray
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);

    objects.forEach(object => {
        object.material.color.set(0xff0000);
    });

    intersects.forEach(intersect => {
        const object = intersect.object as Mesh<SphereGeometry, MeshBasicMaterial>;
        object.material.color.set(0x0000ff);
    });

    if (intersects.length) {
        if (!currentIntersect) {
            console.log('mouse enter');
        }

        currentIntersect = intersects[0];
    }
    else {
        if (currentIntersect) {
            console.log('mouse leave');
        }

        currentIntersect = null;
    }


    // const rayOrigin    = new Vector3(-3, 0, 0);
    // const rayDirection = new Vector3(1, 0, 0); // needs to be normalized
    // raycaster.set(rayOrigin, rayDirection);
    //
    // const intersects = raycaster.intersectObjects(objects);
    //
    // objects.forEach(object => {
    //    object.material.color.set(0xff0000);
    // });
    //
    // intersects.forEach(intersect => {
    //     const object = intersect.object as Mesh<SphereGeometry, MeshBasicMaterial>;
    //     object.material.color.set(0x0000ff);
    // });


    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
