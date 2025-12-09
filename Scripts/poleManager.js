import { birdData } from "./birdManager.js";
import { canvas, ctx } from "./canvas.js";
import { IncrementScore } from "./gameManager.js";
export const DrawPoles = () => {
  ctx.fillStyle = "green";
  MovePoles();
  DrawTopPoles();
  DrawBottomPole();
};
// let pole;
// let poleX = canvas.width + 60;
// let poleX = 60;
// let poleHeight = Math.random() * 200;
// let poleY = canvas.height - poleHeight;
let poleWidth = 50;
export let poles = [];
export let topPoles = [];
const poleCount = 5;
export const CreatePolesStructure = () => {
  CreateTopPolesStructure();
  CreateBottomPoleStructure();
};

const CreateBottomPoleStructure = () => {
  for (let i = 0; i < poleCount; i++) {
    let height = Math.random() * 100 + 130;

    let top = canvas.height - height;

    let left = canvas.width + i * 110; // spacing between poles

    let poleObj = new Pole(left, top, poleWidth, height, false);
    poles.push(poleObj);
  }
};

const CreateTopPolesStructure = () => {
  for (let i = 0; i < poleCount; i++) {
    let height = Math.random() * 100 + 130;

    let top = 0;

    let left = canvas.width + i * 110;
    let poleObj = new Pole(left, top, poleWidth, height, false);
    topPoles.push(poleObj);
  }
};

const DrawTopPoles = () => {
  for (let i = 0; i < poleCount; i++) {
    ctx.fillRect(
      topPoles[i].left,
      topPoles[i].top,
      topPoles[i].width,
      topPoles[i].height
    );
    // console.log("drawn top poles are ", i);
  }
};

const DrawBottomPole = () => {
  for (let i = 0; i < poleCount; i++) {
    //   pole = new Pole(poleX, poleY, poleWidth, poleHeight);
    ctx.fillRect(poles[i].left, poles[i].top, poles[i].width, poles[i].height);
    // console.log("drawn poles are ", i);
  }
};

const MovePoles = () => {
  for (let i = 0; i < poles.length; i++) {
    let p = poles[i];

    p.left -= 2;
    DetectBottomCrossed(p);
    if (p.left + p.width < 0) {
      p.left = canvas.width + 100;
      p.height = Math.random() * 100 + 130;
      p.top = canvas.height - p.height;
      p.isScored = false;
    }
  }
  for (let i = 0; i < topPoles.length; i++) {
    let p = topPoles[i];

    p.left -= 2;
    DetectTopCrossed(p);

    if (p.left + p.width < 0) {
      p.left = canvas.width + 100;
      p.height = Math.random() * 100 + 130;
      p.top = 0;
      p.isScored = false;
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
