# 11-textures

### Types

There are multiple types of texture in threejs (and we can create our own textures)

| Type              | Utility | Other |
| ----------------- | ------- | ----- |
| Color             | Apply a color to the geometry | |
| Alpha             | White visible, black not visible, (linear) | Grayscale |
| Height            | Move vertices (need a lot of them for subdivisions, black up, white down (linear). Useful for mapping hills or relief | Grayscale, performance -- |
| Normal            | Add details, doesn't need a lot of subdivision like _Height_, vertices won't move. It's all about lighting | Should be a png for details, performance + |
| Ambient occlusion | Add fake shadows | Grayscale |
| Metalness         | White is metallic, black non-metallic, linear. Mostly for reflection | Grayscale
| Roughness         | In duo with metalness, white is rough, black is smooth. Mostly for light dissipation | Grayscale

### How to load a texture file

Use a `TextureLoader`, it also provides `onLoad`, `onProgress` and `onError` callbacks.

You can also use provide a `LoadingManager` for global callbacks on all textures loaded :

```typescript
const loadingManager = new LoadingManager();
loadingManager.onProgress = () => console.log('onProgress');
...
const textureLoader  = new TextureLoader(loadingManager);

const texture1 = textureLoader.load(...); // log onProgress
const texture2 = textureLoader.load(...); // log onProgress
```

### How texture's coordinate are mapped to the geometry

`Geometry` use **UV coordinates mapping**.
Basic Geometry are provided with default mapping, but you should create your own mapping when defining new geometries.

### Texture's properties

`Texture` has many properties, here is [the documentation](https://threejs.org/docs/#api/en/textures/Texture).

One tip, when a single pixel on the texture cover more than one real pixel on the geometry, the `Texture.magFilter` is used.

The default filter is `LinerFilter`, which can give blurry results, using `NearestFilter` may fix this.
Also, when using `nearestFilter` with `Texture.minFilter`, you won't need **mip mapping**.

`Texture.generateMipmaps = false;` will deactivate the generation of mip maps, and thus improve performances.

### Performance

When preparing your textures, keep in mind 3 crucial elements :

- The weight of the image => users will need to download these images
- The size (or the resolution) => the GPU will need to compute more pixels
- The data inside the image => `jpg` are more compressed than `png`, prefer `jpg` if it can suit your case

### Links

- [Basic theory of physically based rendering](https://marmoset.co/posts/basic-theory-of-physically-based-rendering)
- [Free textures](https://3dtextures.me/)
- [Free textures](https://www.arroway-textures.ch/)
- [Free textures](https://www.poliigon.com/)
