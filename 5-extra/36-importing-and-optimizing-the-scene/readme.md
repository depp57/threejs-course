# 36-importing-and-optimizing-the-scene

## Loading the model

```typescript
/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load(
  'portal.glb',
  gltf => scene.add(gltf.scene)
);
```

## Loading the texture

There is a disagreement between software / library about the direction of the `Y` axis in the texture's coordinates.
To fix this problem, just set the `flipY` property of the texture to `false`.

```typescript
const bakedTexture      = textureLoader.load('baked.jpg');
bakedTexture.flipY      = false;
bakedTexture.encoding   = sRGBEncoding;
renderer.outputEncoding = sRGBEncoding; // don't forget to tell the renderer to output sRGB colors

const bakedMaterial = new THREE.MeshBasicMaterial({map: bakedTexture});

gltfLoader.load(
  'portal.glb',
  gltf => {
    gltf.scene.traverse(child => {
      child.material = bakedMaterial;
    });
  }
);
```

## Getting objects by name

The exported gltf scene will keep the name of every object in Blender.
It is easy to get each object by its name :

```typescript
const portalLightMesh = gltf.scene.children.find(child => child.name === 'portalLight');
```

## Improving performance

### Monitoring

If you remember from the performance lesson, Spector.js is a Chrome plugin that let us
see the different steps the GPU had to go through to create the render.

To improve the performance by reducing WebGL draw calls, merge geometries inside Blender.

### Merging the baked objects inside Blender

1. Create a new collection for example `merged`.
2. Select all the objects you want to merge, then duplicate them with `SHIFT + D` and click once on the scene to
   validate.
3. While those duplicates objects are still selected, move them to the merged collection by pressing `M`.
4. All the objects are now duplicated in the merged collection. You can merge them by pressing `CTRL + J`.
5. Rename the merged object and export the scene !
