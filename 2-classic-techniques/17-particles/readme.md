# 17-particles

### Particles material

We need a special type of material called [PointsMaterial](https://threejs.org/docs/#api/en/materials/PointsMaterial).

```typescript
const particlesMaterial = new PointsMaterial({
    size: 0.02, // Size of each particle
    sizeAttenuation: true // Distant particles should be smaller than close ones
});
```

### Geometry

Each vertex of the geometry will become a particle.

```typescript
const particlesGeometry = new SphereGeometry(1, 32, 32);
const particlesMaterial = ...

const particles = new Points(particlesGeometry, particlesMaterial); // Use the Point class, not the Mesh
scene.add(particles);
```

### Custom geometry

We can start from a `BufferGeometry`, and add a `position` attribute as we saw in the **Geometry** lesson.

```typescript
const particlesGeometry = new THREE.BufferGeometry()
const count = 500

const positions = new Float32Array(count * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)

for(let i = 0; i < count * 3; i++) { // Multiply by 3 for same reason
    positions[i] = (Math.random() - 0.5) * 10 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
}

// Create the Three.js BufferAttribute and specify that each information is composed of 3 values
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
```

### Custom material

Since it uses `PointMaterial`, we can define properties like `map` or `alphaMap`.

But we get a strange result, particles are not really transparent even if we define an `alphaMap` and `transparent = true`.

There are 3 main solutions :
- `particlesMaterial.alphaTest = 0.001;` 
  
    The alphaTest is a value between 0 and 1 that enables the WebGL to know when not to render the pixel according to that pixel's transparency.
- `particlesMaterial.depthTest = false;`
  
  When drawing, the WebGL tests if what's being drawn is closer than what's already drawn. That is called depth testing and can be deactivated.
  
- `particlesMaterial.depthWrite = false;`
  
  The depth of what's being drawn is stored in what we call a depth buffer. Instead of not testing if the particle is closer than what's in this depth buffer, we can tell the WebGL not to write particles in that depth buffer

**You should try all these solutions, and keep the one that works the best with you project.**

### Custom colors

Like the position attribute, you can define a `color` attribute.

```typescript
const colors = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) {
    colors[i] = Math.random(); // RGB colors from 0 to 1
}

particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

particlesMaterial.vertexColors = true; // Activate those vertex colors
```

### Animate

Two simple ways (we'll see a better approach in the `shader` lesson) :

- In the tick function : `particles.rotation.y = elapsedTime`;

  => Animate all particles together


- Also in the tick function :

  ```typescript
   for(let i = 0; i < count; i++) {
        const i3 = i * 3;

        // [i3 + 1] means all y values. [i3 + 2] => z values
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime);
    }
    particlesGeometry.attributes.position.needsUpdate = true;
  ```
  Not very performant ! Using shaders gives better performance.
