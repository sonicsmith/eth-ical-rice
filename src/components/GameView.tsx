import { IRefPhaserGame, PhaserGame } from "@/game/PhaserGame";
import { Game } from "@/game/scenes/Game";
import { Script } from "@/types";
import { useRef } from "react";

export const GameView = () => {
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  // Run on start
  const currentScene = (scene: Phaser.Scene) => {
    fetch("/api/script")
      .then((res) => res.json())
      .then((response: Script) => {
        const gameScene = scene as Game;
        gameScene?.setTodaysScript(response);
      });
  };

  return (
    <div className="flex justify-center">
      <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
    </div>
  );
};
