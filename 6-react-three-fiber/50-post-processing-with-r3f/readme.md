# 50-post-processing-with-r3f

As explained in the course [32-post-processing](../../5-extra/32-post-processing/readme.md),
post-processing is about adding effects on the final render.

Here are some examples :

- Depth of field
- Bool
- Motion blur
- Glitch or drunk effect
- Color variations
- Antialiasing

## The issue with post-processing

In the previous lessons, we’ve used post-processing by adding passes.

Every pass cause an additional render, which results in performance drop.

## The solution

And this is exactly what [Post Processing](https://github.com/pmndrs/postprocessing) is trying to resolve.

The various passes will be merged into the least number of passes possible.
In fact, we don’t talk about passes anymore, but we talk about “effects”.

Those effects will be merged together into one or multiple passes (if needed) automatically while keeping
the order in which we added them.

We can use this library in R3F with [this implementation](https://github.com/pmndrs/react-postprocessing).

## Implementation

It is a simple as:

```jsx
return <>
  <EffectComposer multisampling={8} disableNormalPass/> {/* multisampling=8 per default. Disable normal pass */}
  {/* <Effect1/> */}
  {/* <Effect2/> */}
</>
```

Be careful, by default multisampling is enabled which can decrease a little bit the performance.

### Native effects

Check the documentation available here to see which effects are natively available:

- https://github.com/pmndrs/postprocessing#included-effects
- https://pmndrs.github.io/postprocessing/public/docs/

### Custom effect

*Drunk.jsx*
```jsx
import DrunkEffect from "./DrunkEffect.js";
import { forwardRef } from "react";

export default forwardRef(function Drunk(props, ref) {
  const effect = new DrunkEffect(props);

  return <primitive ref={ref} object={effect} />;
});
```

*DrunkEffect.js*
```jsx
import { BlendFunction, Effect } from "postprocessing";
import { Uniform } from "three";

const fragmentShader = `
    uniform float frequency;
    uniform float amplitude;
    uniform float time;
    
    void mainUv(inout vec2 uv)
    {
        uv.y += sin(uv.x * frequency + time) * amplitude;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    {
        outputColor = vec4(0.8, 1.0, 0.5, inputColor.a);
    }
`;

export default class DrunkEffect extends Effect {
  constructor({ frequency, amplitude, blendFunction = BlendFunction.DARKEN }) {
    super("DrunkEffect", fragmentShader, {
      blendFunction,
      uniforms: new Map([
        ["frequency", new Uniform(frequency)],
        ["amplitude", new Uniform(amplitude)],
        ["time", new Uniform(0)],
      ]),
    });
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get("time").value += deltaTime;
  }
}
```

Finally, use it:
```js
return <>
  <EffectComposer/>
  <Drunk ref={drunkRef} frequency={1} amplitude={1}/>
</>
```