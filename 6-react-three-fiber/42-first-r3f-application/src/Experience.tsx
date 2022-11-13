import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import CustomObject from "./CustomObject";

export default function Experience() {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += (Math.PI * delta) / 2; // one rotation per 4 seconds
    }

    const angle = state.clock.elapsedTime;
    const camera = state.camera;
    const orbitalPeriod = 16; // 16 seconds per period

    camera.position.x = Math.sin((angle * Math.PI * 2) / orbitalPeriod) * 5;
    camera.position.z = Math.cos((angle * Math.PI * 2) / orbitalPeriod) * 5;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.3} />

      <group ref={group}>
        <mesh position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>

        <mesh position-x={2} rotation-y={Math.PI * 0.25} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial color="purple" />
        </mesh>
      </group>

      <mesh position-y={-1} rotation-x={(3 * Math.PI) / 2} scale={8}>
        <planeGeometry />
        <meshStandardMaterial color="green" />
      </mesh>

      <CustomObject />
    </>
  );
}
