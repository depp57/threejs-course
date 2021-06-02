# 09-geometries

There are two types of geometry in threejs :

<br>

- Basic geometry like `BoxGeometry`, `TorusGeometry` which gives us abstraction from OpenGL

|     pros    |                   cons                 |
| ----------- | -------------------------------------- |
| easy to use | performance within a **complex** scene |

<br>

- `BufferGeometry` no abstraction, need to understand how OpenGL works

|       pros       |                          cons                            |
| ---------------- | -------------------------------------------------------- |
| good performance | hard to master, can be worst than basic if not well used |

Let's explore `BufferGeometry` with a simple example

```typescript
const geometry = new THREE.BufferGeometry();

const triangles  = 200;             // number of triangles we want to render
const vertices   = triangles * 3;   // a triangle is composed by 3 vertices (points)
const attributes = vertices * 3;    // a 3D vertex is composed by 3 values (x, y, z)

const positionsArray = new Float32Array(attributes); // fixed-size typed array, store data sent to the GPU

for (let i = 0; i < attributes; i++) {
    positionsArray[i] = (Math.random() - .5) * 3;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAttribute);  // send the data to the shader, in the "position" input
                                                        // note : in this case, we use threejs's default shaders

const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true
});
const mesh     = new THREE.Mesh(geometry, material); // finally create a mesh with all these 200 triangles
```
