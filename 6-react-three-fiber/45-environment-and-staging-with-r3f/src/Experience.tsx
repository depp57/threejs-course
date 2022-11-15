import { useFrame } from "@react-three/fiber";
import {
  AccumulativeShadows,
  BakeShadows,
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  RandomizedLight,
  Sky,
  softShadows,
  Stage,
  useHelper,
} from "@react-three/drei";
import { useRef } from "react";
import { Perf } from "r3f-perf";
import { DirectionalLight, DirectionalLightHelper, Mesh } from "three";
import { useControls } from "leva";

// softShadows({
//   frustum: 3.75,
//   size: 0.005,
//   near: 9.5,
//   samples: 17,
//   rings: 11,
// });

export default function Experience() {
  const cube = useRef<Mesh>(null!);
  const directionalLight = useRef<DirectionalLight>(null!);
  // // useHelper(directionalLight, DirectionalLightHelper, 1, "#900000");
  //
  // useFrame((state, delta) => {
  //   // const time = state.clock.elapsedTime;
  //   cube.current.rotation.y += delta * 0.2;
  //   // cube.current.position.x = Math.sin((time * Math.PI) / 2) + 2; // from 1 to 3, every 4 seconds
  // });
  //
  // const { color, opacity, blur } = useControls("contact shadows", {
  //   color: "#1d8f75",
  //   opacity: { value: 0.4, min: 0, max: 1 },
  //   blur: { value: 2.8, min: 0, max: 10 },
  // });
  //
  // const { sunPosition } = useControls("sky", {
  //   sunPosition: { value: [1, 2, 3] },
  // });
  //
  // const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } =
  //   useControls("environment map", {
  //     envMapIntensity: { value: 1, min: 0, max: 12 },
  //     envMapHeight: { value: 7, min: 0, max: 100 },
  //     envMapRadius: { value: 20, min: 10, max: 1000 },
  //     envMapScale: { value: 100, min: 10, max: 1000 },
  //   });
  //
  // const envMapNumber = 1;

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      {/*<Environment*/}
      {/*  // background*/}
      {/*  ground={{*/}
      {/*    height: envMapHeight,*/}
      {/*    radius: envMapRadius,*/}
      {/*    scale: envMapScale,*/}
      {/*  }}*/}
      {/*  // files={[*/}
      {/*  //   `./environmentMaps/${envMapNumber}/px.jpg`,*/}
      {/*  //   `./environmentMaps/${envMapNumber}/nx.jpg`,*/}
      {/*  //   `./environmentMaps/${envMapNumber}/py.jpg`,*/}
      {/*  //   `./environmentMaps/${envMapNumber}/ny.jpg`,*/}
      {/*  //   `./environmentMaps/${envMapNumber}/pz.jpg`,*/}
      {/*  //   `./environmentMaps/${envMapNumber}/nz.jpg`,*/}
      {/*  // ]}*/}
      {/*  // files="./environmentMaps/the_sky_is_on_fire_2k.hdr"*/}
      {/*  preset="sunset"*/}
      {/*>*/}
      {/*  /!*<mesh position-z={-5} scale={10}>*!/*/}
      {/*  /!*  <planeGeometry />*!/*/}
      {/*  /!*  <meshBasicMaterial color={[5, 0, 0]} />*!/*/}
      {/*  /!*</mesh>*!/*/}
      {/*  <Lightformer*/}
      {/*    position-z={-5}*/}
      {/*    scale={10}*/}
      {/*    color="red"*/}
      {/*    intensity={7}*/}
      {/*    form="ring"*/}
      {/*  />*/}
      {/*</Environment>*/}

      {/*<Sky sunPosition={sunPosition} />*/}

      {/*<AccumulativeShadows*/}
      {/*  position={[0, -0.99, 0]}*/}
      {/*  color="#316d39"*/}
      {/*  opacity={0.8}*/}
      {/*  frames={Infinity}*/}
      {/*  blend={100}*/}
      {/*  temporal*/}
      {/*>*/}
      {/*  <RandomizedLight*/}
      {/*    position={[1, 2, 3]}*/}
      {/*    bias={0.001}*/}
      {/*    intensity={1}*/}
      {/*    ambient={0.5}*/}
      {/*    radius={1}*/}
      {/*    amount={8}*/}
      {/*  />*/}
      {/*</AccumulativeShadows>*/}

      {/*<BakeShadows />*/}

      {/*<ContactShadows*/}
      {/*  position={[0, -0.99, 0]}*/}
      {/*  resolution={1024}*/}
      {/*  far={5}*/}
      {/*  color={color}*/}
      {/*  opacity={opacity}*/}
      {/*  blur={blur}*/}
      {/*/>*/}

      {/*<color args={["ivory"]} attach="background" />*/}

      {/*<directionalLight*/}
      {/*  ref={directionalLight}*/}
      {/*  position={sunPosition}*/}
      {/*  intensity={1.5}*/}
      {/*  castShadow*/}
      {/*  shadow-mapSize={[1024, 1024]}*/}
      {/*  shadow-camera-near={1}*/}
      {/*  shadow-camera-far={10}*/}
      {/*  shadow-camera-top={5}*/}
      {/*  shadow-camera-right={5}*/}
      {/*  shadow-camera-bottom={-5}*/}
      {/*  shadow-camera-left={-5}*/}
      {/*/>*/}
      {/*<ambientLight intensity={0.5} />*/}

      <Stage>
        <mesh castShadow position-x={-2} position-y={1}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>

        <mesh castShadow ref={cube} position-x={2} position-y={1} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </Stage>

      {/*<mesh position-y={0} rotation-x={-Math.PI * 0.5} scale={10}>*/}
      {/*  <planeGeometry />*/}
      {/*  <meshStandardMaterial*/}
      {/*    color="greenyellow"*/}
      {/*    envMapIntensity={envMapIntensity}*/}
      {/*  />*/}
      {/*</mesh>*/}
    </>
  );
}
