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
import { MINUTE_MS, PLANT_TYPES } from "@/constants";
import { getCapitalized } from "@/utils/getCapitalized";
import { usePlantSeed } from "@/hooks/usePlantSeed";
import { useFarmPlots } from "@/hooks/useFarmPlots";
import { usePlantSupply } from "@/hooks/usePlantSupply";
import { getChainIds } from "@/utils/getChainIds";
import { useGiveToAgent } from "@/hooks/useGiveToAgent";
import { useDonateRice } from "@/hooks/useDonateRice";
import { useRiceSeedCount } from "@/hooks/useRiceSeedCount";
import { useHarvestPlant } from "@/hooks/useHarvestPlant";

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

  const { data: farmPlots, refetch: refetchFarmPlots } = useFarmPlots(address!);
  const { data: plantSupply, refetch: refetchPlantSupply } = usePlantSupply(
    address!
  );
  const { data: riceSeedCount, refetch: refetchRiceSeedCount } =
    useRiceSeedCount(address!);

  // Wait for transaction to complete
  const transactionReceipt = useWaitForTransactionReceipt({
    hash: transactionHash,
    chainId: getChainIds().xai,
  });

  // Refetch data on transaction completion
  useEffect(() => {
    refetchFarmPlots();
    refetchPlantSupply();
    refetchRiceSeedCount();
  }, [
    transactionReceipt.data,
    refetchFarmPlots,
    refetchPlantSupply,
    refetchRiceSeedCount,
  ]);

  const plantSeed = usePlantSeed(selectedFarmPlot);
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

  const harvestPlant = useHarvestPlant();
  const harvestPlantAndRefresh = useCallback(
    async (farmPlot: FarmPlot) => {
      const hash = await harvestPlant(farmPlot);
      setTransactionHash(hash);
    },
    [harvestPlant]
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
    [giveToAgent]
  );

  const donateRice = useDonateRice();
  const donateRiceAndRefresh = useCallback(async () => {
    const hash = await donateRice();
    setTransactionHash(hash);
  }, [donateRice, setTransactionHash]);

  // Update Farm Plots
  useEffect(() => {
    if (farmPlots && gameScene) {
      const farmPlotsData = farmPlots.map((data) => ({
        time: Number(data.time),
        plantType: data.plantType,
      }));
      console.log("Updating Farm plots", farmPlotsData);
      gameScene.updateFarmPlots(farmPlotsData);
    }
  }, [farmPlots, gameScene]);

  // Update Plant Supply
  useEffect(() => {
    if (plantSupply && gameScene) {
      const plantSupplyData = plantSupply.map((data) => data);
      console.log("Updating Plant Supply", plantSupplyData);
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

  // Update Rice Seed Count
  useEffect(() => {
    console.log("Got Rice seed count", riceSeedCount);
    if (riceSeedCount && gameScene) {
      const rice = Number(riceSeedCount);
      gameScene.seedCount.rice = rice;
      setGameState((oldState) => {
        return {
          ...oldState,
          seeds: {
            ...oldState.seeds,
            rice,
          },
        };
      });
      gameScene.updateUI();
    }
  }, [riceSeedCount, gameScene]);

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

      // If the farm plot is already planted
      if (!!farmPlot.plant) {
        const isReadyToHarvest = farmPlot.isReadyToHarvest;
        if (isReadyToHarvest) {
          harvestPlantAndRefresh(farmPlot);
        } else {
          const plantNumber = farmPlot.plantNumber!;
          const plantName = PLANT_TYPES[plantNumber];
          const timeToGo = (farmPlot.getTimeToHarvest() / 60).toFixed(0);
          toast({
            title: getCapitalized(plantName),
            description: `${timeToGo} minutes till harvest`,
          });
        }
      } else {
        setSelectedFarmPlot(farmPlot);
        setIsPlantModalOpen(true);
      }
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

    const refreshData = () => {
      console.log("Refetching onchain data");
      refetchFarmPlots();
      refetchPlantSupply();
      refetchRiceSeedCount();
    };
    const timerId = setInterval(() => {
      refreshData();
    }, MINUTE_MS * 10);
    refreshData();

    return () => {
      EventBus.removeListener("farm-plot-selected");
      EventBus.removeListener("character-selected");
      EventBus.removeListener("seed-picked");
      clearInterval(timerId);
    };
  };

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
