import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { Character } from "../objects/Character";
import { agentKeys } from "@/constants";
import { AgentInstruction, Script } from "@/types";
import { FarmPlot } from "../objects/FarmPlot";

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
      y: mapLayer.height / 2 - 100,
      key: "player",
    });
    this.physics.add.existing(player);
    this.player = player;
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

    // Agents
    const agentBoundsPadding = 100;
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
        farmPlot.setIndex(x * y);
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

    EventBus.emit("current-scene-ready", this);
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
    // Update player
    this.player.update(delta);
    // Update agents
    Object.values(this.agents).forEach((agent) => {
      agent.update(delta);
    });
  }
}
