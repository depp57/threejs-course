# 05-transform-objects

`Object3D` class represents all 3d objects in threejs

`Camera`, `Mesh`, `Group` are `Object3D`

`Object3D.position` and `Object3D.scale` are `Vector3D`

We can rotate `Object3D` with an `Euler` angle, or a `Quaternion`

We can group `Object3D` with a `Group`, it allows us to perform grouped actions over each of these objects

We can make the camera to look at an specific object (it looks at the origin as default), with `Camera.lookAt(Object3D)`
