# 10-debug-ui

Tools like `dat.gui`, available on npm, are useful to debug threejs

### How to use `dat.gui` ?

First, instantiate its main class

`const gui = new dat.GUI();`

Then you can use its `add` or `addColor` methods 
(take a look at [the documentation](https://github.com/dataarts/dat.gui/blob/HEAD/API.md))

```typescript
gui.add(mesh.position, 'x').min(-3).max(3).step(.01);
             ^          ^              ^
    object to debug   property name    some custom parameters
```

