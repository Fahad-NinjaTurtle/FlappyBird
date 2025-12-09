import { ApplyJumpOnBird } from "./birdManager.js";
import { canvas } from "./canvas.js";

canvas.addEventListener("click", ()=>{
    ApplyJumpOnBird();
})

canvas.addEventListener("touchstart", ()=>{
    ApplyJumpOnBird();
})

canvas.addEventListener("keydown", (e)=>{
    if(e.code == 'Space'){
        ApplyJumpOnBird();
    }
})