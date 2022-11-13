import {
  Float,
  Html,
  MeshReflectorMaterial,
  OrbitControls,
  PivotControls,
  Text,
  TransformControls,
} from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";

export default function Experience() {
  const cube = useRef<Mesh>(null!);
  const sphere = useRef<Mesh>(null!);

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <PivotControls
        anchor={[0, 0, 0]}
        depthTest={false}
        lineWidth={3}
        scale={150}
        fixed={true}
        axisColors={["#9381ff", "#ff4d6d", "#7ae582"]}
      >
        <mesh ref={sphere} position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
          <Html
            position={[1, 1, 0]}
            wrapperClass="label"
            center
            distanceFactor={8}
            occlude={[sphere, cube]}
          >
            That's a sphere ✌️
          </Html>
        </mesh>
      </PivotControls>

      <mesh ref={cube} position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <TransformControls object={cube} mode="scale" />

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <MeshReflectorMaterial resolution={2048} mirror={0.75} color="cyan" />
      </mesh>

      <Float speed={3}>
        <Text
          font="./bangers-v20-latin-regular.woff"
          fontSize={1}
          position={[0, 2, -3]}
          maxWidth={2}
          textAlign="center"
        >
          I love R3F
          <meshNormalMaterial />
        </Text>
      </Float>
    </>
  );
}
