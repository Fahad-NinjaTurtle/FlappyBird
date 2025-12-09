import { birdData } from "./birdManager.js";
import { canvas } from "./canvas.js";
import { GameOver } from "./gameManager.js";
import { topPoles } from "./poleManager.js";
import { poles } from "./poleManager.js";   // bottom poles also needed
import { hitSound } from "./soundManager.js";

export const CollisionCheck = () => {

    let birdX = birdData.x;
    let birdY = birdData.y;
    let r = birdData.radius;
    BallGroundCheck(birdY)
    
    for (let i = 0; i < topPoles.length; i++) {

        let t = topPoles[i];
        let b = poles[i];

        // ---- TOP POLE COLLISION ----
        if (circleRectCollide(birdX, birdY, r, t.left, t.top, t.width, t.height)) {
            hitSound.play();
            GameOver();
            return;
        }

        // ---- BOTTOM POLE COLLISION ----
        if (circleRectCollide(birdX, birdY, r, b.left, b.top, b.width, b.height)) {
            hitSound.play();
            GameOver();
            return;
        }
    }
};
const circleRectCollide = (circleX, circleY, circleRadius,rectX, rectY, rectWidth, rectHeight) => {

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



const BallGroundCheck=(bY)=>{
    if(bY > canvas.height){
        GameOver();
        return;
    }
}

