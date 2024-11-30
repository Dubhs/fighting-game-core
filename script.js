class Character {
  constructor(position, velocity, color, name) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.jumpVelocity = -25;
    this.jumpState = false;
    this.jumpLock = false;
    this.attacking = false;
    this.opononent
    this.name = name
    this. health = 100
  }

  setOpponent(opononent) {
    this.opononent = opononent
  }

  jump() {
    if (this.jumpState == true) {
      this.jumpLock = true
    this.position.y += this.jumpVelocity
    setTimeout(() => {
      this.jumpState = false
    }, 100)
    setTimeout(() => {
      this.jumpLock = false
    }, 550)
  }
  }

  tick(gravity) {
    if (this.jumpState == true) {
      this.jump()
    }
    if (this.position.y <= window.innerHeight - 100 && this.position.y >= 0){
      this.position.y += gravity
    } else if (this.position.y <= 0) { this.position.y = 0}
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x = 0
    this.velocity.y = 0
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, 50, 100);

    // Draw attack if in progress
    if (this.attacking) {
      ctx.fillStyle = "orange";
      if(this.name == 'player') {
      ctx.fillRect(this.position.x + 50, this.position.y, 75, 25);
      }
      if (this.opononent.position.x < this.position.x + 125 && this.name == 'player') {
        this.opononent.health -= 1
        console.log('Ishah hit')
      }
      if (this.name == 'enemy') {
        ctx.fillRect(this.position.x - 75, this.position.y, 75, 25);
      }
      if (this.opononent.position.x > this.position.x - 75 && this.name == 'enemy') {
        this.opononent.health -= 1
        console.log(' duhh hit')
      }

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
  'a': {
    plane: 'h',
    speed: -7,
    state: false,
    x() {
      return this.state ? this.speed : 0;
    },
  },
  'd': {
    plane: 'h',
    speed: 7,
    state: false,
    x() {
      return this.state ? this.speed : 0;
    },
  },
  'w': {
    plane: 'v',
    speed: -100,
    state: false,
    x() {
      return this.state ? this.speed : 0;
    },
  },
};

// **Keydown Event Handler**
window.addEventListener('keydown', (e) => {
  if (keyboardState[e.key]) {
    if (!keyboardState[e.key].state) {
      keyboardState[e.key].state = true; // Set state to active
      if (keyboardState[e.key].plane === 'h') {
        activeKeys.add(e.key); // Add key to activeKeys
        lastKey = e.key; // Update last active key
      }
    }
  }
});

// **Keyup Event Handler**
window.addEventListener('keyup', (e) => {
  if (keyboardState[e.key]) {
    keyboardState[e.key].state = false; // Set state to inactive
    activeKeys.delete(e.key); // Remove key from activeKeys

    // Update lastKey only if the released key matches the current lastKey
    if (lastKey === e.key) {
      // If other keys are active, pick the most recent one
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

let activeKeysEnemy = new Set(); // Track currently pressed keys
let lastKeyEnemy = null;

const keyboardStateEnemy = {
  'ArrowLeft': {
    plane: 'h',
    speed: -7,
    state: false,
    x() {
      return this.state ? this.speed : 0;
    },
  },
  'ArrowRight': {
    plane: 'h',
    speed: 7,
    state: false,
    x() {
      return this.state ? this.speed : 0;
    },
  },
  'ArrowUp': {
    plane: 'v',
    speed: -100,
    state: false,
    x() {
      return this.state ? this.speed : 0;
    },
  },
};

// **Keydown Event Handler**
window.addEventListener('keydown', (e) => {
  if (keyboardStateEnemy[e.key]) {
    if (!keyboardStateEnemy[e.key].state) {
      keyboardStateEnemy[e.key].state = true; // Set state to active
      if (keyboardStateEnemy[e.key].plane === 'h') {
        activeKeysEnemy.add(e.key); // Add key to activeKeys
        lastKeyEnemy = e.key; // Update last active key
      }
    }
  }
});

// **Keyup Event Handler**
window.addEventListener('keyup', (e) => {
  if (keyboardStateEnemy[e.key]) {
    keyboardStateEnemy[e.key].state = false; // Set state to inactive
    activeKeys.delete(e.key); // Remove key from activeKeys

    // Update lastKey only if the released key matches the current lastKey
    if (lastKey === e.key) {
      // If other keys are active, pick the most recent one
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

window.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    game.characters.enemy.attack();
  }
});

class Game {
  constructor(characters) {
    this.gravity = 6
    this.characters = characters;
  }

  render() {
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    for (const character of Object.values(this.characters)) {
      character.tick(this.gravity)
    }
    for (const character of Object.values(this.characters)) {
      if (character.health > 0) {
        character.draw();
      }
    }
  }

  start() {
    const loop = () => {
      for (const key in keyboardState) {
        const item = keyboardState[key];
        if (item.state && item.plane === 'h' && lastKey === key) {
          this.characters.player.velocity.x = item.speed;
        } else if (item.state && item.plane === 'v') {
          if (this.characters.player.jumpLock == false) {
            this.characters.player.jumpState = true
          }
        }
      }
      for (const key in keyboardStateEnemy) {
        const itemEnemy = keyboardStateEnemy[key];
        if (itemEnemy.state && itemEnemy.plane === 'h' && lastKeyEnemy === key) {
          this.characters.enemy.velocity.x += itemEnemy.speed;
        } else if (itemEnemy.state && itemEnemy.plane === 'v') {
          if (this.characters.player.jumpLock == false) {
            this.characters.enemy.jumpState = true
          }
        }
      }
      this.render();
      requestAnimationFrame(loop);
    };
    loop();
  }
}

const game = new Game({
  player: new Character({ x: 0, y: window.innerHeight - 150 }, { x: 1, y: 0 }, 'blue', 'player'),
  enemy: new Character({ x: window.innerWidth - 50, y: window.innerHeight - 150 }, { x: -1, y: 0 }, 'red', 'enemy'),
});
game.characters.player.setOpponent(game.characters.enemy)
game.characters.enemy.setOpponent(game.characters.player)
// Start the game
game.start();
