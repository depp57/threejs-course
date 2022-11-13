import React from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import "./style.css";
import Experience from "./Experience";
import { ACESFilmicToneMapping, sRGBEncoding } from "three";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Canvas
    // flat // disable tone mapping, default set to ACESFilmicToneMapping
    // dpr={[1, 2]} // device pixel ratio, between 1 and 2, default [1, 2]
    gl={{
      antialias: true, // true per default
      toneMapping: ACESFilmicToneMapping,
      outputEncoding: sRGBEncoding,
      alpha: true, // true per default, transparent background
    }}
    camera={{ fov: 90, near: 0.1, far: 100, position: [-5, 2, 0] }}
  >
    <Experience />
  </Canvas>
);
