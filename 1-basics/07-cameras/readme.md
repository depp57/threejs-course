# 07-cameras

`PerspectiveCamera` allows us to specify **near** and **far** numbers. Objects outside this scope are not rendered

Avoid extreme values like `0.0001` and `999999` to prevent z-fighting

`OrthographicCamera` is a camera without perspective, like Age of Empire, every character are rendered with the same
size

Be careful using it, you should specify an aspect ratio like

```typescript
const aspectRatio = window.width / window.height;
const camera      = new THREE.OrthographicCamera(-aspectRatio, aspectRatio, -1, 1);
```

## Controling the camera

Take a look at the [controls documentation](https://threejs.org/docs/index.html?q=controls#examples/en/controls/OrbitControls)
