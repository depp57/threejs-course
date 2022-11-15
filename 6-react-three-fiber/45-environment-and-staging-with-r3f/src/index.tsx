import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";

const root = ReactDOM.createRoot(
  document.querySelector("#root") as HTMLElement
);

// const created = ({ gl }: { gl: WebGLRenderer }) => {
//   gl.setClearColor("#5fa38d", 1);
// };

root.render(
  <Canvas
    shadows={false}
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [-4, 3, 6],
    }}
  >
    <Experience />
  </Canvas>
);
