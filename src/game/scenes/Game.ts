import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { Character } from "../objects/Character";
import { agentKeys, MINUTE_MS } from "@/constants";
import { AgentInstruction, Script } from "@/types";
import { FarmPlot } from "../objects/FarmPlot";

const TEN_MINUTES = 10 * MINUTE_MS;

export class Game extends Scene {
  mapLayer: Phaser.Tilemaps.TilemapLayer;
  player: Character;
  agents: Record<string, Character> = {};
  seedCount = {
    wheat: 0,
    tomato: 0,
    rice: 0,
  };
  supplyCount = {
    wheat: 0,
    tomato: 0,
    rice: 0,
  };
  agentInstructions: AgentInstruction[] = [];
  agentInstructionsIndex: number = 0;
  personInNeed: string = "";
  foodNeeded: string = "";
  amountNeeded: number = 0;
  selectedObject: Phaser.GameObjects.GameObject | null = null;
  uiText: Phaser.GameObjects.Text;
  farmPlots: FarmPlot[] = [];
  playersAddress: `0x${string}` | undefined;
  farmUpdateTime: number = 0;

  constructor() {
    super("Game");
  }

  create() {
    // Map Layer
    const map = this.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16,
    });
    const tileset = map.addTilesetImage("tiles");
    if (!tileset) {
      throw new Error("Tileset not found");
    }
    const mapLayer = map.createLayer(0, tileset, 0, 0);
    if (!mapLayer) {
      throw new Error("Layer not found");
    }
    mapLayer.skipCull = true;
    this.cameras.main.setBounds(0, 0, mapLayer.width, mapLayer.height);
    this.mapLayer = mapLayer;

    // Player
    const player = new Character({
      scene: this,
      x: mapLayer.width / 2,
      y: mapLayer.height / 2 - 200,
      key: "player",
    });
    this.physics.add.existing(player);
    this.player = player;
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

    // Agents
    const agentBoundsPadding = 300;
    const agentBoundsX = mapLayer.width - agentBoundsPadding * 2;
    const agentBoundsY = mapLayer.height - agentBoundsPadding * 2;
    agentKeys.forEach((key) => {
      const agent = new Character({
        scene: this,
        x: Math.random() * agentBoundsX + agentBoundsPadding,
        y: Math.random() * agentBoundsY + agentBoundsPadding,
        key,
      });
      agent.play(`${key}-idle-down-anim`);
      this.agents[key] = agent;
    });

    // Seeds
    for (let i = 0; i < 5; i++) {
      this.createSeed();
    }

    // Farm
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const farmPlot = new FarmPlot({
          scene: this,
          x: mapLayer.width / 2 + (x - 1.5) * 32,
          y: mapLayer.height / 2 + (y - 1.5) * 32,
        });
        farmPlot.setIndex(this.farmPlots.length);
        this.farmPlots.push(farmPlot);
      }
    }

    this.input.on(
      "pointerdown",
      (
        pointer: Phaser.Input.Pointer,
        objectsClicked: Phaser.GameObjects.GameObject[]
      ) => {
        this.selectedObject = objectsClicked[0] || null;

        if (this.selectedObject instanceof FarmPlot) {
          console.log("Farm plot clicked", this.selectedObject.index);
          EventBus.emit("farm-plot-selected", this);
        }

        if (this.selectedObject instanceof Character) {
          console.log("Character clicked", this.selectedObject);
          EventBus.emit("character-selected", this);
        }

        // Move Player
        console.log("pointerdown", pointer);
        const x = pointer.worldX;
        const y = pointer.worldY;
        this.player.setDestination({ x, y });
      }
    );

    // UI
    // Define box dimensions
    const boxWidth = 200;
    const boxHeight = 130;
    const boxX = 10;
    const boxY = 10;

    // Create a black border
    const border = this.add.graphics();
    border.lineStyle(4, 0x000000); // black border color
    border.strokeRect(boxX, boxY, boxWidth, boxHeight);
    border.setDepth(15);

    // Create a white background box
    const background = this.add.graphics();
    background.fillStyle(0xffffff, 1); // white fill
    background.fillRect(boxX, boxY, boxWidth, boxHeight);
    background.setDepth(15);

    const text = this.add.text(20, 20, "", {
      fontFamily: "Arial",
      fontSize: 16,
      color: "#000000",
    });
    text.setDepth(20);
    this.uiText = text;

    const container = this.add.container(0, 0, [border, background, text]);
    container.setScrollFactor(0);
    container.setDepth(20);

    this.updateUI();

    EventBus.emit("current-scene-ready", this);
  }

  updateUI() {
    this.uiText.setText(
      `Wheat Seeds: ${this.seedCount.wheat}\n` +
        `Tomato Seeds: ${this.seedCount.tomato}\n` +
        `Rice Seeds: ${this.seedCount.rice}\n` +
        `Wheat bundles: ${this.supplyCount.wheat}\n` +
        `Tomatoes: ${this.supplyCount.tomato}\n` +
        `Rice grains: ${this.supplyCount.rice}`
    );
  }

  async updateFarmPlots() {
    // Get data from server
    const response = await fetch(`/api/farm/${this.playersAddress}`).then(
      (res) => res.json()
    );
    const farmPlots = response as { time: number; plantType: number }[];
    console.log("Updating Farm plots", farmPlots);
    farmPlots.forEach(({ time, plantType }, index) => {
      if (time > 0) {
        this.farmPlots[index].setPlant(time, plantType);
      }
    });
  }

  createSeed() {
    const type = Math.random() > 0.5 ? "wheat" : "tomato";
    const seed = this.add.sprite(
      Math.random() * this.mapLayer.width,
      Math.random() * this.mapLayer.height,
      "plants",
      type === "wheat" ? 0 : 6
    );
    this.physics.add.existing(seed);

    this.physics.add.collider(seed, this.player, () => {
      console.log("Seed picked up", type);
      this.seedCount[type]++;
      this.updateUI();
      seed.destroy();
      setTimeout(() => {
        this.createSeed();
      }, 10_000);
      EventBus.emit("seed-picked", this);
    });
  }

  setTodaysScript(script: Script) {
    this.agentInstructions = script.agentInstructions;
    this.personInNeed = script.personInNeed;
    this.amountNeeded = script.amount;
    this.foodNeeded = script.foodType;
    this.updateAgents();
  }

  updateAgents() {
    const currentIndex = this.agentInstructionsIndex;
    this.agentInstructionsIndex++;
    if (currentIndex >= this.agentInstructions.length) {
      return;
    }
    const instructions = this.agentInstructions[currentIndex];
    const { talker, listener, message } = instructions;
    const talkerAgent = this.agents[talker];
    const listenerAgent = this.agents[listener];
    talkerAgent.talkTo(listenerAgent, message, this.updateAgents.bind(this));
  }

  update(time: number, delta: number) {
    // Update farm plots every 10 minutes
    this.farmUpdateTime += delta;
    if (this.farmUpdateTime > TEN_MINUTES) {
      this.farmUpdateTime = 0;
      this.updateFarmPlots();
    }
    // Update player
    this.player.update(delta);
    // Update agents
    Object.values(this.agents).forEach((agent) => {
      agent.update(delta);
    });
  }
}
