// Audio with fallback support (OGG preferred, WAV fallback)
const createAudio = (name) => {
  const oggSrc = `./Flappy Bird Asssets/audio/${name}.ogg`;
  const wavSrc = `./Flappy Bird Asssets/audio/${name}.wav`;
  
  // Create a function that plays a new audio instance each time
  const playSound = () => {
    const audio = new Audio();
    
    // Try OGG first, fallback to WAV
    audio.src = oggSrc;
    audio.onerror = () => {
      audio.src = wavSrc;
    };
    
    // Set volume and play
    audio.volume = 0.5;
    audio.play().catch(err => {
      // Ignore play errors (e.g., user hasn't interacted yet)
      console.log("Audio play error:", err);
    });
    
    return audio;
  };
  
  // Also create a persistent audio object for compatibility
  const persistentAudio = new Audio();
  persistentAudio.src = oggSrc;
  persistentAudio.onerror = () => {
    persistentAudio.src = wavSrc;
  };
  persistentAudio.volume = 0.5;
  
  // Return both the persistent audio and play function
  persistentAudio.playSound = playSound;
  
  return persistentAudio;
};

export let flapSound = createAudio("wing");
export let hitSound = createAudio("hit");
export let pointSound = createAudio("point");
export let dieSound = createAudio("die");
export let swooshSound = createAudio("swoosh");

// Special function for flap sound that creates new instance each time
export const playFlapSound = () => {
  const audio = new Audio();
  const oggSrc = `./Flappy Bird Asssets/audio/wing.ogg`;
  const wavSrc = `./Flappy Bird Asssets/audio/wing.wav`;
  
  audio.src = oggSrc;
  audio.onerror = () => {
    audio.src = wavSrc;
  };
  audio.volume = 0.5;
  audio.play().catch(err => {
    // Ignore play errors
  });
};