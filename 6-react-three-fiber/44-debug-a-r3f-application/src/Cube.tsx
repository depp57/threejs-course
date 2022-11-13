export default function Cube({ scale = 1 }: { scale?: number }) {
  return (
    <mesh position-x={2} scale={scale}>
      <boxGeometry />
      <meshStandardMaterial color="mediumpurple" />
    </mesh>
  );
}
