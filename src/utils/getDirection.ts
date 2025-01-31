export const getDirection = (
  final: { x: number; y: number },
  initial: { x: number; y: number }
) => {
  const dx = final.x - initial.x;
  const dy = final.y - initial.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx < 0 ? "left" : "right";
  } else {
    return dy < 0 ? "up" : "down";
  }
};
