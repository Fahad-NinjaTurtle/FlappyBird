import { DrawBird } from "./birdManager.js";
import { ctx } from "./canvas.js";
import { score } from "./gameManager.js";
import { DrawPoles } from "./poleManager.js";

export const Draw = () => {
  DrawPoles();
  DrawBird();
  DrawScore();
};

const scoretxtTop = 30;
const scoreTxtLeft = 10;
const scoreTxtWidth = 150;

const DrawScore = () => {
  ctx.font = "30px Airal";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, scoreTxtLeft, scoretxtTop, scoreTxtWidth);
};
