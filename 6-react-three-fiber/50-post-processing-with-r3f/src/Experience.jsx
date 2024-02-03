import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { EffectComposer, ToneMapping } from "@react-three/postprocessing";
import Drunk from "./Drunk.jsx";
import { useRef } from "react";
import { useControls } from "leva";

export default function Experience() {
  const drunkRef = useRef();
  const drunkProps = useControls("Drunk Effect", {
    frequency: { value: 2, min: 1, max: 20 },
    amplitude: { value: 0.1, min: 0, max: 0.5 },
  });

  return (
    <>
      <EffectComposer disableNormalPass>
        {/*<Vignette*/}
        {/*  offset={0.3}*/}
        {/*  darkness={0.9}*/}
        {/*  blendFunction={BlendFunction.NORMAL}*/}
        {/*/>*/}
        {/*<Glitch*/}
        {/*  delay={[1, 2]}*/}
        {/*  duration={[0.1, 0.3]}*/}
        {/*  strength={[0.2, 0.4]}*/}
        {/*  mode={GlitchMode.SPORADIC}*/}
        {/*/>*/}
        {/*<Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} />*/}
        {/*<Bloom luminanceThreshold={1.1} mipmapBlur intensity={0.5} />*/}
        {/*<DepthOfField*/}
        {/*  focusDistance={0.025}*/}
        {/*  focalLength={0.025}*/}
        {/*  bokehScale={6}*/}
        {/*/>*/}
        <Drunk ref={drunkRef} {...drunkProps} />
        <ToneMapping />
      </EffectComposer>

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial
          color="purple"
          // emissive="orange"
          // emissiveIntensity={2}
        />
      </mesh>

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
