import { getDirection } from "@/utils/getDirection";

const directions = ["up", "left", "down", "right"];

export class Character extends Phaser.GameObjects.Sprite {
  destination: { x: number; y: number } | null;
  key: string;

  constructor(config: any) {
    super(config.scene, config.x, config.y, config.key);
    this.key = config.key;
    config.scene.add.existing(this);
    // Animations
    directions.forEach((direction, index) => {
      // TODO: Fix sprite sheet to get correct idle
      this.anims.create({
        key: `${config.key}-idle-${direction}-anim`,
        frames: this.anims.generateFrameNumbers(config.key, {
          start: (index + 0) * 13,
          end: (index + 0) * 13 + 1,
        }),
        frameRate: 2,
        repeat: -1,
      });
      this.anims.create({
        key: `${config.key}-walk-${direction}-anim`,
        frames: this.anims.generateFrameNumbers(config.key, {
          start: (index + 8) * 13,
          end: (index + 8) * 13 + 8,
        }),
        frameRate: 8,
        repeat: -1,
      });
    });
    this.destination = { x: config.x, y: config.y };
  }
  setDestination(destination: { x: number; y: number }, callback?: () => void) {
    this.destination = destination;
    const direction = getDirection(destination, { x: this.x, y: this.y });
    this.anims.play(`${this.key}-walk-${direction}-anim`, true);
  }
  update(delta: number): void {
    if (this.destination) {
      // Calculate the direction vector
      const dx = this.destination.x - this.x;
      const dy = this.destination.y - this.y;

      // Calculate the distance to the target
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        // If the sprite is close enough to the target, stop moving
        this.destination = null;
        this.anims.play(`${this.key}-idle-down-anim`, true);
      } else {
        // Normalize the direction vector and update the sprite position
        const velocityX = (dx / distance) * 100 * (delta / 1000);
        const velocityY = (dy / distance) * 100 * (delta / 1000);

        this.x += velocityX;
        this.y += velocityY;
      }
    }
  }
}
