# 21-imported-models

### 3D file formats

According to my few researches, GLTF (2.0) seems to be the best format, no matter the case.

Don't bother, use GLTF whenever you can.

- Very popular, it has become the standard.
- Very good loading performance.
- Supports many sets of data (geometries/materials, cameras, lights, scene graph, **animations**, skeletons,
  morphing...).
- Supports PBR (Physically Based Rendering).
- Supports json, embedded and binary (lightest) file formats.

### Load the model in Three.js

```typescript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();

gltfLoader.load('/model.gltf',
  (gltf: GLTF) => {
    // Depends on the gltf file, if there is only one child add it. 
    // The best way is to console.log(gltf) so you can explore the 3d object.
    scene.add(gltf.scene.children[0]);

    // If there are multiple children, add them all.
    while (gltf.scene.children.length) {
      scene.add(gltf.scene.children[0]);
    }
  },
  progress => console.log(progress),
  error => console.log(error)
);
```

### Draco compression

This [tool](https://github.com/CesiumGS/gltf-pipeline/blob/73a8dbc9e8987077396eb314c92bc22d83c692d4/README.md) optimize
glTF assets using [Draco](https://github.com/google/draco) compression, among others optimizations.

```typescript
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();

/**
 * The decoder is available in native JavaScript but also Web Assembly (wasm), and it can run in a web-worker.
 * Three.js already provide this optimized code.
 * To find it, we must browse into the Three.js dependency and copy the Draco decoder folder into our project.
 * This Draco folder is located in /node_modules/three/examples/js/libs/.
 */
dracoLoader.setDecoderPath('/draco/');

gltfLoader.setDRACOLoader(dracoLoader);
```

Don't always use Draco compression. The .gltf file will be 5-10x lighter, but you'll need to decompress the resource.

This takes time and resources for the computer. Test it and use it only with files > 100kB.

### Animation

GLTF also supports animations.

```typescript
// Load the object like before...
(gltf: GLTF) => {
  const mixer  = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[0]); // gltf files can handle multiple animations, therefore the array.
  action.play();

  tick();
}
// ...
const tick = () => {
  // ...
  mixer.update(deltaTime);
  // ...
}
```

#### Three.js online editor

The three.js [editor](https://threejs.org/editor/) is like a small 3D software. You can test and tweak values easily.
