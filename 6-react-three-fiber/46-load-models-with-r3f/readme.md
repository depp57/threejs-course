# 46 - Load a model with r3f

# Loading a model

R3F provides a hook named `useLoader` that abstract loading. It does nothing more than a classic
three.js [loader](https://threejs.org/docs/#api/en/loaders/Loader).

```typescript jsx
import {useLoader} from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Experience() {
    const model = useLoader(GLTFLoader, './model.glb');
    
    return <primitive object={model.scene} scale={0.35}/>;
}
```

`<primitive>` is a container supported by R3F that will handle and display whatever we pu in its `object` attribute.

## Draco-encoded model

We can load a draco-compressed model in two ways :

With native r3f :

```typescript jsx
import {useLoader} from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';

const model = useLoader(GLTFLoader, './hamburger-draco.glb', loader => {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('./path/to/draco/decoder');
        loader.setDRACOLoader(dracoLoader);
    }
)
```

With [drei](https://github.com/pmndrs/drei) :

```typescript jsx
import {useGLTF} from '@react-three/drei';

const model = useGLTF('./hamburger-draco.glb'); // it will automatically fetch the draco loader from a cdn
```

# Lazy-loading

Currently, R3F won't display the component as long as everything isn't ready in the scene.
The users will experience a black screen while the model is loading.

Fortunately, React implements the `<Suspense>` component that will wait for the process to be done before rendering the
component.

All we need to you is to wrap the component inside a `<Suspense>`.

```typescript jsx
export default function Model()
{
  return <Suspense fallback={<MyPlaceHolder/>}><MyBigCustomModel/></Suspense>
}
```

One cool feature with the `<Suspense>` is that we can set a fallback.

The fallback is what the user will see if the component is not ready (in our case, while the model is loading).

# Preloading

Currently, our model will start loading only when the component is instantiated.

```typescript jsx
import {useGLTF} from '@react-three/drei';

export default function MyComponent() {
  return ...
}

useGLTF.preload('./myModel.glb');
```

Now, the model will start loading immediately even if we don't add `<>`;

# Multiple instances

[Drei](https://github.com/pmndrs/drei) export a `Clone` helper which can be used to display multiple instances of the same
mesh.

```typescript jsx
import { Clone, useGLTF } from '@react-three/drei';

export default function Model() {
  ...
  return <>
    <Clone object={ model.scene } scale={ 0.15 } position-x={ - 4 } />
    <Clone object={ model.scene } scale={ 0.35 } position-x={ 0 } />
    <Clone object={ model.scene } scale={ 0.55 } position-x={ 4 } />
  </>
}
```

The amount of geometries and shaders stays the same, no matter the number of instances. `Clone` creates
multiple meshes, which all are based on the same geometries and materials.

# GLTF to component

If we want to manipulate the different parts of a hamburger, we need to traverse the loaded model, search for the right child, save it in some ways and apply whatever we need to it.

Another option would be to open it in a 3D software, change it and export it again.

None of those solutions are convenient.

[GLTF -> React Three Fiber converter tool](https://github.com/pmndrs/gltfjsx) split the geometry into multiple groups.
