# 45 - Environment and staging with r3f

In this lesson, we are going to see some of the many environmental features available and how to implement them in R3F.

## Background color

### With CSS

By default, the canvas is transparent (`alpha: true`). This means that we can change the color directly in CSS.

```css
body {
    background: lightskyblue;
}
```

### With setClearColor on the renderer

The [WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setClearColor) has a method that fill the
`canvas` with a color before rendering the various objects in the scene.

```typescript jsx
const onCreated = ({gl}) => gl.setClearColor('#ff0000', 1); // deference the state parameter to access directly the WebGLRenderer

root.render(
  <Canvas>
    onCreated={onCreated}  
  </Canvas>
)
```

### With the scene background

```typescript jsx
import {Color} from "three";

const onCreated = ({scene}) => scene.background = new Color('#ff0000', 1);

root.render(
  <Canvas>
    onCreated={onCreated} 
  </Canvas>
)
```

### With R3F color

```typescript jsx
<Canvas
    camera={ {
        fov: 45,
        near: 0.1,
        far: 50,
        position: [ 1, 2, 6 ]
    } }
>
    <color args={[ '#ff0000' ]} attach="background" />
</Canvas>
```

Here, the `scene` is implied because it’s the only parent.

## Lights

All default Three.js lights are supported in R3F:

- `<ambientLight />`
- `<hemisphereLight />`
- `<directionalLight />`
- `<pointLight />`
- `<rectAreaLight />`
- `<spotLight />`

### Lights helper

The [Drei](https://github.com/pmndrs/drei) library gives us many helpers.

## Shadows

Again, the [Drei](https://github.com/pmndrs/drei) library gives us many helpers.

Especially, take a look at the many ways Drei let us easily bake *(render only once)* the shadows for better performances.

## Sky

And as always, [Drei](https://github.com/pmndrs/drei) make the task very easy with the Sky helper.

```typescript jsx
import { Sky } from '@react-three/drei'; 

return (
  <>
    <Sky/>
  </>
);
```