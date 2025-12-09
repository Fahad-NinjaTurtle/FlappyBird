import { ctx } from "./canvas.js";
import { flapSound } from "./soundManager.js";

let topY = 230;
let leftX = 230;
let circleRadius = 10;
let startAngle = 0;
let endAngle = 360;

let velocity = 0;
const gravity = 0.5;
const jumpForce = 5;

export const DrawBird = () => {
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.arc(leftX, topY, circleRadius, startAngle, endAngle);
  ctx.fill();
};

export const ApplyGravityOnBird = () => {
  velocity += gravity;
  topY += velocity;

  birdData.x = leftX;
  birdData.y = topY;
  birdData.radius = circleRadius;
};
export const ApplyJumpOnBird = () => {
  velocity = -jumpForce;
  console.log("jump");
  flapSound.play();
};

export const birdData = {
  x: leftX,
  y: topY,
  radius: circleRadius,
};

export const RestoreBirdStatesToDefault = () => {
  topY = 230;
  leftX = 230;
  velocity = 0;
};
