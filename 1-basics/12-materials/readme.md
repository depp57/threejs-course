# 12-materials

There are multiple types of material in threejs (and we can create our own materials)

| Type              | Utility | Other |
| ----------------- | ------- | ----- |
| [MeshBasicMaterial](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial)| Basic & simple to use | |
| [MeshNormalMaterial](https://threejs.org/docs/#api/en/materials/MeshNormalMaterial)| Maps the normal vectors to RGB colors | Beautiful |
| [MeshMatcapMaterial](https://threejs.org/docs/#api/en/materials/MeshMatcapMaterial)| Defined by a MatCap texture, which encodes the material color and shading | Does not respond to lights |
| [MeshDepthMaterial](https://threejs.org/docs/#api/en/materials/MeshDepthMaterial)| Draws geometry by depth, white color is nearest, black is farthest | |
| [MeshLambertMaterial](https://threejs.org/docs/#api/en/materials/MeshLambertMaterial)| Reflects light, but it uses a non-physically based model => render could be bad  | Performance ++ |
| [MeshPhongMaterial](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial)| Like the _Lambert_, but better with shiny surfaces | Performance + |
| [MeshToonMaterial](https://threejs.org/docs/#api/en/materials/MeshToonMaterial)| Implements toon (cartoon like) shading | |
| [MeshStandardMaterial](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)| Implements physically based rendering (PBR) | Performance - |
| [MeshPhysicalMaterial](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial)| Extends _Standard_ and provides more advanced physically-based rendering properties | Performance -- |

### Material's properties

`Material` has many properties based on its type.

Let's explore some of them :

- `metalness: [0-1]` : How much the material is like a metal.
- `roughness: [0-1]` : How rough the material appears. 0.0 means a smooth mirror reflection, 1.0 means fully diffuse.
- `map: Texture` : The color texture map.
- `aoMap: Texture` : The ambient occlusion texture map. Requires a second set of UVs

```typescript
mesh.geometry.setAttribute('uv2', new BufferAttribute(
    sphere.geometry.attributes.uv.array, 2
));
```

- `displacementMap: Texture` : The height texture map. Needs a lot of vertices to work.
- `metalnessMap: Texture` : The metalness map.
- `roughnessMap: Texture` :  The roughness map.
- `normalMap: Texture` : The normal map.
- `alphaMap: Texture` : The alpha (transparency) map. Needs the property `transparent` to be true.
- `wireframe: boolean` : True to render all triangles which compose the geometry.
- `envMap: Texture` : The environment map, explanation below.

### Environment map

The environment map is like an image of what's surrounding the scene.
You can use it to add reflection or refraction to your objects.
It can also be used as lighting information.

```typescript
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
]);

material.envMap = environmentMapTexture;
```

#### Where to found environment map

One of the best sources is [HDRIHaven](https://hdrihaven.com).
Then convert the HDRI to a cube map using this [website](https://matheowis.github.io/HDRI-to-CubeMap/).
