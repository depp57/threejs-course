# 14-lights

| Type              | Utility | Other |
| ----------------- | ------- | ----- |
| [AmbientLight](https://threejs.org/docs/index.html#api/en/lights/AmbientLight) | Applies omnidirectional lighting on all geometries | Useful for light bouncing on backface of objects |
| [DirectionalLight](https://threejs.org/docs/index.html#api/en/lights/DirectionalLight) | Sun-like effect as if the sun rays were parallel | Oriented to the center of the scene |
| [HemisphereLight](https://threejs.org/docs/index.html#api/en/lights/HemisphereLight) | Similar to the _AmbientLight_, but 2 colors : one coming from the ground and the other from the sky | |
| [PointLight](https://threejs.org/docs/index.html#api/en/lights/PointLight) | Light source infinitely small, represented by a single point which emits light in every direction | We can apply fading with the third parameter |
| [RectAreaLight](https://threejs.org/docs/index.html#api/en/lights/RectAreaLight) | Rectangle which emits lights in every directions facing it | Only works with _StandardMaterial_ and _PhysicalMaterial_ |
| [SpotLight](https://threejs.org/docs/index.html#api/en/lights/SpotLight) | Works like a flashlight | Check the doc for orienting the light |

### Performance

Huge performance impact, try to use as few lights as possible, and use the lights that costs less if possible.

- Minimal cost
    - AmbientLight
    - HemisphereLight
    
- Moderate cost
    - DirectionalLight
    - PointLight
    
- High cost
    - SpotLight
    - RectAreaLight
    
### Baking

A good technique for lighting is called baking. The idea is that you bake the light into the texture, with a 3D software.

This can be done in a 3D software. Unfortunately, you won't be able to move the lights, because there are none, and you'll probably need a lot of textures.

### Helpers

Positioning and orienting the lights is hard. To assist us, we can use helpers. Only the following helpers are supported:

- [HemisphereLightHelper](https://threejs.org/docs/index.html#api/en/helpers/HemisphereLightHelper)
- [DirectionalLightHelper](https://threejs.org/docs/index.html#api/en/helpers/DirectionalLightHelper)
- [PointLightHelper](https://threejs.org/docs/index.html#api/en/helpers/PointLightHelper)
- [RectAreaLightHelper](https://threejs.org/docs/index.html#examples/en/helpers/RectAreaLightHelper)
- [SpotLightHelper](https://threejs.org/docs/index.html#api/en/helpers/SpotLightHelper)

```typescript
const light       = new PointLight();
const lightHelper = new PointLightHelper(light);
scene.add(light, lightHelper);
```
