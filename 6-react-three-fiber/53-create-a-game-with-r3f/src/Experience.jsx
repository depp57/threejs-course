import Lights from "./Lights.jsx";
import Level, { BlockAxe, BlockLimbo, BlockSpinner } from "./Level.jsx";
import { Physics } from "@react-three/rapier";
import Player from "./Player.jsx";
import useGame from "./stores/useGame.js";

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  return (
    <>
      <color args={["#bdedfc"]} attach="background" />

      <Physics>
        <Lights />

        <Level
          count={blocksCount}
          seed={blocksSeed}
          types={[BlockAxe, BlockLimbo, BlockSpinner]}
        />

        <Player />
      </Physics>
    </>
  );
}
