import { IRefPhaserGame, PhaserGame } from "@/game/PhaserGame";
import { Game } from "@/game/scenes/Game";
import { Script } from "@/types";
import { useRef, useState } from "react";
import { PlantModal } from "./PlantModal";
import { EventBus } from "@/game/EventBus";
import { FarmPlot } from "@/game/objects/FarmPlot";
import { GiveModal } from "./GiveModal";
import { Character } from "@/game/objects/Character";

export const GameView = () => {
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
  const [isGiveModalOpen, setIsGiveModalOpen] = useState(false);

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
    // Listen for agent-selected
    EventBus.on("agent-selected", (scene: Game) => {
      const agent = scene?.selectedObject as Character;
      console.log("Agent selected", agent);
      setIsGiveModalOpen(true);
    });
    return () => {
      EventBus.removeListener("farm-plot-selected");
      EventBus.removeListener("agent-selected");
    };
  };

  return (
    <div className="flex justify-center">
      <PlantModal isOpen={isPlantModalOpen} setIsOpen={setIsPlantModalOpen} />
      <GiveModal isOpen={isGiveModalOpen} setIsOpen={setIsGiveModalOpen} />
      <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
    </div>
  );
};
