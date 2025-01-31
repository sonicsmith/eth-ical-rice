import { getDirection } from "@/utils/getDirection";

const directions = ["up", "left", "down", "right"];

export class Character extends Phaser.GameObjects.Sprite {
  destination: { x: number; y: number } | null;
  destinationCallback: (() => void) | null;
  key: string;

  constructor(config: any) {
    super(config.scene, config.x, config.y, config.key);
    this.key = config.key;
    this.setDepth(5);
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
    if (callback) {
      this.destinationCallback = callback;
    }
  }
  createSpeechBubble(x: number, y: number, quote: string) {
    const width = 200;
    const bubblePadding = 10;

    const bubbleWidth = width + bubblePadding * 2;

    const content = this.scene.add.text(0, 0, quote, {
      fontFamily: "Arial",
      fontSize: 16,
      color: "#000000",
      align: "center",
      wordWrap: { width: bubbleWidth - bubblePadding * 2 },
    });

    const contentBounds = content.getBounds();
    const bubbleHeight = contentBounds.height + bubblePadding * 4;
    const arrowHeight = bubbleHeight / 4;
    const bubble = this.scene.add.graphics({ x, y });

    //  Bubble shadow
    bubble.fillStyle(0x222222, 0.5);
    bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

    //  Bubble color
    bubble.fillStyle(0xffffff, 1);

    //  Bubble outline line style
    bubble.lineStyle(4, 0x565656, 1);

    //  Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

    //  Calculate arrow coordinates
    const point1X = Math.floor(bubbleWidth / 7);
    const point1Y = bubbleHeight;
    const point2X = Math.floor((bubbleWidth / 7) * 2);
    const point2Y = bubbleHeight;
    const point3X = Math.floor(bubbleWidth / 7);
    const point3Y = Math.floor(bubbleHeight + arrowHeight);

    //  Bubble arrow shadow
    bubble.lineStyle(4, 0x222222, 0.5);
    bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    //  Bubble arrow fill
    bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    bubble.lineStyle(2, 0x565656, 1);
    bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    bubble.lineBetween(point1X, point1Y, point3X, point3Y);

    const HOVER_HEIGHT = 30;
    bubble.setPosition(x - 30, y - bubbleHeight - arrowHeight - HOVER_HEIGHT);

    content.setPosition(
      bubble.x + bubbleWidth / 2 - contentBounds.width / 2,
      bubble.y + bubbleHeight / 2 - contentBounds.height / 2
    );

    content.setDepth(10);
    bubble.setDepth(9);
  }
  talkTo(listenerAgent: Character, message: string) {
    const dx = listenerAgent.x - this.x;
    const dy = listenerAgent.y - this.y;

    const TALKING_DISTANCE = Math.random() > 0.5 ? 50 : -50;
    let x = listenerAgent.x - TALKING_DISTANCE;
    let y = listenerAgent.y;

    if (Math.abs(dx) <= TALKING_DISTANCE && Math.abs(dy) <= TALKING_DISTANCE) {
      x = this.x;
      y = this.y;
    }

    const direction = getDirection(
      { x: listenerAgent.x, y: listenerAgent.y },
      { x, y }
    );

    const callback = () => {
      this.anims.play(`${this.key}-idle-${direction}-anim`, true);
      this.createSpeechBubble(x, y, message);
    };
    this.setDestination({ x, y }, callback);
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
        if (this.destinationCallback) {
          this.destinationCallback();
          this.destinationCallback = null;
        }
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
