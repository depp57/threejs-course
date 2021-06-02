# 06-animations

To perform an animation using threejs, create an 'animation loop' function with
`window.requestAnimationFrame(animateFunc)`

Also, use either `performance.now()` or the threejs `Clock` class 
to keep the animation working the same with all framerate.

Just upload the `Object3D` properties inside the `animateFunc`,
for instance 
```typescript
const elapsedTime = clock.getElapsedTime();
object.rotation.x = elapsedTime * Math.PI;
```

### Bonus

[GSAP](https://greensock.com/gsap) is an awesome library to perform animation in javascript
and it is compatible with threejs
