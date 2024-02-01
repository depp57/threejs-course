import { useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useRef } from "react";

export default function Experience() {
  const cube = useRef();
  const hamburger = useGLTF("./hamburger.glb");
  console.log(hamburger);

  useFrame((state, delta) => {
    cube.current.rotation.y += delta * 0.2;
  });

  function eventHandler(event) {
    event.stopPropagation(); // stop propagation of the "ray" so it won't travel multiple objects
    event.object.material.color.set(`hsl(${Math.random() * 360}, 100%, 75%)`);
  }

  function togglePointer() {
    document.body.style.cursor =
      document.body.style.cursor === "pointer" ? "default" : "pointer";
  }

  function onPointerOnHamburger(event, type) {
    if (type === "in") {
      event.object.position.x += 3;
    } else {
      event.object.position.x -= 3;
    }
    event.stopPropagation();
  }

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <primitive
        object={hamburger.scene}
        scale={0.25}
        position-y={0.5}
        onPointerEnter={(event) => onPointerOnHamburger(event, "in")}
        onPointerLeave={(event) => onPointerOnHamburger(event, "out")}
      />

      <mesh
        position-x={-2}
        onClick={eventHandler}
        onPointerEnter={togglePointer}
        onPointerLeave={togglePointer}
      >
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh
        ref={cube}
        position-x={2}
        scale={1.5}
        onClick={eventHandler}
        onPointerEnter={togglePointer}
        onPointerLeave={togglePointer}
      >
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
