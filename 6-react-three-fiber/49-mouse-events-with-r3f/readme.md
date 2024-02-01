# 49-mouse-events-with-r3f

As discussed in the previous lessons, handling mouse events was a bit tricky. We needed a `Raycaster`,
cast some rays (sometimes on each frame) and tested intersecting objects.

R3F has made that process much easier.

## Listening to events

```jsx
export default function Cube() {

  function eventHandler(event) { // event contains a lot of information (type, mesh, ...)
    console.log('the event occured');

    event.stopPropagation(); // stop propagation of the "ray" so it won't travel multiple objects
  }
  
  return (  
    <mesh onClick={ eventHandler } >
      <boxGeometry />
      <meshStandardMaterial color="red"/>
    </mesh>
  );
}
```

There are a lot of events, like:

- `onClick`
- `onContextMenu`
- `onDoubleClick`
- `onPointerUp`
- `onPointerDown`
- ...

## Performances

### General optimizations

Avoid events that need to be tested on each frame

- `onPointerOver`
- `onPointerEnter`
- `onPointerOut`
- `onPointerLeave`
- `onPointerMove`

Minimise the number of objects that listen to events and avoid testing complex geometries.

### meshBounds

`meshBounds` will create a theoretical sphere around the mesh *(bounding sphere)* and the pointer events will be
tested on that sphere instead of testing the geometry of the mesh.

[See the documentation by Drei](https://github.com/pmndrs/drei?tab=readme-ov-file#meshbounds).

### BVH

If you have very complex geometries and still need the pointer events to be accurate and performant,
you can also use the BVH (Bounding Volume Hierarchy).

It’s a much more complex approach, but made easy with the Bvh helper from
[Drei](https://github.com/pmndrs/drei?tab=readme-ov-file#bvh).