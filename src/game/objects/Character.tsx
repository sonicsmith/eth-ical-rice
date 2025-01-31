export class Character extends Phaser.GameObjects.Sprite {
  destination: { x: number; y: number } | null;
  key: string;

  constructor(config: any) {
    super(config.scene, config.x, config.y, config.key);
    this.key = config.key;
    config.scene.add.existing(this);
  }
  setDestination(destination: { x: number; y: number }) {
    this.destination = destination;
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
