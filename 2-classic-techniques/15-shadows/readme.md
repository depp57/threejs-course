# 15-shadows

### How it works

When you do one render, Three.js will first do a render for each light supposed to cast shadows. Those renders will simulate what the light sees as if it was a camera. During these lights renders, MeshDepthMaterial replaces all meshes materials.

The results are stored as textures and named shadow maps.

[Here](https://threejs.org/examples/webgl_shadowmap_viewer.html) is an example of how shadow works.

### How to activate shadows

First, activate the shadow maps on the `renderer` :
- `render.shadowMap.enabled = true;`

Then, decide which objects can cast a shadow, and which ones can receive shadow
- `pointLight.castShadow = true`
- `Object3D.receiveShadow = true`

Try to activate these on a few objects as possible => performance.

Only the following lights support shadows :
- PointLight
- DirectionalLight
- SpotLight

### Shadow optimizations

#### Render size

By default, the shadow map size is only `512x512` for performance reasons.

```typescript
pointLight.shadow.mapSize.width = 1024 // uses more GPU;
pointLight.shadow.mapSize.height = 1024 // power of 2;
```

#### Near and far

Three.js is using cameras to do the shadow maps renders.
So we can define `near` and `far` values.

#### Amplitude

We can also specify amplitude for the `OrthographicCamera`, with `top`, `right`, `bottom` and `left` properties.

Keep in mind, three.js will use a `OrthographicCamera` only with a `DirectionalLight`.

#### Shadow map algorithm

There are 4 types of algorithms that can be applied to shadow maps :

- `BasicShadowMap`  => very performant but lousy quality
- `PCFShadowMap` => less performant but smoother edges
- `PCFSoftShadowMap` => less performant but even softer edges
- `VSMShadowMap` => less performant, more constraints, can have unexpected results

`renderer.shadowMap.type = PCFSoftShadowMap;`

### Baking shadows

We saw baked lights in the previous lesson, and it is exactly the same thing.
Shadows are integrated into textures that we apply on materials.

First approach, with a **colored** texture. 
```typescript
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({
        map: bakedShadow
    })
);
```
Second approach, with an **alphaMap** texture.
```typescript
const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
);
```

### Performance

- Activate shadow on few `Object3D` as possible.
- Use few lights as possible, especially with shadow enabled.
- `PointLight` uses a lot of GPU for its shadow, because it needs to render 6 more times (for each direction) every frame.
