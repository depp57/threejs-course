# 23-realistic-render

### Physically correct lights

Default Three.js light intensity values aren't realistic. They are based on an arbitrary scale unit and don't reflect
real-world values.
When you'll import a scene from a 3D engine, the lights might be a little broken.

To enable physically correct lights, just switch the `physicallyCorrectLights` property of the `WebGLRenderer` :

```typescript
renderer.physicallyCorrectLights = true;
```

### Environment map

For better performance while having nice lighting, you can use environment maps.
This subject is already described in the **1-basics : 12-materials** lesson.

In addition, you can apply the environment map to :

- The background

```typescript
scene.background = environmentMap;
```

- A material

```typescript
material.envMap = environmentMap;
```

- All children of a scene (useful with imported scene)

```typescript
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
      child.material.envMap          = environmentMap;
      child.material.envMapIntensity = 2.5; // 2.5 is an example
    }
  });
}
```

- Default environment map applied to all children of the scene

```typescript
scene.environment = environmentMap;
```

### Gamma correction

*As the human vision distinguishes more shades of dark colors, rgb encoders transform
the input colors as below.*

Without specifying `renderer.outputEncoding = sRGBEncoding;`, the renderer will decode
the inputs as it was not rgb-encoded, resulting in darkish color, which are incorrect.

You'll also need to specify `environmentMap.encoding = sRGBEncoding;` on each texture loaded
(glTFLoader applies this by default, but not other loaders).

/!\ Applies this encoding only on **colored texture** (eg. NOT normal maps).

```text
White          Encoded (more precision, because the human vision distinguishes more shades of darkish colors)
  | -------------------> |                     |
  | -----------------\   |     ---------->     |
  | -------------------> |       linear        |
  | -------------------> |     ---------->     |
  | ------------------\  |                     |
  | -----------------\ > |     --------\       |
  | ---------------\  -> |       rgb           |
  | -------------------> |     ---------->     |
  | -------------------> |     decode          |
Black
```

#### Going further

This process is commonly named **gamma correction** (sRGBEncoding uses a gamma factor of 2.2, which is the commonly used
value).

- https://www.donmccurdy.com/2020/06/17/color-management-in-threejs/
- https://medium.com/@tomforsyth/the-srgb-learning-curve-773b7f68cf7a

### Tone mapping

The tone mapping intends to convert High Dynamic Range (HDR) values to Low Dynamic Range (LDR) values.

While our assets are not HDR, the tone mapping effect may have a realistic result as if the camera was poorly adjusted.

To change the tone mapping, update the `toneMapping` property on the `WebGLRenderer`.

There are multiple possible values:

- NoToneMapping (default)
- LinearToneMapping
- ReinhardToneMapping
- CineonToneMapping
- ACESFilmicToneMapping

/!\ When you change the tone mapping dynamically, after the first render, you'll need to update the object's materials :

```typescript
material.needsUpdate = true;
```

### Antialiasing

The most easy way to perform antialiasing using Three.js is to enable the `antialias` property of the `WebGLRenderer` :

```typescript
const renderer = new THREE.WebGLRenderer({
  ...,
  antialias: true
});
```

It uses MSAA (Multi Sampling Anti Aliasing) which is already well optimized, and supported by all recent GPUs.
This algorithm increases the render's resolution, then each pixel color will automatically be averaged from the N pixels
rendered.

Unlike the SSAA (Super Sampling) / FSAA (FullScreen Sampling), the MSAA will only increase the resolution on the
geometries'edges.

### Shadows

As we saw in the **2-classic-techniques : 15-shadows** lesson, in can greatly improve the render.

```typescript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type    = THREE.PCFSoftShadowMap;

directionalLight.castShadow        = true;
directionalLight.shadow.camera.far = 15; // Tweak it using a CameraHelper, to increase performance
directionalLight.shadow.mapSize.set(1024, 1024);

object3D.castShadow    = true;
object3D.receiveShadow = true;
```

#### Shadow acne

These artifacts are called shadow acne. Shadow acne can occur on both smooth and flat surfaces for precision reasons
when calculating if the surface is in the shadow or not.

What's happening here is that the hamburger is casting a shadow on its own surface.

- The `bias` usually helps for flat surfaces :

```typescript
directionalLight.shadow.bias = 0.05;
```

- The `normalBias` usually helps for rounded surfaces :

```typescript
directionalLight.shadow.normalBias = 0.05;
```
