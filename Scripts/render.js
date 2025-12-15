import { DrawBird } from "./birdManager.js";
import { ctx, GAME_WIDTH, GAME_HEIGHT } from "./canvas.js";
import { score } from "./gameManager.js";
import { DrawPoles } from "./poleManager.js";
import { sprites } from "./assetLoader.js";

// Parallax scrolling variables
let backgroundX = 0;
let baseX = 0;
const backgroundSpeed = 0.5;
const baseSpeed = 2;

export const Draw = (isGameOver = false) => {
  DrawBackground(isGameOver);
  DrawPoles(isGameOver);
  DrawBase(isGameOver);
  DrawBird(isGameOver);
  if (!isGameOver) {
    DrawScore(); // Only draw score during gameplay, not on game over screen
  }
};

const DrawBackground = (isGameOver = false) => {
  if (!sprites.background) return;
  
  // Parallax scrolling background (only if game is not over)
  if (!isGameOver) {
    // Move background in same direction as pipes (left) using modulo tiling math
    backgroundX += backgroundSpeed;
  }
  const bgWidth = sprites.background.width;
  
  // Handle negative offsets properly
  let offset = backgroundX % bgWidth;
  if (offset < 0) {
    offset += bgWidth;
  }
  
  // Draw enough tiles to cover entire GAME_WIDTH plus some buffer
  // Start from negative offset to ensure full coverage
  let drawX = -offset;
  while (drawX < GAME_WIDTH) {
    ctx.drawImage(sprites.background, drawX, 0, bgWidth, GAME_HEIGHT);
    drawX += bgWidth;
  }
};

const DrawBase = (isGameOver = false) => {
  if (!sprites.base) return;
  
  // Scrolling base/platform (only if game is not over)
  if (!isGameOver) {
    // Move ground in same direction as pipes (left) using modulo tiling math
    baseX += baseSpeed;
  }
  const baseWidth = sprites.base.width;
  const baseHeight = 100;
  const baseY = GAME_HEIGHT - baseHeight;
  
  // Handle negative offsets properly
  let offset = baseX % baseWidth;
  if (offset < 0) {
    offset += baseWidth;
  }
  
  // Draw enough tiles to cover entire GAME_WIDTH plus some buffer
  // Start from negative offset to ensure full coverage
  let drawX = -offset;
  while (drawX < GAME_WIDTH) {
    ctx.drawImage(sprites.base, drawX, baseY, baseWidth, baseHeight);
    drawX += baseWidth;
  }
};

const DrawScore = () => {
  if (!sprites.digits || sprites.digits.length === 0) return;
  
  const scoreStr = score.toString();
  const digitWidth = 24;
  const digitHeight = 36;
  const spacing = 2;
  const startX = (GAME_WIDTH - (scoreStr.length * (digitWidth + spacing))) / 2;
  const startY = 50;
  
  for (let i = 0; i < scoreStr.length; i++) {
    const digit = parseInt(scoreStr[i]);
    if (sprites.digits[digit]) {
      ctx.drawImage(
        sprites.digits[digit],
        startX + i * (digitWidth + spacing),
        startY,
        digitWidth,
        digitHeight
      );
    }
  }
};

export const ResetScrolling = () => {
  backgroundX = 0;
  baseX = 0;
};
