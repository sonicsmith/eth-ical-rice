import { IRefPhaserGame, PhaserGame } from "@/game/PhaserGame";
import { useRef } from "react";

export const GameView = () => {
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  // Run on start
  const currentScene = (scene: Phaser.Scene) => {
    //
  };

  return (
    <div className="flex justify-center">
      <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
    </div>
  );
};
