import {
  ApplyGravityOnBird,
  RestoreBirdStatesToDefault,
} from "./birdManager.js";
import { canvas, ctx, GAME_WIDTH, GAME_HEIGHT, resizeCanvas, isPC } from "./canvas.js";
import { CreatePolesStructure, poles, topPoles } from "./poleManager.js";
import { Draw, ResetScrolling } from "./render.js";
import { CollisionCheck, ResetCollisionCheck } from "./collisionManager.js";
import { dieSound, pointSound } from "./soundManager.js";
import { sprites } from "./assetLoader.js";
import { loadAssets } from "./assetLoader.js";
import { ApplyJumpOnBird } from "./birdManager.js";

// const startButton = document.getElementById("startBtn");
// const restartButton = document.getElementById("restart");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

let gameStarted = false;
let gameOver = false;
let waitingToStart = true;
export let score = 0;
let bestScore = 0;

const BEST_SCORE_KEY = "flappy_best_score";

const loadBestScore = () => {
  try {
    const stored = localStorage.getItem(BEST_SCORE_KEY);
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (!Number.isNaN(parsed) && parsed >= 0) {
        bestScore = parsed;
      }
    }
  } catch (e) {
    // Fail silently if localStorage is blocked
    bestScore = 0;
  }
};

const saveBestScore = () => {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
  } catch (e) {
    // Ignore write errors (private mode, etc.)
  }
};

const StartGame = () => {
  if (!waitingToStart) return;
  
  waitingToStart = false;
  gameStarted = true;
  gameOver = false;
  // startButton.style.display = "none";
  startScreen.style.display = "none";
  gameOverScreen.style.display = "none";
  CreatePolesStructure();
  ResetScrolling();
  ResetCollisionCheck();
};

const Update = () => {
  // Ensure canvas is properly sized and setup (this sets transform and clipping)
  resizeCanvas();
  
  // Clear the game area (clipping is already set by resizeCanvas)
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  
  // Draw game content
  if (gameStarted && !gameOver) {
    Draw(false);
    ApplyGravityOnBird();
    CollisionCheck();
  } else if (waitingToStart) {
    DrawStartScreen();
  } else if (gameOver) {
    Draw(true); // Pass true to stop animations - don't update bird or check collisions
    DrawGameOverScreen();
  }
};

const DrawStartScreen = () => {
  // Draw background
  if (sprites.background) {
    ctx.drawImage(sprites.background, 0, 0, GAME_WIDTH, GAME_HEIGHT);
  }
  
  // Draw base
  if (sprites.base) {
    const baseHeight = 100;
    ctx.drawImage(sprites.base, 0, GAME_HEIGHT - baseHeight, GAME_WIDTH, baseHeight);
  }
  
  // Draw bird on start screen (centered)
  if (sprites.birdMidflap) {
    const birdWidth = 34;
    const birdHeight = 24;
    const birdX = GAME_WIDTH / 3;
    const birdY = GAME_HEIGHT / 2;
    ctx.drawImage(
      sprites.birdMidflap,
      birdX - birdWidth / 2,
      birdY - birdHeight / 2,
      birdWidth,
      birdHeight
    );
  }
  
  // Draw message sprite
  if (sprites.message) {
    const msgWidth = 184;
    const msgHeight = 267;
    ctx.drawImage(
      sprites.message,
      (GAME_WIDTH - msgWidth) / 2,
      (GAME_HEIGHT - msgHeight) / 2,
      msgWidth,
      msgHeight
    );
  }
};


