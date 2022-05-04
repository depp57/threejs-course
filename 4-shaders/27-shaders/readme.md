# 27-shaders

A shader is a program, written in [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language) which is
sent to the GPU, before being run in parallel.

In OpenGL/WebGL, they are a few type of shaders while in three.js we will only use two of them.

## Vertex shader

The vertex shader's purpose is to position the vertices of the geometry.

The main idea is to send the vertices positions, the mesh transformations (like its position, rotation, and scale),
the camera information (like its position, rotation, and field of view).

Then, the GPU will process all of this information in order to project the vertices on a 2D space.

#### Types of input data for the vertex shader

- **attribute** : data that changes between vertices *(position...)*.
- **uniform** : data that stays the same between each vertex *(camera, mesh transformation...)*.

In addition, **varying** is a special data type : this data is a bridge between vertex and fragment shader.

#### Example of a minimal vertex shader 

```glsl
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec3 uColor;

attribute vec3 position;

varying vec3 vColor;
...
void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); // gl_Position handles the final coordinate of the vertex
    vColor = uColor; // vColor will be sent to the fragment shader 
}
```

## Fragment shader

The fragment shader purpose is to color each visible fragment *(1 fragment could be a few pixels on the screen)* of the geometry.

The same fragment shader will be used for every visible fragment of the geometry.

#### Example of a fragment shader, associated with the above vertex shader

```glsl
precision mediump float; // Unlike the vertex shader, we must specify the precision (highp - mediump recommanded - lowp)

varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1.0); // 4th value is the alpha (transparency)
}
```

## Why writing our own shaders

Three.js materials try to cover as many situations as possible, but they have limitations.
If we want to break those limits, we have to write our own shaders.

It can also be for performance reasons. Materials like MeshStandardMaterial are very elaborate and involve a lot of code and calculations.
If we write our own shader, we can keep the features and calculations to the minimum. We have more control over the performance.
