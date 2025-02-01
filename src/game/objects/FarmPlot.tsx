export class FarmPlot extends Phaser.GameObjects.Sprite {
  index: number;

  constructor(config: any) {
    super(config.scene, config.x, config.y, "dirt", 12);
    config.scene.add.existing(this);
    this.setInteractive();
    this.setDepth(1);
  }

  setIndex(index: number) {
    this.index = index;
  }
}
