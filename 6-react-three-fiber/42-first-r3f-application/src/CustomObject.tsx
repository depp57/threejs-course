import { BufferGeometry, DoubleSide } from "three";
import { useEffect, useMemo, useRef } from "react";

export default function CustomObject() {
  const geometry = useRef<BufferGeometry>(null);
  const verticesCount = 10 * 3; // 3 vertices per triangle

  const positions = useMemo(() => {
    const positions = new Float32Array(verticesCount * 3); // 3 coordinates per vertex (x, y, z)

    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 3;
    }

    return positions;
  }, []);

  useEffect(() => {
    if (geometry.current) {
      geometry.current.computeVertexNormals();
    }
  }, []);

  return (
    <mesh>
      <bufferGeometry ref={geometry}>
        <bufferAttribute
          attach="attributes-position"
          count={verticesCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <meshStandardMaterial color="red" side={DoubleSide} />
    </mesh>
  );
}
