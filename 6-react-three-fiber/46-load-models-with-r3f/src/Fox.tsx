import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { AnimationAction } from "three";
import { useControls } from "leva";

export default function Fox() {
  const model = useGLTF("./Fox/glTF-Binary/Fox.glb");
  const animations = useAnimations(model.animations, model.scene);

  const { animationName } = useControls({
    animationName: { options: animations.names },
  });

  useEffect(() => {
    const action = animations.actions[animationName] as AnimationAction;
    action.reset().fadeIn(0.5).play();

    return () => {
      action.fadeOut(0.5);
    };
  }, [animationName]);

  return (
    <primitive
      object={model.scene}
      scale={0.03}
      position={[-3, -0.5, 3]}
      rotation-y={0.3}
    />
  );
}
