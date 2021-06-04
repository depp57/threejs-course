# 13-3d-text

### How to get a typeface font

There are two main ways of getting fonts in that format :
- Convert your font with converters like [this one](https://gero3.github.io/facetype.js).
- Find fonts in the Three.js examples located in the `/node_modules/three/examples/fonts/` folder.


### Load the font

```typescript
const fontLoader = new THREE.FontLoader();

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font: Font) => {
        // we have to write the rest of our code related to this font inside this callback.
        const textGeometry = new THREE.TextGeometry(
            'Sacha Thommet',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12, // Segments in curved letter like 'e', minimizing this brings better performance
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5 // Segments in bevels, minimizing this brings better performance
            }
        )
        const textMaterial = new THREE.MeshBasicMaterial()
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
    }
);
```

By default, the text isn't centered, `textGeometry.center()` will make it.


