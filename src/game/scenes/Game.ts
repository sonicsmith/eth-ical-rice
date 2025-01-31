import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { Character } from "../objects/Character";

export class Game extends Scene {
  mapLayer: Phaser.Tilemaps.TilemapLayer;
  player: Character;

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
      x: 300,
      y: 350,
      key: "player",
    });
    this.player = player;
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

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
