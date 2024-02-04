import { RigidBody, useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import useGame from "./stores/useGame.js";

export default function Player() {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const body = useRef();
  const { rapier, world } = useRapier();

  const [smoothedCameraPosition] = useState(() => new Vector3(10, 10, 10));
  const [smoothedCameraTarget] = useState(() => new Vector3());

  const start = useGame((state) => state.start);
  const restart = useGame((state) => state.restart);
  const end = useGame((state) => state.end);
  const blocksCount = useGame((state) => state.blocksCount);

  function reset() {
    body.current.setTranslation({ x: 0, y: 1, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
  }

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (phase) => {
        if (phase === "ready") {
          reset();
        }
      },
    );

    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (hasJumped) => {
        if (hasJumped) {
          const origin = body.current.translation();
          origin.y -= 0.31;
          const direction = { x: 0, y: -1, z: 0 };
          const ray = new rapier.Ray(origin, direction);
          const hit = world.castRay(ray, 10, true);

          if (hit.toi < 0.15) {
            body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
          }
        }
      },
    );

    const unsubscribeAny = subscribeKeys(() => {
      start();
    });

    return () => {
      unsubscribeJump();
      unsubscribeReset();
      unsubscribeAny();
    };
  }, []);

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }

    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }

    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);

    /**
     * Camera
     */
    const bodyPosition = body.current.translation();

    const cameraPosition = new Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 3;
    cameraPosition.y += 0.75;

    const cameraTarget = new Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.3;

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);

    /**
     * Phases
     */
    if (bodyPosition.z < -(blocksCount * 4 + 2)) {
      end();
    }

    if (bodyPosition.y < -4) {
      restart();
    }
  });

  return (
    <RigidBody
      ref={body}
      colliders="ball"
      canSleep={false}
      position={[0, 1, 0]}
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow={true}>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumPurple" />
      </mesh>
    </RigidBody>
  );
}
