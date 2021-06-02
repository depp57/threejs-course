# 08-fullscreen-and-resizing

### Fullscreen

```typescript
if (!document.fullscreenElement) { // check if the page is in fullscreen mode
    canvas?.requestFullscreen(); // request the fullscreen mode in a specific element
}
else {
    document.exitFullscreen();
}
```

### Resizing

```typescript
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width  = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix(); // don't forget to update this matrix, with the new sizes

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // very important for anti-aliasing
});
```

`WebGLRenderer.setPixelRatio()` is for antialiasing :

- screens have different pixel ratio : 1, 1.5, 2, 3 ...
- it means that for 1 _software pixel_, the screen render _n_ real pixels
- => better precision (antialiasing), at the cost of performances
- `Math.min(window.devicePixelRatio, 2)` limits this ratio to 2, because more seems to be useless and costs a lot of performance
