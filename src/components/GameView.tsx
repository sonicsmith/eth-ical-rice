import { IRefPhaserGame, PhaserGame } from "@/game/PhaserGame";
import { Game } from "@/game/scenes/Game";
import { PlantType, Script } from "@/types";
import { useCallback, useRef, useState } from "react";
import { PlantModal } from "./PlantModal";
import { EventBus } from "@/game/EventBus";
import { FarmPlot } from "@/game/objects/FarmPlot";
import { GiveModal } from "./GiveModal";
import { Character } from "@/game/objects/Character";
import { DonateModal } from "./DonateModal";
import { useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";

export const GameView = () => {
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
  const [isGiveModalOpen, setIsGiveModalOpen] = useState(false);
  const [selectedFarmPlot, setSelectedFarmPlot] = useState<FarmPlot | null>(
    null
  );
  const [selectedAgent, setSelectedAgent] = useState<Character | null>(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const [gameState, setGameState] = useState({
    wheatSeeds: 0,
    tomatoSeeds: 0,
    riceSeeds: 0,
    wheat: 0,
    tomato: 0,
    rice: 0,
  });

  const { address } = useAccount();
  const { signMessage } = usePrivy();

  const plantSeed = useCallback(
    async (plantType: PlantType) => {
      if (!selectedFarmPlot) {
        throw new Error("No farm plot selected");
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const message = JSON.stringify({
        plantType,
        timestamp,
        plotIndex: selectedFarmPlot.index,
      });
      const { signature } = await signMessage({ message });
      await fetch("/api/plant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          signature,
          message,
        }),
      });
      // TODO: Display a message to the user that the plant was successful
    },
    [signMessage, selectedFarmPlot]
  );

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
      setSelectedFarmPlot(farmPlot);
      setIsPlantModalOpen(true);
    });
    // Listen for character-selected
    EventBus.on("character-selected", (scene: Game) => {
      const character = scene?.selectedObject as Character;
      console.log("Character selected", character);
      if (character.key === "player") {
        setIsDonateModalOpen(true);
      } else {
        setSelectedAgent(character);
        setIsGiveModalOpen(true);
      }
    });
    // Listen for seed-picked
    EventBus.on("seed-picked", (scene: Game) => {
      setGameState({
        wheatSeeds: scene.seedCount.wheat,
        tomatoSeeds: scene.seedCount.tomato,
        riceSeeds: scene.seedCount.rice,
        wheat: scene.supplyCount.wheat,
        tomato: scene.supplyCount.tomato,
        rice: scene.supplyCount.rice,
      });
    });
    return () => {
      EventBus.removeListener("farm-plot-selected");
      EventBus.removeListener("character-selected");
      EventBus.removeListener("seed-picked");
    };
  };

  return (
    <div className="flex justify-center">
      <PlantModal
        isOpen={isPlantModalOpen}
        setIsOpen={setIsPlantModalOpen}
        wheatSeeds={gameState.wheatSeeds}
        tomatoSeeds={gameState.tomatoSeeds}
        riceSeeds={gameState.riceSeeds}
        plantSeed={plantSeed}
      />
      <GiveModal
        isOpen={isGiveModalOpen}
        setIsOpen={setIsGiveModalOpen}
        wheat={gameState.wheat}
        tomato={gameState.tomato}
        playerName={selectedAgent?.key}
      />
      <DonateModal
        isOpen={isDonateModalOpen}
        setIsOpen={setIsDonateModalOpen}
        rice={gameState.rice}
      />
      <div className="border-4 border-black rounded-xl">
        <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
      </div>
    </div>
  );
};
