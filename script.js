class Character {
  constructor(position, velocity, color) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.jumpVelocity = -25;
    this.jumpState = false;
    this.jumpLock = false;
    this.attacking = false; // New flag to track attack state
  }

  jump() {
    if (this.jumpState && !this.jumpLock) {
      this.jumpLock = true;
      this.position.y += this.jumpVelocity;

      setTimeout(() => {
        this.jumpState = false;
      }, 100);

      setTimeout(() => {
        this.jumpLock = false;
      }, 550);
    }
  }

  tick(gravity) {
    if (this.jumpState) {
      this.jump();
    }

    if (
      this.position.y <= window.innerHeight - 100 &&
      this.position.y >= 0
    ) {
      this.position.y += gravity;
    } else if (this.position.y < 0) {
      this.position.y = 0;
    }

    this.position.x += this.velocity.x;
    this.velocity.x = 0;
    this.velocity.y = 0;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, 50, 100);

    // Draw attack if in progress
    if (this.attacking) {
      ctx.fillStyle = "orange";
      ctx.fillRect(this.position.x + 50, this.position.y, 75, 25);

      // Reset attack state after drawing
      setTimeout(() => {
        this.attacking = false;
      }, 200);
    }
  }

  attack() {
    if (!this.attacking) {
      this.attacking = true;
    }
  }
}

let activeKeys = new Set(); // Track currently pressed keys
let lastKey = null; // Track the last active key

const keyboardState = {
  a: { plane: "h", speed: -4.5, state: false },
  d: { plane: "h", speed: 4.5, state: false },
  w: { plane: "v", speed: -100, state: false },
};

// Keydown Event Handler
window.addEventListener("keydown", (e) => {
  if (keyboardState[e.key]) {
    if (!keyboardState[e.key].state) {
      keyboardState[e.key].state = true;
      if (keyboardState[e.key].plane === "h") {
        activeKeys.add(e.key);
        lastKey = e.key;
      }
    }
  }
});

// Keyup Event Handler
window.addEventListener("keyup", (e) => {
  if (keyboardState[e.key]) {
    keyboardState[e.key].state = false;
    activeKeys.delete(e.key);

    if (lastKey === e.key) {
      lastKey = Array.from(activeKeys).pop() || null;
    }
  }
});

// Keypress Event for Attack
window.addEventListener("keypress", (e) => {
  if (e.key === " ") {
    game.characters.player.attack();
  }
});

class Game {
  constructor(characters) {
    this.gravity = 6;
    this.characters = characters;
  }

  render() {
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const character of Object.values(this.characters)) {
      character.tick(this.gravity);
      character.draw();
    }
  }

  start() {
    const loop = () => {
      for (const key in keyboardState) {
        const item = keyboardState[key];
        if (item.state && item.plane === "h" && lastKey === key) {
          this.characters.player.velocity.x = item.speed;
          this.characters.enemy.velocity.x -= item.speed;
        } else if (item.state && item.plane === "v") {
          if (!this.characters.player.jumpLock) {
            this.characters.player.jumpState = true;
            this.characters.enemy.jumpState = true;
          }
        }
      }
      this.render();
      requestAnimationFrame(loop);
    };
    loop();
  }
}


// Initialize game and characters
const game = new Game({
  player: new Character(
    { x: 0, y: window.innerHeight - 150 },
    { x: 1, y: 0 },
    "blue"
  ),
  enemy: new Character(
    { x: window.innerWidth - 50, y: window.innerHeight - 150 },
    { x: -1, y: 0 },
    "red"
  ),
});

// Start the game
game.start();
