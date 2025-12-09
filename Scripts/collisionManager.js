import { birdData } from "./birdManager.js";
import { GAME_HEIGHT } from "./canvas.js";
import { GameOver } from "./gameManager.js";
import { topPoles } from "./poleManager.js";
import { poles } from "./poleManager.js";
import { hitSound } from "./soundManager.js";

let gameOverTriggered = false;

export const CollisionCheck = () => {
  // Prevent multiple collision triggers
  if (gameOverTriggered) return;
  
  let birdX = birdData.x;
  let birdY = birdData.y;
  let r = birdData.radius;
  
  // Check top boundary
  if (birdY - r < 0) {
    gameOverTriggered = true;
    hitSound.play();
    GameOver();
    return;
  }
  
  // Check ground collision (base is at GAME_HEIGHT - 100)
  const baseTop = GAME_HEIGHT - 100;
  if (birdY + r > baseTop) {
    gameOverTriggered = true;
    hitSound.play();
    GameOver();
    return;
  }
  
  for (let i = 0; i < topPoles.length; i++) {
    let t = topPoles[i];
    let b = poles[i];

    // ---- TOP POLE COLLISION ----
    if (circleRectCollide(birdX, birdY, r, t.left, t.top, t.width, t.height)) {
      gameOverTriggered = true;
      hitSound.play();
      GameOver();
      return;
    }

    // ---- BOTTOM POLE COLLISION ----
    if (circleRectCollide(birdX, birdY, r, b.left, b.top, b.width, b.height)) {
      gameOverTriggered = true;
      hitSound.play();
      GameOver();
      return;
    }
  }
};

export const ResetCollisionCheck = () => {
  gameOverTriggered = false;
};

const circleRectCollide = (circleX, circleY, circleRadius, rectX, rectY, rectWidth, rectHeight) => {
  let closestX = circleX;
  let closestY = circleY;

  if (circleX < rectX) closestX = rectX;
  else if (circleX > rectX + rectWidth) closestX = rectX + rectWidth;

  if (circleY < rectY) closestY = rectY;
  else if (circleY > rectY + rectHeight) closestY = rectY + rectHeight;

  // Distance from circle center to closest point
  let distX = circleX - closestX;
  let distY = circleY - closestY;

  let distance = Math.sqrt(distX * distX + distY * distY);

  return distance <= circleRadius;
};

