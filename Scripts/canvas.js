/** @type {HTMLCanvasElement} */
export const canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
export const ctx = canvas.getContext("2d");

// Game dimensions (logical size)
export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 500;

// Detect if PC (desktop) or mobile
export const isPC = () => {
  // PC: width >= 768px and not in portrait mobile mode
  return window.innerWidth >= 768 && (window.innerWidth > window.innerHeight || window.innerWidth >= 1024);
};

// Set canvas size based on container - fill entire screen
export const resizeCanvas = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;

  // Logical size of the game
  const GAME_W = GAME_WIDTH;
  const GAME_H = GAME_HEIGHT;

  // Actual canvas size - ALWAYS full screen (device pixels)
  canvas.width = w;
  canvas.height = h;

  // Clear old transforms
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  
  // Fill entire canvas with black background (important for PC side bars)
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);
  
  // For PC: fill height, adjust width, black bars on sides
  // For mobile: fill entire screen
  let scale, offsetX, offsetY;
  
  if (isPC()) {
    // PC: Scale to fill full height, width will be proportional
    scale = h / GAME_H;
    const scaledWidth = GAME_W * scale;
    
    // Center horizontally, fill vertically (offsetY = 0 means starts from top)
    offsetX = (w - scaledWidth) * 0.5;
    offsetY = 0;
  } else {
    // Mobile: Fill entire screen (current behavior)
    scale = Math.max(w / GAME_W, h / GAME_H);
    const scaledWidth = GAME_W * scale;
    const scaledHeight = GAME_H * scale;
    
    // Center the game
    offsetX = (w - scaledWidth) * 0.5;
    offsetY = (h - scaledHeight) * 0.5;
  }

  // Apply transform for game coordinates
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);
  
  // Set up clipping region to ensure game content only draws in game area
  // This prevents background/pipes from extending beyond game view
  ctx.beginPath();
  ctx.rect(0, 0, GAME_W, GAME_H);
  ctx.clip();
};


// Initialize canvas size when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', resizeCanvas);
} else {
  resizeCanvas();
}

// Handle window resize
window.addEventListener("resize", () => {
  setTimeout(resizeCanvas, 10);
});
window.addEventListener("orientationchange", () => {
  setTimeout(resizeCanvas, 200);
});

// Also resize when window loads
window.addEventListener("load", () => {
  setTimeout(resizeCanvas, 100);
});