import { IRefPhaserGame, PhaserGame } from "@/game/PhaserGame";
import { Game } from "@/game/scenes/Game";
import { Script } from "@/types";
import { useRef, useState } from "react";
import { PlantModal } from "./PlantModal";
import { EventBus } from "@/game/EventBus";
import { FarmPlot } from "@/game/objects/FarmPlot";

export const GameView = () => {
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);

  // Run on start
  const currentScene = (scene: Phaser.Scene) => {
    // Get today's script
    fetch("/api/script")
      .then((res) => res.json())
      .then((response: Script) => {
        const gameScene = scene as Game;
        gameScene?.setTodaysScript(response);
      });
    // Listen for farm-plot-selected
    EventBus.on("farm-plot-selected", (scene: Game) => {
      const farmPlot = scene?.selectedObject as FarmPlot;
      console.log("Farm plot selected", farmPlot.index);
      setIsPlantModalOpen(true);
    });
    return () => {
      EventBus.removeListener("farm-plot-selected");
    };
  };

  return (
    <div className="flex justify-center">
      <PlantModal isOpen={isPlantModalOpen} setIsOpen={setIsPlantModalOpen} />
      <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
    </div>
  );
};