const DrawGameOverScreen = () => {
  // Responsive "GAME OVER" text + score summary rendered manually (no image)
  const centerX = GAME_WIDTH / 2;

  // Font sizes and spacing scale with device type
  const desktop = isPC();
  const baseGameOverFontSize = desktop
    ? Math.min(40, Math.max(24, GAME_WIDTH * 0.09))
    : Math.min(24, Math.max(16, GAME_WIDTH * 0.06)); // Smaller font for mobile
  const baseLabelFontSize = desktop
    ? Math.min(20, Math.max(12, GAME_WIDTH * 0.045))
    : Math.min(14, Math.max(9, GAME_WIDTH * 0.035)); // Smaller label font for mobile

  const lineGap = desktop ? 12 : 8; // Tighter spacing on mobile

  // Starting Y - mobile needs more top padding to prevent cutoff
  const gameOverY = desktop 
    ? GAME_HEIGHT * 0.35 
    : Math.max(60, GAME_HEIGHT * 0.25); // Ensure minimum 60px from top on mobile

  const pixelFontStack = '"Press Start 2P", "Courier New", monospace';

  // Calculate GAME OVER text Y position (mobile needs adjustment for "top" baseline)
  const gameOverTextY = desktop ? gameOverY : gameOverY + baseGameOverFontSize / 2;

  // --- GAME OVER text (as two words with adjustable spacing) ---
  ctx.save();
  ctx.textAlign = "left";
  // Mobile: use "top" baseline to prevent cutoff, Desktop: use "middle" for better centering
  ctx.textBaseline = desktop ? "middle" : "top";
  ctx.font = `${baseGameOverFontSize}px ${pixelFontStack}`;
  ctx.lineWidth = desktop ? 6 : 4; // Thinner outline on mobile
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffa500";

  const titleLeft = "GAME";
  const titleRight = "OVER";
  const gapBetweenWords = desktop
    ? baseGameOverFontSize * 0.8
    : baseGameOverFontSize * 0.9; // a bit more spacing on mobile

  const leftWidth = ctx.measureText(titleLeft).width;
  const rightWidth = ctx.measureText(titleRight).width;
  const totalTitleWidth = leftWidth + gapBetweenWords + rightWidth;
  const startX = centerX - totalTitleWidth / 2;

  // Draw "GAME"
  ctx.strokeText(titleLeft, startX, gameOverTextY);
  ctx.fillText(titleLeft, startX, gameOverTextY);

  // Draw "OVER" with extra spacing
  const overX = startX + leftWidth + gapBetweenWords;
  ctx.strokeText(titleRight, overX, gameOverTextY);
  ctx.fillText(titleRight, overX, gameOverTextY);

  ctx.restore();

  // Digit metrics for score numbers (keep sprites look consistent)
  // Slightly smaller digits on mobile so they don't dominate the UI
  const digitWidth = desktop ? 24 : 18;
  const digitHeight = desktop ? 36 : 27;
  const spacing = 2;

  // Helper to draw one score row (label + digits side‑by‑side, centered as a group) for desktop
  const drawScoreRowDesktop = (labelText, value, rowY) => {
    ctx.save();
    ctx.font = `${baseLabelFontSize}px ${pixelFontStack}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 4;

    const gap = Math.max(10, GAME_WIDTH * 0.03);
    const labelWidth = ctx.measureText(labelText).width;

    const valueStr = String(value);
    const digitsWidth = valueStr.length * (digitWidth + spacing);

    const totalWidth = labelWidth + gap + digitsWidth;
    const startX = centerX - totalWidth / 2;

    // Label
    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "#ffa500";
    ctx.strokeText(labelText, startX, rowY);
    ctx.fillText(labelText, startX, rowY);

    // Digits (sprites) drawn to the right of the label
    if (sprites.digits && sprites.digits.length > 0) {
      let digitX = startX + labelWidth + gap;
      const digitY = rowY - digitHeight / 2;

      for (let i = 0; i < valueStr.length; i++) {
        const d = parseInt(valueStr[i]);
        if (sprites.digits[d]) {
          ctx.drawImage(sprites.digits[d], digitX, digitY, digitWidth, digitHeight);
          digitX += digitWidth + spacing;
        }
      }
    }

    ctx.restore();
  };

  if (desktop) {
    // --- Desktop: label and score side-by-side ---
    const currentRowY = gameOverY + baseGameOverFontSize + lineGap * 2;
    const highRowY = currentRowY + digitHeight + baseLabelFontSize + lineGap * 2;

    drawScoreRowDesktop("CURRENT SCORE", score, currentRowY);
    drawScoreRowDesktop("HIGH SCORE", bestScore, highRowY);

    // Desktop: show tap-to-restart hint below scores
    const tapFontSize = baseLabelFontSize * 0.8;
    const tapY = highRowY + digitHeight + tapFontSize * 1.4;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${tapFontSize}px ${pixelFontStack}`;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff";
    ctx.strokeText("TAP TO RESTART", centerX, tapY);
    ctx.fillStyle = "#ffa500";
    ctx.fillText("TAP TO RESTART", centerX, tapY);
    ctx.restore();
  } else {
    // --- Mobile: label and score side-by-side (same as desktop, but with smaller spacing) ---
    // Helper to draw one score row for mobile (label + digits side-by-side, centered as a group)
    const drawScoreRowMobile = (labelText, value, rowY) => {
      ctx.save();
      ctx.font = `${baseLabelFontSize}px ${pixelFontStack}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 3; // Thinner outline on mobile

      const gap = Math.max(6, GAME_WIDTH * 0.02); // Smaller gap on mobile
      const labelWidth = ctx.measureText(labelText).width;

      const valueStr = String(value);
      const digitsWidth = valueStr.length * (digitWidth + spacing);

      const totalWidth = labelWidth + gap + digitsWidth;
      const startX = centerX - totalWidth / 2;

      // Label
      ctx.strokeStyle = "#ffffff";
      ctx.fillStyle = "#ffa500";
      ctx.strokeText(labelText, startX, rowY);
      ctx.fillText(labelText, startX, rowY);

      // Digits (sprites) drawn to the right of the label
      if (sprites.digits && sprites.digits.length > 0) {
        let digitX = startX + labelWidth + gap;
        const digitY = rowY - digitHeight / 2;

        for (let i = 0; i < valueStr.length; i++) {
          const d = parseInt(valueStr[i]);
          if (sprites.digits[d]) {
            ctx.drawImage(sprites.digits[d], digitX, digitY, digitWidth, digitHeight);
            digitX += digitWidth + spacing;
          }
        }
      }

      ctx.restore();
    };

    // Calculate row positions for mobile
    // Add a bit more vertical space between GAME OVER and CURRENT SCORE on mobile
    const currentRowY = gameOverTextY + baseGameOverFontSize + lineGap * 3;
    const highRowY = currentRowY + Math.max(digitHeight, baseLabelFontSize) + lineGap * 1.5;

    drawScoreRowMobile("CURRENT SCORE", score, currentRowY);
    drawScoreRowMobile("HIGH SCORE", bestScore, highRowY);

    // Mobile: show tap-to-restart hint below scores
    const tapFontSize = baseLabelFontSize * 0.85;
    const tapY = highRowY + digitHeight + tapFontSize * 1.4;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${tapFontSize}px ${pixelFontStack}`;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff";
    ctx.strokeText("TAP TO RESTART", centerX, tapY);
    ctx.fillStyle = "#ffa500";
    ctx.fillText("TAP TO RESTART", centerX, tapY);
    ctx.restore();
  }
};

export const IncrementScore = () => {
  score++;
  pointSound.play();
  
  // Update best score immediately when player scores higher
  if (score > bestScore) {
    bestScore = score;
    saveBestScore();
  }
};

export const GameOver = () => {
  if (gameOver) return; // Prevent multiple calls
  
  gameOver = true;
  gameStarted = false;
  // restartButton.style.display = "block";
  gameOverScreen.style.display = "flex";
  dieSound.play();
};

const RestartGame = () => {
  // Reset to start panel instead of jumping directly into gameplay
  gameStarted = false;
  gameOver = false;
  waitingToStart = true;
  score = 0;
  // restartButton.style.display = "none";
  gameOverScreen.style.display = "none";
  startScreen.style.display = "flex";
  poles.length = 0;
  topPoles.length = 0;
  RestoreBirdStatesToDefault();
  CreatePolesStructure();
  ResetScrolling();
  ResetCollisionCheck();
  // Draw start panel again
  Update();
};

const FPS = 60;
const FRAME_TIME = 1000 / FPS; // ~16.67 ms

let lastTime = 0;

const gameLoop = (currentTime) => {
  const delta = currentTime - lastTime;

  if (delta >= FRAME_TIME) {
    Update();
    lastTime = currentTime;
  }

  requestAnimationFrame(gameLoop);
};

// Input handling
const handleInput = (e) => {
  e.preventDefault();
  
  if (waitingToStart) {
    StartGame();
    return;
  }

  if (gameOver) {
    RestartGame();
    return;
  }

  if (gameStarted) {
    ApplyJumpOnBird();
  }
};


// Initialize game
const init = async () => {
  // Initial canvas resize
  resizeCanvas();
  // Load best score from browser storage
  loadBestScore();
  
  // Load assets
  const assetsLoaded = await loadAssets();
  if (!assetsLoaded) {
    console.error("Failed to load assets");
    return;
  }
  
  // Resize canvas after assets load and DOM is ready
  setTimeout(() => {
    resizeCanvas();
    Update(); // Draw initial screen
  }, 100);
  
  // Set up input handlers
  canvas.addEventListener("click", handleInput);
  canvas.addEventListener("touchstart", handleInput, { passive: false });
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      handleInput(e);
    }
  });
  
  startScreen.addEventListener("click", handleInput);
  startScreen.addEventListener("touchstart", handleInput, { passive: false });
  gameOverScreen.addEventListener("click", handleInput);
  gameOverScreen.addEventListener("touchstart", handleInput, { passive: false });
  
  // startButton.addEventListener("click", handleInput);
  // restartButton.addEventListener("click", handleInput);
  
  // Start game loop
  requestAnimationFrame(gameLoop);
  
  // Draw initial start screen
  Update();
};

init();
