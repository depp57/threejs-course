# 43-rf3-drei

One of the advantages of React is the ability to make things reusable.

[Drei](https://github.com/pmndrs/drei) is a library which brings a lot of helper.

## OrbitControls

```typescript jsx
import { OrbitControls } from '@react-three/drei';

export default function Experience() {
  return <>
    <OrbitControls />
    {/* ... */}
  </>
}
```

## PivotControls

This brings a gizmo to easily position, rotate and scale our 3D objects.

```typescript jsx
import { PivotControls } from '@react-three/drei';

export default function Experience() {
  return <>
    <PivotControls 
      anchor={[0, 0, 0]} // Put the gizmo at the center of the object
        depthTest={false}> // Disable depth test, so it will be always rendered, no matter if an object is above it
      <mesh position-x={ -2 }>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </PivotControls>
    {/* ... */}
  </>
}
```

## Text

We already know how to create 3D Text, but generating a 3D text geometry has its limits:

- We can notice the polygons.
- Generating the geometry takes a lot of CPU resources and the bigger the text, the longer it takes.
- Some fonts won’t look very good.
- It doesn’t support line breaks.

A good alternative is to use **SDF fonts**.

### SDF

SDF stands for Signed Distance Field and is usually used in fragment shaders to draw shapes.

The idea is that we send a 2D or 3D point to a SDF shape function and that function returns how far that point is from the shape.

Here is a good article on [2D SDF](https://iquilezles.org/articles/distfunctions2d/),
and [3D SDF](https://iquilezles.org/articles/distfunctions/).

This is wath we did in the **Shader patterns** lesson in the **OpenGL Shading Language**.

### SDF Fonts in R3F

Based on the [Troika](https://github.com/protectwise/troika) library, Drei implements the solution in the `Text` helper.

```typescript jsx
import { Float, Text } from '@react-three/drei';

export default function Experience() {
  return 
  <Float> // Animate the text like a ballon in the air
    <Text
      font="./bangers-v20-latin-regular.woff"
      fontSize={ 1 }
      color="salmon"
      position-y={ 2 }
      maxWidth={ 2 }
      textAlign="center"
    >
      I LOVE R3F
    </Text>
  </Float>
}
```

There are many others helpers, take a look at the official [docs](https://github.com/pmndrs/drei) ! 