// Asset loader for sprites and images
export const sprites = {};

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const loadAssets = async () => {
  try {
    // Background
    sprites.background = await loadImage("./Flappy Bird Asssets/sprites/background-day.png");
    
    // Base/Platform
    sprites.base = await loadImage("./Flappy Bird Asssets/sprites/base.png");
    
    // Bird sprites (red bird)
    sprites.birdDownflap = await loadImage("./Flappy Bird Asssets/sprites/redbird-downflap.png");
    sprites.birdMidflap = await loadImage("./Flappy Bird Asssets/sprites/redbird-midflap.png");
    sprites.birdUpflap = await loadImage("./Flappy Bird Asssets/sprites/redbird-upflap.png");
    
    // Pipe sprites
    sprites.pipeGreen = await loadImage("./Flappy Bird Asssets/sprites/pipe-green.png");
    
    // UI sprites
    sprites.message = await loadImage("./Flappy Bird Asssets/sprites/message.png");
    sprites.gameover = await loadImage("./Flappy Bird Asssets/sprites/gameover.png");
    
    // Score digits
    sprites.digits = [];
    for (let i = 0; i <= 9; i++) {
      sprites.digits[i] = await loadImage(`./Flappy Bird Asssets/sprites/${i}.png`);
    }
    
    return true;
  } catch (error) {
    console.error("Error loading assets:", error);
    return false;
  }
};

