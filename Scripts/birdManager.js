import { ctx, GAME_WIDTH, GAME_HEIGHT } from "./canvas.js";
import { playFlapSound } from "./soundManager.js";
import { sprites } from "./assetLoader.js";

let topY = GAME_HEIGHT / 2;
let leftX = GAME_WIDTH / 3;
const birdWidth = 34;
const birdHeight = 24;
const birdRadius = 12; // Collision radius

let velocity = 0;
const gravity = 0.5;
// Slightly stronger jump so it feels closer to original Flappy Bird
const jumpForce = 7;

// Animation variables
let animationFrame = 1; // Start with midflap
let animationCounter = 0;
const ANIMATION_SPEED = 5; // frames per animation frame
let frozenFrame = null; // Store frame when game over

export const DrawBird = (isGameOver = false) => {
  if (!sprites.birdDownflap) return;
  
  // Freeze animation when game over
  if (isGameOver) {
    if (frozenFrame === null) {
      frozenFrame = animationFrame; // Freeze on current frame
    }
    animationFrame = frozenFrame; // Use frozen frame
  } else {
    // Only animate if game is not over
    animationCounter++;
    if (animationCounter >= ANIMATION_SPEED) {
      animationCounter = 0;
      animationFrame = (animationFrame + 1) % 3;
    }
    frozenFrame = null; // Reset frozen frame when game starts
  }
  
  let birdSprite;
  switch (animationFrame) {
    case 0:
      birdSprite = sprites.birdUpflap;
      break;
    case 1:
      birdSprite = sprites.birdMidflap;
      break;
    case 2:
      birdSprite = sprites.birdDownflap;
      break;
    default:
      birdSprite = sprites.birdMidflap;
  }
  
  // Calculate rotation based on velocity (if game over, use max rotation)
  let rotation;
  if (isGameOver) {
    rotation = 90 * (Math.PI / 180); // Face down when dead
  } else {
    rotation = Math.min(Math.max(velocity * 3, -30), 90) * (Math.PI / 180);
  }
  
  ctx.save();
  ctx.translate(leftX + birdWidth / 2, topY + birdHeight / 2);
  ctx.rotate(rotation);
  ctx.drawImage(birdSprite, -birdWidth / 2, -birdHeight / 2, birdWidth, birdHeight);
  ctx.restore();
};

export const ApplyGravityOnBird = () => {
  velocity += gravity;
  topY += velocity;

  birdData.x = leftX + birdWidth / 2;
  birdData.y = topY + birdHeight / 2;
  birdData.radius = birdRadius;
  birdData.width = birdWidth;
  birdData.height = birdHeight;
};

export const ApplyJumpOnBird = () => {
  velocity = -jumpForce;
  playFlapSound(); // Play new sound instance each time for rapid flapping
};

export const birdData = {
  x: leftX + birdWidth / 2,
  y: topY + birdHeight / 2,
  radius: birdRadius,
  width: birdWidth,
  height: birdHeight,
};

export const RestoreBirdStatesToDefault = () => {
  topY = GAME_HEIGHT / 2;
  leftX = GAME_WIDTH / 3;
  velocity = 0;
  animationFrame = 1; // Reset to midflap
  animationCounter = 0;
  frozenFrame = null; // Reset frozen frame
};
