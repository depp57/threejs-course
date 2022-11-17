import { MeshProps } from "@react-three/fiber";

export default function Placeholder(props: MeshProps) {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 1, 2, 2, 2]}></boxGeometry>
      <meshBasicMaterial wireframe color="red" />
    </mesh>
  );
}
