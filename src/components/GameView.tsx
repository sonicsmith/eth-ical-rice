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

  const [uiValues, setUiValues] = useState({
    wheatSeeds: 0,
    tomatoSeeds: 0,
    riceSeeds: 0,
    riceSupply: 0,
  });

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
    // Listen for seed-picked
    EventBus.on("seed-picked", (scene: Game) => {
      setUiValues({
        wheatSeeds: scene.seedCount.wheat,
        tomatoSeeds: scene.seedCount.tomato,
        riceSeeds: scene.seedCount.rice,
        riceSupply: scene.riceSupply,
      });
    });
    return () => {
      EventBus.removeListener("farm-plot-selected");
      EventBus.removeListener("agent-selected");
      EventBus.removeListener("seed-picked");
    };
  };

  return (
    <div className="flex justify-center">
      <PlantModal isOpen={isPlantModalOpen} setIsOpen={setIsPlantModalOpen} />
      <GiveModal isOpen={isGiveModalOpen} setIsOpen={setIsGiveModalOpen} />
      <div className="border-4 border-black rounded-xl">
        <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
      </div>
    </div>
  );
};
