import { birdData } from "./birdManager.js";
import { ctx, GAME_WIDTH, GAME_HEIGHT } from "./canvas.js";
import { IncrementScore } from "./gameManager.js";
import { sprites } from "./assetLoader.js";

const poleWidth = 52;
// Minimum gap for bird to pass through (bird height 24px + safe buffer)
const MIN_GAP = 180; // Increased gap to ensure bird can always pass
const minPipeHeight = 50;
const baseHeight = 100;
const availableHeight = GAME_HEIGHT - baseHeight; // Height available for pipes
const maxPipeHeight = availableHeight - MIN_GAP - minPipeHeight;

export let poles = [];
export let topPoles = [];
const poleCount = 5;
const pipeSpeed = 2;

// Create a pipe pair with guaranteed minimum gap
const createPipePair = (left) => {
  // Choose a random gap center position (ensures gap is in playable area)
  // Gap center should be between minPipeHeight + MIN_GAP/2 and availableHeight - minPipeHeight - MIN_GAP/2
  const minGapCenter = minPipeHeight + MIN_GAP / 2;
  const maxGapCenter = availableHeight - minPipeHeight - MIN_GAP / 2;
  const gapCenter = Math.random() * (maxGapCenter - minGapCenter) + minGapCenter;
  
  // Calculate top pipe height (from 0 to gapCenter - MIN_GAP/2)
  const topHeight = Math.max(gapCenter - MIN_GAP / 2, minPipeHeight);
  
  // Calculate bottom pipe (from gapCenter + MIN_GAP/2 to GAME_HEIGHT - baseHeight)
  const bottomTop = gapCenter + MIN_GAP / 2;
  const bottomHeight = (GAME_HEIGHT - baseHeight) - bottomTop;
  
  // Ensure bottom pipe also has minimum height
  if (bottomHeight < minPipeHeight) {
    // Adjust gap center if needed
    const adjustedGapCenter = (GAME_HEIGHT - baseHeight) - minPipeHeight - MIN_GAP / 2;
    const newTopHeight = Math.max(adjustedGapCenter - MIN_GAP / 2, minPipeHeight);
    const newBottomTop = adjustedGapCenter + MIN_GAP / 2;
    const newBottomHeight = (GAME_HEIGHT - baseHeight) - newBottomTop;
    
    // Create bottom pole
    const bottomPole = new Pole(left, newBottomTop, poleWidth, newBottomHeight, false);
    
    // Create top pole
    const topPole = new Pole(left, 0, poleWidth, newTopHeight, false);
    
    return { bottomPole, topPole };
  }
  
  // Create bottom pole
  const bottomPole = new Pole(left, bottomTop, poleWidth, bottomHeight, false);
  
  // Create top pole
  const topPole = new Pole(left, 0, poleWidth, topHeight, false);
  
  return { bottomPole, topPole };
};

export const CreatePolesStructure = () => {
  poles.length = 0;
  topPoles.length = 0;
  
  for (let i = 0; i < poleCount; i++) {
    const left = GAME_WIDTH + i * 200;
    const { bottomPole, topPole } = createPipePair(left);
    poles.push(bottomPole);
    topPoles.push(topPole);
  }
};

const DrawTopPoles = () => {
  if (!sprites.pipeGreen) return;
  
  for (let i = 0; i < topPoles.length; i++) {
    let p = topPoles[i];
    // Draw top pipe (flipped)
    ctx.save();
    ctx.translate(p.left + poleWidth / 2, p.height);
    ctx.scale(1, -1); // Flip vertically
    ctx.drawImage(sprites.pipeGreen, -poleWidth / 2, 0, poleWidth, p.height);
    ctx.restore();
  }
};

const DrawBottomPole = () => {
  if (!sprites.pipeGreen) return;
  
  for (let i = 0; i < poles.length; i++) {
    let p = poles[i];
    ctx.drawImage(sprites.pipeGreen, p.left, p.top, poleWidth, p.height);
  }
};

export const DrawPoles = (isGameOver = false) => {
  if (!isGameOver) {
    MovePoles();
  }
  DrawTopPoles();
  DrawBottomPole();
};

const MovePoles = () => {
  for (let i = 0; i < poles.length; i++) {
    let p = poles[i];
    let t = topPoles[i];

    p.left -= pipeSpeed;
    t.left -= pipeSpeed;
    
    DetectBottomCrossed(p);
    DetectTopCrossed(t);
    
    if (p.left + p.width < 0) {
      // Reset pipe pair with guaranteed minimum gap
      const left = GAME_WIDTH + 100;
      const { bottomPole, topPole } = createPipePair(left);
      
      // Update bottom pole
      p.height = bottomPole.height;
      p.top = bottomPole.top;
      p.left = left;
      p.isScored = false;
      
      // Update top pole
      t.height = topPole.height;
      t.top = topPole.top;
      t.left = left;
      t.isScored = false;
    }
  }

  VerifyBothPolesCrossed();
};

export class Pole {
  constructor(left, top, width, height, isScored) {
    this.height = height;
    this.width = width;
    this.top = top;
    this.left = left;
    this.isScored = isScored;
  }
}

let isTopCrossed = false;
const DetectTopCrossed = (pole) => {
  if (pole.left + pole.width < birdData.x && !pole.isScored) {
    console.log("top passed");
    pole.isScored = true;
    isTopCrossed = true;
  }
};

let isBottomCrossed = false;
const DetectBottomCrossed = (pole) => {
  if (pole.left + pole.width < birdData.x && !pole.isScored) {
    console.log("bottom passed");
    pole.isScored = true;
    isBottomCrossed = true;
  }
};

const VerifyBothPolesCrossed = () => {
  if (isTopCrossed && isBottomCrossed) {
    console.log("both pipes crossed");
    isTopCrossed = false;
    isBottomCrossed = false;
    IncrementScore();
  }
};
