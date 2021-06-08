import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import {
    BoxGeometry,
    ConeGeometry, Float32BufferAttribute, Fog,
    Group,
    Mesh,
    MeshStandardMaterial, PCFSoftShadowMap,
    PlaneGeometry, PointLight, RepeatWrapping,
    SphereGeometry
} from 'three';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

// Fog
const fog = new Fog('#262837', 1, 15);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader               = new THREE.TextureLoader();
const doorColorTexture            = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture            = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture           = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture           = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture        = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture        = textureLoader.load('/textures/door/roughness.jpg');

const bricksColorTexture            = textureLoader.load('/textures/bricks/color.jpg');
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg');
const bricksNormalTexture           = textureLoader.load('/textures/bricks/normal.jpg');
const bricksRoughnessTexture        = textureLoader.load('/textures/bricks/roughness.jpg');

const grassColorTexture            = textureLoader.load('/textures/grass/color.jpg');
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg');
const grassNormalTexture           = textureLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture        = textureLoader.load('/textures/grass/roughness.jpg');

const graveColorTexture     = textureLoader.load('/textures/grave/color.jpg');
const gravesNormalTexture   = textureLoader.load('/textures/grave/normal.jpg');
const graveRoughnessTexture = textureLoader.load('/textures/grave/roughness.jpg');

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS            = RepeatWrapping;
grassColorTexture.wrapT            = RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = RepeatWrapping;
grassNormalTexture.wrapS           = RepeatWrapping;
grassNormalTexture.wrapT           = RepeatWrapping;
grassRoughnessTexture.wrapS        = RepeatWrapping;
grassRoughnessTexture.wrapT        = RepeatWrapping;

/**
 * House
 */
    // Group
const house = new Group();
scene.add(house);

// Walls
const height = 2.5;
const depth  = 4;
const walls  = new Mesh(
    new BoxGeometry(4, height, depth),
    new MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })
);
walls.geometry.setAttribute(
    'uv2',
    new Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = height / 2;
house.add(walls);

// Roof
const roof      = new Mesh(
    new ConeGeometry(3.5, height / 2, 4),
    new MeshStandardMaterial({
        map: bricksColorTexture
    })
);
roof.position.y = height + height / 4;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Door
const door = new Mesh(
    new PlaneGeometry(2.2, 2.2, 40, 40),
    new MeshStandardMaterial({
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        aoMap: doorAmbientOcclusionTexture,
        aoMapIntensity: 4,
        displacementMap: doorHeightTexture,
        displacementScale: .3,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
);
door.geometry.setAttribute(
    'uv2',
    new Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 1;
door.position.z = depth / 2 - 0.1;
house.add(door);

// Bushes
const bushGeometry = new SphereGeometry(1, 16, 16);
const bushMaterial = new MeshStandardMaterial({
    map: grassColorTexture
});

interface BushData {
    scale: number,
    x: number,
    y: number,
    z: number
}

const bushesData: BushData[] = [
    {scale: .5, x: .8, y: .2, z: 2.2},
    {scale: .25, x: 1.4, y: .1, z: 2.1},
    {scale: .4, x: -.8, y: .1, z: 2.2},
    {scale: .15, x: -1, y: .05, z: 2.6}
];

bushesData.forEach(bush => {
    const mesh = new Mesh(bushGeometry, bushMaterial);
    mesh.scale.set(bush.scale, bush.scale, bush.scale);
    mesh.position.set(bush.x, bush.y, bush.z);
    house.add(mesh);
});

// Graves
const graves = new Group();
scene.add(graves);

const graveGeometry = new BoxGeometry(.6, .8, .2);
const graveMaterial = new MeshStandardMaterial({
    map: graveColorTexture,
    roughnessMap: graveRoughnessTexture,
    normalMap: gravesNormalTexture
});

for (let i = 0; i < 50; i++) {
    const angle  = Math.random() * Math.PI * 2;
    const radius = 4 + Math.random() * 5;
    const x      = Math.cos(angle) * radius;
    const z      = Math.sin(angle) * radius;

    const grave = new Mesh(graveGeometry, graveMaterial);
    grave.position.set(x, .3, z);
    grave.rotation.y = Math.random() * Math.PI / 6;
    grave.rotation.z = Math.random() * Math.PI / 12;

    grave.castShadow = true;

    graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
);
floor.geometry.setAttribute(
    'uv2',
    new Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
    // Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door light
const doorLight = new PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

/**
 * Ghosts
 */
interface GhostData {
    color: string
}

const ghostsData: GhostData[] = [
    {color: '#ff00ff'},
    {color: '#00ffff'},
    {color: '#ffff00'}
];

const ghosts: PointLight[] = ghostsData.map(ghost =>
    new PointLight(ghost.color, 2, 3)
);
ghosts.forEach(ghost => scene.add(ghost));

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
renderer.setClearColor('#262837');


/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
moonLight.castShadow    = true;
doorLight.castShadow    = true;
ghosts.forEach(ghost => {
    ghost.castShadow            = true;
    ghost.shadow.mapSize.width  = 256;
    ghost.shadow.mapSize.height = 256;
    ghost.shadow.camera.far     = 7;
});
walls.castShadow = true;

floor.receiveShadow = true;

doorLight.shadow.mapSize.width  = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far     = 7;


/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update ghosts
    const angle = elapsedTime;
    ghosts.forEach((ghost, index) => {
        index++;
        const angleDirection = index % 2 === 0 ? 1 : -1;
        ghost.position.x     = Math.cos(angle * .3 * angleDirection * index) * 3 * index;
        ghost.position.z     = Math.sin(angle * .3 * angleDirection * index) * 3 * index;
        ghost.position.y     = Math.sin(angle);
    });

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
