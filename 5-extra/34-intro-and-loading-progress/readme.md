# 34-intro-and-loading-progress

It is easy to add a loader which tells the user that assets are loading.
Everything is in the code.

Just be aware of the `LoadingManager` :

```typescript
/**
 * Loaders
 */
const loadingManager = new THREE.LoadingManager(
    () => {
      console.log('loaded');
    },

    (itemUrl, itemsLoaded, itemsTotal) => {
      console.log('progress', itemsLoaded / itemsTotal, '%');
    }
  );

const gltfLoader        = new GLTFLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
```
