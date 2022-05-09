# 33-performance-tips

You should always target a 60fps experience, on all devices you want your website to be compatible with.

Here is a list of performance tips. You can find other good tips [here](https://discoverthreejs.com/tips-and-tricks/).

## Monitoring

### 1 - Monitor FPS and Time per frame

It is better to monitor time per frame, as it is linear. FPS aren't linear, it means that :

- 160 fps -> 140 fps (-20fps | -15%) is less than 60 fps -> 40 fps. (-20fps but -33%)
- 6.25ms per frame (160fps) -> 7.14ms per frame (140fps)

You can use your web browser's FPS meter or a javascript library like [this one](https://github.com/mrdoob/stats.js/).

### 2 - Disable FPS limit

Check on Google how to disable your web browser's FPS limit. It can be interesting in some situation.

### 3 - Monitoring draw calls

Draw calls are actions of drawing triangles by the GPU.
There will be many draw calls when we have a complex scene with many objects, geometries, materials, etc.

Usually, we can say that the less draw calls you have, the better. We will see some tips to reduce these.

[Spector.js](https://chrome.google.com/webstore/detail/spectorjs/denbgaamihkadbghdceggmchnflmhpmk) is a great extension
to monitor draw calls.

### 4 - Renderer informations

`console.log(renderer.info);` is a simple way to get information about the renderer.

## General

### 5 - Good Javascript code

CPU could be the bottleneck of your experience. Your web browser's performance monitor tool can check that.

Especially, optimize the `tick()` function which will be called on each frame.

### 6 - Dispose of things

Once you are absolutely sure you don't need a resource like a geometry or a material, dispose of it.

Check the [Three.js documentation](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).

## Lights

### 7 - Avoid them

If possible, try to avoid using Three.js lights.
These are useful and simple to use, but they can steadily suck the computer's performance.
Indeed, the GPU will need to re-render the scene for each light.

If you don't have a choice, try to use as few lights as possible and use the cheapest ones like the
[AmbientLight](https://threejs.org/docs/#api/en/lights/AmbientLight) or the
[DirectionalLight](https://threejs.org/docs/#api/en/lights/DirectionalLight).

### 8 - Avoid adding or removing lights

When you add or remove light from the scene, all the materials supporting lights will have to be recompiled.

## Shadows

### 9 - Avoid them

Like the lights, shadows are handy, but they are bad for performances.
Avoid them and try to find alternatives like baked shadows.

### 10 - Optimize shadow maps

If you don't have any other choice, try to optimize the shadow maps, so they look good but fit perfectly with the scene.

Use the CameraHelper to see the area that will be renderer by the shadow map camera and reduce it to the smallest area
possible:

```typescript
directionalLight.shadow.camera.top    = 3;
directionalLight.shadow.camera.right  = 6;
directionalLight.shadow.camera.left   = -6;
directionalLight.shadow.camera.bottom = -3;
directionalLight.shadow.camera.far    = 10;
directionalLight.shadow.mapSize.set(1024, 1024);

const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(cameraHelper);
```

### 11 - Use castShadow and receiveShadow wisely

Some objects can cast shadows, some objects can receive shadows, and some might do both.
Try to activate `castShadow` and `receiveShadow` on as few objects as possible.

### 12 - Deactivate shadow auto update

Per default, shadow maps get updated before each render.
You can deactivate this auto-update and alert Three.js that the shadow maps needs update only when necessary:

```typescript
renderer.shadowMap.autoUpdate  = false;
renderer.shadowMap.needsUpdate = true;
```

## Textures

### 13 - Resize textures

Textures take a lot of space in the GPU memory.
It's even worst with the mipmaps (the automatically generated smaller versions for minification filtering and
magnification filtering).

The texture file weight has nothing to do with that, and only the resolution matters.

### 14 - Keep a power of 2 resolution

When resizing, remember to keep a power of 2 resolution. That is important for mipmaps.

The resolution doesn't have to be a square; you can have a width different from the height.

### 15 - Use the right format

We said that the format doesn't change the memory usage on the GPU, but using the right format may reduce the loading
time
(Fewer bytes to download over HTTP).

Use image compression tools like [TinyPNG](https://tinypng.com/). Use `.jpg` if you don't need the alpha channel.

Check also the [Basis format](https://github.com/BinomialLLC/basis_universal) which results in a powerful compression.

## Geometries

### 16 - Do not update vertices

Updating the vertices of a geometry is terrible for the performances.
You can do it once when you create the geometry, but avoid doing it in the tick function.

If you need to animate the vertices, do it with a vertex shader.

### 17 - Mutualize geometries

If you have multiple Meshes using the same geometry shape, create only one geometry, and use it on all the meshes:

```typescript
const geometry = new BoxGeometry(0.5, 0.5, 0.5);
const material = new MeshNormalMaterial();

for (let i = 0; i < 50; i++) {

  const mesh = new THREE.Mesh(geometry, material);

  // Manipulate the mesh ...

  scene.add(mesh); // Still N WebGL draw call per render 
}
```

### 18 - Merge geometries

If the geometries aren't supposed to move, you can also merge them by using the BufferGeometryUtils.

```typescript
const geometries = [];
const material   = new MeshNormalMaterial();

for (let i = 0; i < 50; i++) {
  const geometry = new BoxGeometry(0.5, 0.5, 0.5);

  geometry.rotateX((Math.random() - 0.5) * Math.PI * 2);
  geometry.rotateY((Math.random() - 0.5) * Math.PI * 2);

  geometry.translate(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );

  geometries.push(geometry);
}

const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
const mesh           = new Mesh(mergedGeometry, material);
scene.add(mesh); // Only one WebGL draw call per render !
```

## Materials

### 19 - Mutualize materials

Like for the geometries, if you are using the same type of material for multiple meshes,
try to create only one and use it multiple times.

### 20 - Use cheap materials

Some materials like [`MeshStandardMaterial`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)
or [`MeshPhysicalMaterial`](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial) need more resources than
materials such as
[`MeshBasicMaterial`](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial),
[`MeshLambertMaterial`](https://threejs.org/docs/#api/en/materials/MeshLambertMaterial)
or [`MeshPhongMaterial`](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial).

## Meshes

### 21 - Use [`InstancedMesh`](https://threejs.org/docs/#api/en/objects/InstancedMesh)

If you cannot merge the geometries because you need to have control over the meshes independently, but they are using
the same geometry and the same material, use
an [`InstancedMesh`](https://threejs.org/docs/#api/en/objects/InstancedMesh).

## Models

### 22 - Low poly

The fewer the triangles to draw, the better the frame rate. If you need details, try to use normal maps.

### 23 - Draco compression

If the model has a lot of details with very complex geometries, use the Draco compression. It can reduce
weight drastically.

### 24 - Gzip

By default, web servers don't gzip files such as `.glb`, `.gltf`, `.obj` etc.

## Cameras

### 25 - Field of view

When objects are not in the field of view, they won't be rendered. That is called frustum culling.

### 26 - Near and far

Just like the field of view, you can reduce the near and far properties of the camera.

## Renderer

### 27 - Pixel ratio

Some devices have a very high pixel ratio. Try to limit the pixel ratio of the renderer to something like `2`.

`renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));`

### 28 - Power preferences

Some devices may be able to switch between different GPU.
We can give a hint on what power is required when instantiating the WebGLRenderer by specifying a powerPreference
property:

```typescript
const renderer = new THREE.WebGLRenderer({
  powerPreference: 'high-performance'
});
```

### 29 - Antialias

The default antialias is performant, but still, it's less performant than no antialias.
Only add it if you have visible aliasing and no performance issue.

## Post-processing

### 30 - Limit the number of passes

Each post-processing pass will take as many pixels as the render's resolution (including the pixel ratio) to render.
Be reasonable, and try to regroup your custom passes into one.

## Shaders

### 31 - Specify the precision

Choose between `lowp`, `mediump` (recommended, works on all devices), `highp`.

### 32 - Keep code simple

Avoid `if` statements. Make good use of built-in functions.

### 33 - Use textures

Employing perlin noise functions is cool, but it can affect your performance considerably.
Sometimes, you better use a texture representing the noise (this applies for everything of course).

### 34 - Use defines

Uniforms are beneficial because we can tweak them and animate the values in the JavaScript.
But uniforms have a performance cost. If the value isn't supposed to change, you can use defines.

`#define PI 3.1415926535`

### 35 - Do the calculation in the vertex shader

Then send it to the fragment if possible. Vertex shaders are called on each frame per vertex.
Fragment shaders are called on each frame once per fragment.

For example :

```text
Point p1 = (0, 0);
Point p2 = (100, 0);
Point p3 = (100, 100);
Point p4 = (0, 100);
Cube c = Cube(p1, p2, p3, p4); 
// Only 4 vertices, but 100 * 100 = 10000 fragment (not exactly cause this is leveraged by the render size, but you get the point)
```
