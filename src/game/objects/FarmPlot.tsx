import { PLANT_GROWTH_TIME } from "@/constants";

export class FarmPlot extends Phaser.GameObjects.Sprite {
  index: number | undefined;
  plant: Phaser.GameObjects.Sprite | undefined;
  isReadyToHarvest: boolean = false;
  plantNumber: number | undefined;

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
    this.plantNumber = plantNumber;
    this.isReadyToHarvest = false;
    const currentTime = Date.now() / 1000;
    const growTime = Math.min(currentTime - time, PLANT_GROWTH_TIME);
    if (growTime >= PLANT_GROWTH_TIME) {
      this.isReadyToHarvest = true;
    }
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
