import {
  ApplyGravityOnBird,
  RestoreBirdStatesToDefault,
} from "./birdManager.js";
import { canvas, ctx } from "./canvas.js";
import { CreatePolesStructure, poles, topPoles } from "./poleManager.js";
import { Draw } from "./render.js";
import { CollisionCheck } from "./collisionManager.js";
import { bgMusic, dieSound, pointSound } from "./soundManager.js";

const startButton = document.getElementById("startBtn");
const restartButton = document.getElementById("restart");
let gameStarted = false;
export let score = 0;

const StartGame = () => {
  startButton.style.display = "none";
  gameStarted = true;
  CreatePolesStructure();
  bgMusic.play();
  bgMusic.loop = true;
};

const Update = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (gameStarted) {
    Draw();
    ApplyGravityOnBird();
    CollisionCheck();
  }
};

export const IncrementScore = () => {
  score++;
  pointSound.play();
};
export const GameOver = () => {
  restartButton.style.display = "block";
  gameStarted = false;
  dieSound.play();
  bgMusic.pause();
  bgMusic.currentTime = 0;
};

const RestartGame = () => {
  gameStarted = true;
  score = 0;
  restartButton.style.display = "none";
  poles.length = 0;
  topPoles.length = 0;
  RestoreBirdStatesToDefault();
  CreatePolesStructure();
  bgMusic.play();
  bgMusic.loop = true;
};
const FPS = 60;
const FRAME_TIME = 1000 / FPS; // ~16.67 ms

let lastTime = 0;

const gameLoop = (currentTime) => {
  const delta = currentTime - lastTime; // time since last frame

  //   console.log(
  //     "delta:", delta,
  //     "required:", FRAME_TIME,
  //     "skipped:", delta < FRAME_TIME
  //   );

  if (delta >= FRAME_TIME) {
    if (gameStarted) {
      Update();
    }
    lastTime = currentTime;
  }

  requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);

const addButtonListner = () => {
  startButton.addEventListener("click", () => {
    StartGame();
  });
  restartButton.addEventListener("click", () => {
    RestartGame();
  });
};

addButtonListner();
