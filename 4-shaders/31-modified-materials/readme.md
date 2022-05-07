# 31-modified-materials

Until now, we were creating brand-new shader materials. But we can also modify existing materials.

The easiest way to do it is :

- By using a Three.js hook triggered before the shader is compiled.

```typescript
material.onBeforeCompile = shader => {
  console.log(shader); // access to vertexShader, fragmentShader, uniforms..
}
```

## Adding content to the vertex/fragment shader

Three.js uses its own system to include shader parts to prevent repeating the same code between the different materials.
Each **#include** will inject a code located in specific folder of the Three.js dependency.

Three.js stores all shaders in the `/node_modules/three/src/renderers/shaders/` folder.
All the included parts are called chunks, and you can find them in the `ShaderChunk/` folder.

```typescript
material.onBeforeCompile = shader => {
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
       #include <begin_vertex>
            
       ${customVertexShaderChunk} <-- Note this is only a chunk/part of the shader
    `
  );
}
```

### Fixing the projected shadow

Shadows will be buggy if you only play with the material's vertex shader.

This is because the material used by the lights for creating shadows is a `MeshDepthMaterial` and we cannot access that
material easily.

We'll need to create a custom material :

```typescript
const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking // Three.js lights need this depthPacking to render shadows
});

mesh.customDepthMaterial = depthMaterial;

depthMaterial.onBeforeCompile = shader => { // It should be exactly the same code as for the core material
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
       #include <begin_vertex>
            
       ${customVertexShaderChunk} <-- Note this is only a chunk/part of the shader
    `
  );
}
```

### Fixing the material's own shadow => fixing the normals

In the previous lessons, we saw that normals are coordinates associated with each vertex that tell what direction the
faces are facing.
If we were to see those normals, they would be arrows all over the model pointing on the outside.
Those normals are used for things like lighting, reflecting and shadowing.

When we rotated our vertices, we merely rotated the positions, but we didn't rotate the normals.
We need to modify the chunk that handles normals.

The chunk handling the normals first is called `beginnormal_vertex`.

```typescript
material.onBeforeCompile = shader => {
  shader.vertexShader = shader.vertexShader.replace(
    '#include <beginnormal_vertex>',
    `
       #include <beginnormal_vertex>

       objectNormal.xyz = ...;
    `
  );
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
       #include <begin_vertex>

       transformed.xz = ...;
    `
  );
}
```

Unfortunately, this will certainly result in a shader error.

That happens because we forgot that all those shaders chunks, in the end, will be merged into a unique shader.
The code we added to the `beginnormal_vertex` chunk will be aside of the code added to the `begin_vertex`, so be
careful about variable redefinitions etc.
