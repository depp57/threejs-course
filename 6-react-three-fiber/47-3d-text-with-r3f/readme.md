# 47 - 3D text with r3f

## Text3D helper

We need to use [TextGeometry](https://threejs.org/docs/#examples/en/geometries/TextGeometry).

[Drei](https://github.com/pmndrs/drei) provides a helper named `Text3D` that implements it.

It needs a *typeface* font.

### How to get a typeface font
There are two main ways of getting fonts in that format :

- Convert your font with converters like this one.
- Find fonts in the Three.js examples located in the `/node_modules/three/examples/fonts/` folder.


### Usage

```jsx
<Text3D font="./fonts/font.typeface.json">
  Hello R3F
  <meshNormalMaterial />
</Text3D>
```

### Parameters

All parameters that we can use to create the
[TextGeometry](https://threejs.org/docs/#examples/en/geometries/TextGeometry) can be set as attributes.

For instance:
```jsx
<Center>
    <Text3D
        font="./fonts/font.typeface.json"
        size={ 0.75 }
        height={ 0.2 }
        curveSegments={ 12 }
        bevelEnabled
        bevelThickness={ 0.02 }
        bevelSize={ 0.02 }
        bevelOffset={ 0 }
        bevelSegments={ 5 }
    >
        HELLO R3F
        <meshNormalMaterial />
    </Text3D>
</Center>
```