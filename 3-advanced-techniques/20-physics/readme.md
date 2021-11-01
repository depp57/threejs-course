# 20 - physics

### How it works

You'll need to create a purely theoretical physics world.

Every time you'll create a Three.js Mesh, you will also create a version of that mesh inside the physics world.

Then, on each frame tell the physics world to update itself. Then copy the coordinates (position/rotation) of the
physics objects to the corresponding Three.js mesh.

For this tutorial, I use [cannon-es](https://github.com/pmndrs/cannon-es).

### 1. Physics world

```typescript
const world = new World();
world.gravity.set(0, -9.82, 0); // Gravity on Earth
```

### 2. Physics objects

```typescript
const sphereShape = new Sphere(0.5); // Like Three.js we must define a 'geometry' = 'shape'
const sphereBody  = new Body({
  mass: 1,
  position: new Vec3(0, 3, 0),
  shape: sphereShape
});

world.addBody(sphereBody);
```

The [Body](https://pmndrs.github.io/cannon-es/docs/classes/body.html) constructor accepts multiple parameters, here are
the most common :

- `shape` : The shape. (Mandatory)
- `position` : World space position.
- `mass` : The mass, 0 by default => **static**.
- `material` : The physics material => defines how it interacts with other bodies.
- `quaternion` : World space orientation.
- `velocity` : Default velocity.

### 3. Contact material

The idea is to create a [material](https://pmndrs.github.io/cannon-es/docs/classes/world.html#materials) for each type
of material you have in the scene.

For instance you could create a `plastic` material, or a `ball` material.

```typescript
const plasticMaterial = new Material('plastic');
const goldMaterial    = new Material('gold');

const plasticGoldContactMaterial = new ContactMaterial(
  plasticMaterial,
  goldMaterial,
  {
    friction: 0.1,    // Friction coefficient (frottement)
    restitution: 0.7  // Bouncing coefficient
  }
)
world.addContactMaterial(plasticGoldContactMaterial); // Before using it, we must add it to the world
body.material = plasticGoldContactMaterial; // Or directly in the constructor
```

You can also use a default material for all bodies :

```typescript
const defaultMaterial        = new Material('default');
const defaultContactMaterial = new ContactMaterial(
  defaultMaterial, defaultMaterial,
  {
    ...
  }
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;
```

### 4. Updating objects

To update our [World](https://pmndrs.github.io/cannon-es/docs/classes/world.html), we must use the `step()` method. The
code behind this method is explained [here](https://gafferongames.com/post/fix_your_timestep/).

Here's the signature :

`step(timeStep: number, timeSinceLastCall?: number, maxSubSteps?: number): void`

- `timeStep` : The **fixed step** size to use, for instance 1/60.
- `teimeSinceLastCall` : Time elapsed since the function was last called.
- `maxSubSteps` : Maximum number of fixed steps to take per function call.

```typescript
const clock        = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime   = elapsedTime - oldElapsedTime;
  oldElapsedTime    = elapsedTime;

  // Update physics
  world.step(1 / 60, deltaTime, 3);

  // Better use a helper function to copy Cannon vector => Three vector 
  sphere.position.x = sphereBody.position.x;
  sphere.position.y = sphereBody.position.y;
  sphere.position.z = sphereBody.position.z;

  // Same for quaternion...
}
```

#### Events

You can listen to events on the `Body`. Here are the available events :

- `collide` : Emitted when a collision occurs.
- `sleep` : Emitted when the object stops moving.
- `wakeup` : Emitted when the object starts moving.

`body.addEventListener('collide', playHitSound);`

/ ! \ Don't forget to remove the listener when removing the
object : `object.body.removeEventListener('collide', playHitSound);`.

#### Applying forces

There are many ways to apply force to a `Body` :

- `applyForce` : Applies a force to a body from a specified point in space (not necessarily on the Body's surface).
- `applyImpulse` : Like `applyForce`, but instead applies directly to the velocity.
- `applyLocalForce` : Like `applyForce`, but instead the coordinates are local to the Body (meaning that `0, 0, 0` would
  be the center of the body).
- `ApplyLocalImpulse` : Fusion of `applyImpulse` and `applyLocalForce`.

#### Handling multiple objects

Simply use an array, which for instance contains all meshes and associated bodies :

```typescript
const objectsToUpdate = [];
// ...
objectsToUpdate.push({mesh, body});
// ...
const tick = () => {
// ...
  world.step(1 / 60, deltaTime, 3);

  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
  }
}
```

#### Constraints

Enable constraints between two bodies. Here's the list of constraints:

- `HingeConstraint` : Acts like a door hinge.
- `DistanceConstraint` : Forces the bodies to keep a distance between each other.
- `LockConstraint` : Merges the bodies like if they were one piece.
- `PointToPointConstraint` : Glues the bodies to a specific point.

### Performance

- Reuse Three.js geometries and materials when possible.
- Reuse Cannon.js shapes when possible.
- Use **web-workers** to run the physics in a separate thread.
  Many [examples](https://surma.dev/things/omt-for-three-xr/index.html) are available on the net.
- Use a better Broadphase algorithm : **Naive** is used as default.
  `world.broadphase = new SAPBroadphase(world);`.

|                                   Broadphase                                        |       Pro       | Con |
| ----------------------------------------------------------------------------------- | ---             | --- |
| [Naive](https://pmndrs.github.io/cannon-es/docs/classes/naivebroadphase.html#world) | Default         | O(n²) complexity |
| [Grid](https://pmndrs.github.io/cannon-es/docs/classes/gridbroadphase.html)         | Performance +   |  |
| [SAP](https://pmndrs.github.io/cannon-es/docs/classes/sapbroadphase.html)           | Performance ++  | Very rare bugs when objects are very fast, test it ! |

- Allows sleep. Per default all bodies are tested, even those who aren't moving anymore. `world.allowSleep = true;`.

### Comparison of physics engines

|                            Name                                 | Features | Popularity |  Performance   | Lightweight | Ease of use |
| --------------------------------------------------------------- | -------- | ---------- | -------------- | ----------- | ----------- |
| [Cannon-es](https://pmndrs.github.io/cannon-es/docs/index.html) | +        | +          | +              | +           | +           |
| [Ammo.js](https://github.com/kripken/ammo.js/)                  | ++       | ++         | +++            | --          | --          |
| [Enable3D](https://enable3d.io/) (uses ammo.js)                 | ++       | -          | ++ (no worker) | ---         | ++          |
