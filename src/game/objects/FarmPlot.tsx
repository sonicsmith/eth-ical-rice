import { PLANT_GROWTH_TIME, RICE_GROWTH_TIME } from "@/constants";

export class FarmPlot extends Phaser.GameObjects.Sprite {
  index: number | undefined;
  plant: Phaser.GameObjects.Sprite | undefined;
  plantNumber: number | undefined;
  plantedAt: number = 0;

  constructor(config: any) {
    super(config.scene, config.x, config.y, "dirt", 12);
    config.scene.add.existing(this);
    this.setInteractive();
    this.setDepth(1);
  }

  setIndex(index: number) {
    this.index = index;
  }

  setPlant(time: number, plantNumber: number) {
    this.plant?.destroy();
    this.setTint(Phaser.Display.Color.GetColor(255, 255, 255));
    this.plantedAt = time;
    if (time > 0) {
      this.plantNumber = plantNumber;
      const currentTime = Date.now() / 1000;
      const growTime = Math.min(currentTime - time, PLANT_GROWTH_TIME);
      const NUMBER_FRAMES = 5;
      // Rice plant looks like wheat plant
      const frameOffset = plantNumber < 2 ? plantNumber * 6 : 0;
      const frame =
        Math.ceil((growTime / PLANT_GROWTH_TIME) * NUMBER_FRAMES) + frameOffset;
      this.setTint(Phaser.Display.Color.GetColor(230, 230, 230));
      const plant = this.scene.add.sprite(this.x, this.y - 3, "plants", frame);
      plant.setDepth(2);
      this.plant = plant;
    }
  }

  getTimeTillHarvest() {
    const currentTime = Date.now() / 1000;
    const plantGrowTime =
      this.plantNumber === 2 ? RICE_GROWTH_TIME : PLANT_GROWTH_TIME;
    const growTime = Math.min(currentTime - this.plantedAt, plantGrowTime);
    return PLANT_GROWTH_TIME - growTime;
  }
}
