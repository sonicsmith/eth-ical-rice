import { IRefPhaserGame, PhaserGame } from "@/game/PhaserGame";
import { Game } from "@/game/scenes/Game";
import { PlantType, Script } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlantModal } from "./PlantModal";
import { EventBus } from "@/game/EventBus";
import { FarmPlot } from "@/game/objects/FarmPlot";
import { GiveModal } from "./GiveModal";
import { Character } from "@/game/objects/Character";
import { DonateModal } from "./DonateModal";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "@/hooks/use-toast";
import { PLANT_TYPES } from "@/constants";
import { getCapitalized } from "@/utils/getCapitalized";
import { usePlantSeed } from "@/hooks/usePlantSeed";
import { useFarmPlots } from "@/hooks/useFarmPlots";
import { usePlantSupply } from "@/hooks/usePlantSupply";
import { getChainIds } from "@/utils/getChainIds";
import { useGiveToAgent } from "@/hooks/useGiveToAgent";
import { useDonateRice } from "@/hooks/useDonateRice";

const defaultGameState = {
  seeds: {
    wheat: 0,
    tomato: 0,
    rice: 0,
  },
  plants: {
    wheat: 0,
    tomato: 0,
    rice: 0,
  },
};

export const GameView = () => {
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [gameScene, setGameScene] = useState<Game | null>(null);
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
  const [isGiveModalOpen, setIsGiveModalOpen] = useState(false);
  const [selectedFarmPlot, setSelectedFarmPlot] = useState<FarmPlot | null>(
    null
  );
  const [selectedAgent, setSelectedAgent] = useState<Character | null>(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [gameState, setGameState] = useState(defaultGameState);
  const [transactionHash, setTransactionHash] = useState<`0x${string}`>("0x0");

  const { address } = useAccount();
  const { signMessage } = usePrivy();
  const { toast } = useToast();

  const plantSeed = usePlantSeed(selectedFarmPlot);
  const { data: farmPlots, refetch: refetchFarmPlots } = useFarmPlots(address!);
  const { data: plantSupply, refetch: refetchPlantSupply } = usePlantSupply(
    address!
  );

  // Wait for transaction to complete
  const transactionReceipt = useWaitForTransactionReceipt({
    hash: transactionHash,
    chainId: getChainIds().xai,
  });

  useEffect(() => {
    refetchFarmPlots();
    refetchPlantSupply();
  }, [transactionReceipt.data]);

  const plantSeedAndRefresh = useCallback(
    async (plantType: PlantType) => {
      const hash = await plantSeed(plantType);
      setTransactionHash(hash);
      if (gameScene) {
        gameScene.seedCount[plantType]--;
        setGameState((oldState) => {
          return {
            ...oldState,
            seeds: {
              ...oldState.seeds,
              [plantType]: oldState.seeds[plantType] - 1,
            },
          };
        });
        gameScene.updateUI();
      }
    },
    [plantSeed, gameScene]
  );

  const giveToAgent = useGiveToAgent();
  const giveToAgentAndRefresh = useCallback(
    async ({
      amount,
      plantType,
      agent,
    }: {
      amount: number;
      plantType: PlantType;
      agent: string;
    }) => {
      const hash = await giveToAgent({ amount, plantType, agent });
      setTransactionHash(hash);
    },
    [giveToAgent, gameScene]
  );

  const donateRice = useDonateRice();
  const donateRiceAndRefresh = useCallback(async () => {
    const hash = await donateRice();
    setTransactionHash(hash);
  }, [giveToAgent, gameScene]);

  // Get Farm Plots
  useEffect(() => {
    console.log("Got Farm plots", farmPlots);
    if (farmPlots && gameScene) {
      const farmPlotsData = farmPlots.map((data) => ({
        time: Number(data.time),
        plantType: data.plantType,
      }));
      gameScene.updateFarmPlots(farmPlotsData);
    }
  }, [farmPlots, gameScene]);

  // Get Plant Supply
  useEffect(() => {
    console.log("Got Plant supply", plantSupply);
    if (plantSupply && gameScene) {
      const plantSupplyData = plantSupply.map((data) => data);
      setGameState((oldState) => {
        return {
          ...oldState,
          plants: {
            wheat: plantSupplyData[0],
            tomato: plantSupplyData[1],
            rice: plantSupplyData[2],
          },
        };
      });
      gameScene.updatePlantSupply(plantSupplyData);
    }
  }, [plantSupply, gameScene]);

  // Game Scene Started
  useEffect(() => {
    if (gameScene) {
      console.log("Game scene started", gameScene);
    }
  }, [gameScene]);

  // Run on start
  const currentScene = (scene: Phaser.Scene) => {
    console.log("Current scene", !!scene);
    const _gameScene = scene as Game;

    // TODO: Handle this better
    if (!scene) return;
    if (!address) return;

    setGameScene(_gameScene);

    _gameScene.playersAddress = address;

    // Get today's script
    fetch("/api/script")
      .then((res) => res.json())
      .then((response: Script) => {
        _gameScene.setTodaysScript(response);
      });

    // Listen for farm-plot-selected
    EventBus.on("farm-plot-selected", async (scene: Game) => {
      const farmPlot = scene?.selectedObject as FarmPlot;
      console.log("Farm plot selected", farmPlot.index);

      const hasPlant = farmPlot.plant !== undefined;
      const isReadyToHarvest = farmPlot.isReadyToHarvest;

      if (hasPlant) {
        const plantNumber = farmPlot.plantNumber!;
        const plantName = PLANT_TYPES[plantNumber];
        if (isReadyToHarvest) {
          const message = JSON.stringify({
            timestamp: Math.floor(Date.now() / 1000),
            plotIndex: farmPlot.index,
          });
          const { signature } = await signMessage({ message });
          const response = await fetch("/api/harvest", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address,
              message,
              signature,
            }),
          });
          const data = await response.json();
          console.log("Harvest response", data);
          toast({
            title: getCapitalized(plantName),
            description: `You grew a ${plantName}!`,
          });
          setTransactionHash(data.hash);
        } else {
          toast({
            title: getCapitalized(plantName),
            description: `Your ${plantName} is growing`,
          });
        }
        return;
      }

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
        seeds: {
          wheat: scene.seedCount.wheat,
          tomato: scene.seedCount.tomato,
          rice: scene.seedCount.rice,
        },
        plants: {
          wheat: scene.plantSupply[0],
          tomato: scene.plantSupply[1],
          rice: scene.plantSupply[2],
        },
      });
    });
    return () => {
      EventBus.removeListener("farm-plot-selected");
      EventBus.removeListener("character-selected");
      EventBus.removeListener("seed-picked");
    };
  };
  console.log("plants", gameState.plants);
  return (
    <div className="flex justify-center">
      <PlantModal
        isOpen={isPlantModalOpen}
        setIsOpen={setIsPlantModalOpen}
        seeds={gameState.seeds}
        plantSeed={plantSeedAndRefresh}
      />
      <GiveModal
        isOpen={isGiveModalOpen}
        setIsOpen={setIsGiveModalOpen}
        plants={gameState.plants}
        agentName={selectedAgent?.key}
        giveToAgent={giveToAgentAndRefresh}
      />
      <DonateModal
        isOpen={isDonateModalOpen}
        setIsOpen={setIsDonateModalOpen}
        rice={gameState.plants.rice}
        donateRice={donateRiceAndRefresh}
      />
      <div className="border-4 border-black rounded-xl">
        <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
      </div>
    </div>
  );
};
