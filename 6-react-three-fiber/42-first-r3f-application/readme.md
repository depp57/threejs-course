# 42-first-r3f-application

## A simple mesh

*Native Three.js*

```typescript
import {BoxGeometry, Mesh, MeshBasicMaterial} from "three";

const mesh = new Mesh();
mesh.geometry = new BoxGeometry(1, 1, 1);
mesh.material = new MeshBasicMaterial({color: 'red'});
scene.add(mesh);
```

*R3F*
```typescript jsx
<mesh>
  <boxGeometry/>
  <meshBasicMaterial color='red'/>
</mesh>
```

Default parameters are automatically set for us.

## Objects, properties and constructor arguments

Declare properties declaratively. This way, all of them will only be instantiated once.

```typescript jsx
<mesh position={[1, 2, 3]} rotation-x={0.5}>
  <boxGeometry/>
  <meshBasicMaterial color='red'/>
</mesh>
```

### Constructor arguments

Constructor arguments are passwd an an array via `args`.

```typescript jsx
<sphereGeometry args={[1, 32]}/> // new SphereGeometry(1, 32)
```

### Shortcuts

#### Set

All properties whose underlying object has a `.set()` method can directly receive the same arguments that `.set()` would take.

```typescript jsx
<mesh position={[1, 2, 3]}/> // mesh.position.set(1, 2, 3)

<meshStandardMaterial color='hotpink'/> // meshStanderMaterial.color.set('hotpink')
```

#### SetScalar

Properties that have a `setScalar()` method (for instance `Vector3`) can be set like so:

```typescript jsx
<mesh scale={1}/> // translates to <mesh scale={[1, 1, 1]}/>
```

### Piercing into nested properties

If you want to reach into nested attributes (for instance: `mesh.rotation.x`), just use dash -case.

```typescript jsx
<mesh rotation-x={1} material-uniforms-resolution-value={[512, 512]}/>
```

### Attach

Use `attach` to bind objects to their parent. If you unmount the attached object it will be taken off its parent automatically.

The following attaches a material to the `material` property of a mesh and a geometry to the `geometry` property:

```typescript jsx
<mesh>
  <meshBasicMaterial attach="material"/>
  <boxGeometry attach="geometry"/>
</mesh>
```

All native elements ending with "Material" receive attach="material", and all elements ending with "Geometry" receive attach="geometry".
You do not strictly have to type it out!

```typescript jsx
<mesh>
  <meshBasicMaterial/>
  <boxGeometry/>
</mesh>
```

## Animate

We can animate 3D objects using the `useFrame()` hook provided by R3F.

```typescript jsx
export default function Experience() {
    useFrame(() => {
        console.log('tick');
    });
}
```

The callback inside `useFrame()` will be called on each frame regardless of the current frame rate.

### Animate an object

```typescript jsx
import {useRef} from "react";
import {Mesh} from "three";

export default function Experience() {
  const cube = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (cube.current) {
      cube.current.rotation.x += (Math.PI * delta) / 2; // one rotation per 4 seconds
    }
  });
  
  return
    <mesh ref={cube}>
      <meshBasicMaterial/>
      <boxGeometry/>
    </mesh>;
}
```

`state` contains information about our Three.js environment like the camera, the renderer, the scene, etc.
`delta` contains the time spent since the last frame in seconds.

