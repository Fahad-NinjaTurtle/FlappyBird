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
  if (sprites.gameover) {
    // Get original sprite dimensions to maintain aspect ratio
    const originalWidth = sprites.gameover.width;
    const originalHeight = sprites.gameover.height;
    const aspectRatio = originalWidth / originalHeight;
    
    // Different sizing for mobile vs PC
    let maxWidth, maxHeight;
    if (isPC()) {
      // PC: larger size
      maxWidth = GAME_WIDTH * 0.6;
      maxHeight = GAME_HEIGHT * 0.4;
    } else {
      // Mobile: smaller size (50% of screen width)
      maxWidth = GAME_WIDTH * 0.5;
      maxHeight = GAME_HEIGHT * 0.35;
    }
    
    let gameOverWidth = maxWidth;
    let gameOverHeight = gameOverWidth / aspectRatio;
    
    // If height exceeds max, scale by height instead
    if (gameOverHeight > maxHeight) {
      gameOverHeight = maxHeight;
      gameOverWidth = gameOverHeight * aspectRatio;
    }
    
    const gameOverY = (GAME_HEIGHT - gameOverHeight) / 2;
    
    // Draw final score above game over sprite
    if (sprites.digits && sprites.digits.length > 0 && score > 0) {
      const scoreStr = score.toString();
      const digitWidth = 24;
      const digitHeight = 36;
      const spacing = 2;
      const startX = (GAME_WIDTH - (scoreStr.length * (digitWidth + spacing))) / 2;
      const startY = gameOverY - 50;
      
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
    }
    
    // Draw game over sprite with proper aspect ratio
    ctx.drawImage(
      sprites.gameover,
      (GAME_WIDTH - gameOverWidth) / 2,
      gameOverY,
      gameOverWidth,
      gameOverHeight
    );
  }
};

export const IncrementScore = () => {
  score++;
  pointSound.play();
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
  gameStarted = true;
  gameOver = false;
  waitingToStart = false;
  score = 0;
  // restartButton.style.display = "none";
  gameOverScreen.style.display = "none";
  poles.length = 0;
  topPoles.length = 0;
  RestoreBirdStatesToDefault();
  CreatePolesStructure();
  ResetScrolling();
  ResetCollisionCheck();
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
