# 🐦 Flappy Bird Game

A modern, responsive HTML5 Canvas implementation of the classic Flappy Bird game with pixel-perfect sprites, smooth animations, and full mobile/desktop support.

## 🎮 Live Demo

**[Play the Game](https://fahad-ninjaturtle.github.io/FlappyBird/)** 🔗

*Note: Replace the link above with your actual deployment URL (GitHub Pages, Netlify, Vercel, etc.)*

## ✨ Features

### 🎯 Core Gameplay
- Classic Flappy Bird mechanics
- Smooth bird physics with gravity and jump mechanics
- Collision detection with pipes and boundaries
- Score tracking system
- Progressive difficulty

### 🎨 Visual Features
- **Pixel-perfect sprites** from Flappy Bird assets
- **Animated bird** with 3-frame flap cycle (upflap, midflap, downflap)
- **Parallax scrolling** background and base
- **Dynamic pipe generation** with guaranteed passable gaps
- **Day background** with cityscape and clouds
- **Score display** using digit sprites

### 📱 Responsive Design
- **Full-screen on mobile** - Optimized for portrait mode
- **Aspect-ratio maintained on PC** - Full height with black side bars
- Touch, mouse, and keyboard controls
- Works seamlessly on all screen sizes

### 🔊 Audio System
- Multiple audio formats (OGG/WAV) for browser compatibility
- Wing flap sound on every jump
- Hit collision sound
- Score point sound
- Game over sound
- Background music support

### 🎮 Game States
- **Start Screen** - Tap/click to begin
- **Gameplay** - Fly through pipes and score points
- **Game Over** - View final score and restart

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "HTML 5 Week 3"
   ```

2. **Install dependencies** (optional, only for ESLint)
   ```bash
   npm install
   ```

3. **Open the game**
   - Simply open `index.html` in your browser, OR
   - Use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```
   - Navigate to `http://localhost:8000` in your browser

## 🎮 How to Play

### Controls
- **Mobile**: Tap anywhere on the screen to make the bird flap
- **Desktop**: 
  - Click anywhere on the canvas, OR
  - Press `Spacebar` to make the bird flap

### Objective
- Navigate the bird through green pipes
- Avoid collisions with pipes, top boundary, and ground
- Score points by successfully passing through pipe gaps
- Try to achieve the highest score possible!

### Tips
- The bird falls due to gravity - tap/click to make it rise
- Time your flaps carefully to navigate through tight gaps
- Each pipe pair passed gives you 1 point

## 📁 Project Structure

```
HTML 5 Week 3/
├── index.html              # Main HTML file
├── Scripts/                # JavaScript modules
│   ├── gameManager.js      # Main game loop and state management
│   ├── birdManager.js      # Bird physics and animation
│   ├── poleManager.js      # Pipe generation and movement
│   ├── collisionManager.js # Collision detection
│   ├── render.js           # Rendering system
│   ├── canvas.js           # Canvas setup and scaling
│   ├── soundManager.js     # Audio management
│   └── assetLoader.js      # Sprite and asset loading
├── Flappy Bird Asssets/    # Game assets
│   ├── audio/              # Sound effects (OGG/WAV)
│   ├── sprites/            # Game sprites (PNG)
│   └── favicon.ico         # Browser icon
├── sounds/                 # Legacy audio folder (deprecated)
├── package.json            # Node.js dependencies
└── README.md               # This file
```

## 🛠️ Technologies Used

- **HTML5 Canvas** - Game rendering
- **Vanilla JavaScript (ES6 Modules)** - Game logic
- **CSS3** - Responsive styling
- **Canvas 2D API** - Graphics rendering

## 🎨 Game Assets

All assets are located in the `Flappy Bird Asssets/` folder:
- **Sprites**: Background, bird animations, pipes, UI elements, score digits
- **Audio**: Wing flap, hit, point, die, swoosh sounds (OGG/WAV formats)
- **Favicon**: Browser tab icon

## 📱 Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Development

### Code Quality
- ESLint configured for code quality
- Modular ES6 architecture
- Clean separation of concerns

### Performance
- 60 FPS game loop using `requestAnimationFrame`
- Optimized sprite rendering
- Efficient collision detection

## 📝 License

This project is open source and available under the [ISC License](LICENSE).

## 👤 Author

Created as part of HTML5 Week 3 project.

## 🙏 Acknowledgments

- Original Flappy Bird game concept
- Sprite assets and audio from Flappy Bird resources
- Community feedback and testing

---

**Enjoy playing! 🎮**

If you encounter any issues or have suggestions, please open an issue on the repository.

