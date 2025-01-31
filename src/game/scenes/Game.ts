import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { Character } from "../objects/Character";
import { agentKeys } from "@/constants";

export class Game extends Scene {
  mapLayer: Phaser.Tilemaps.TilemapLayer;
  player: Character;
  agents: Record<string, Character> = {};

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
      y: mapLayer.height / 2,
      key: "player",
    });
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

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      console.log("pointerdown", pointer);
      const x = pointer.worldX;
      const y = pointer.worldY;
      this.player.setDestination({ x, y });
    });

    EventBus.emit("current-scene-ready", this);
  }

  changeScene() {
    this.scene.start("GameOver");
  }

  update(time: number, delta: number) {
    this.player.update(delta);
  }
}
