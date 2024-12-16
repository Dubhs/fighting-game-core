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
    this.health = 100
  }

  setOpponent(opononent) {
    this.opononent = opononent
  }

  jump() {
    if (this.jumpState == true) {
      this.jumpLock = true
    this.position.y += this.jumpVelocity
    // current jump
    setTimeout(() => {
      this.jumpState = false
    }, 100)
    // lock jump so no double jump
    setTimeout(() => {
      this.jumpLock = false
    }, 550)
  }
  }

  tick(gravity) {
    if (this.jumpState == true) {
      this.jump()
    }
    // height bounding
    if (this.position.y <= window.innerHeight - 100 && this.position.y >= 0){
      this.position.y += gravity
    }
    // floor bounding
    else if (this.position.y <= 0) { this.position.y = 0}
    // update position from velocity
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    // reset velocity
    this.velocity.x = 0
    this.velocity.y = 0
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, 50, 100);

    // check if attack in progress
    if (this.attacking) {
      ctx.fillStyle = "orange";
      //draw attack player 1
      if(this.name == 'player') {
      ctx.fillRect(this.position.x + 50, this.position.y, 75, 25);
      }
      // TODO move this logic out of draw
      // check hit, take health and log
      if (this.opononent.position.x < this.position.x + 125 && this.name == 'player') {
        this.opononent.health -= 1
        console.log('player 1 hit player 2: ', this.opononent.health)
      }
      // draw attack player 2
      if (this.name == 'enemy') {
        ctx.fillRect(this.position.x - 75, this.position.y, 75, 25);
      }
      // TODO move this logic out of draw
      // check hit, take health and log
      // there has to be the depth of the player added to this one because
      // its hitting back and we need its hitline to be the front of the oponent
      if (this.opononent.position.x + 50 > this.position.x - 75 && this.name == 'enemy') {
        this.opononent.health -= 1
        console.log('player 2 hit player 1: ', this.opononent.health)
      }

      // Reset attack state after timeout
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
    // TODO implement the use of these functions or remove them if we stick with a different way
    execute() {
      return this.state ? this.speed : 0;
    },
  },
  'd': {
    plane: 'h',
    speed: 7,
    state: false,
    // TODO implement the use of these functions or remove them if we stick with a different way
    execute() {
      return this.state ? this.speed : 0;
    },
  },
  'w': {
    plane: 'v',
    speed: -100,
    state: false,
    // TODO implement the use of these functions or remove them if we stick with a different way
    execute() {
      return this.state ? this.speed : 0;
    },
  },
};

let activeKeysEnemy = new Set(); // Track currently pressed keys
let lastKeyEnemy = null;

const keyboardStateEnemy = {
  'ArrowLeft': {
    plane: 'h',
    speed: -7,
    state: false,
    // TODO implement the use of these functions or remove them if we stick with a different way
    execute() {
      return this.state ? this.speed : 0;
    },
  },
  'ArrowRight': {
    plane: 'h',
    speed: 7,
    state: false,
    // TODO implement the use of these functions or remove them if we stick with a different way
    execute() {
      return this.state ? this.speed : 0;
    },
  },
  'ArrowUp': {
    plane: 'v',
    speed: -100,
    state: false,
    // TODO implement the use of these functions or remove them if we stick with a different way
    execute() {
      return this.state ? this.speed : 0;
    },
  },
};

// **Keydown Event Handler**
window.addEventListener('keydown', (e) => {
  // player 1
  if (keyboardState[e.key]) {
    if (!keyboardState[e.key].state) {
      keyboardState[e.key].state = true; // Set state to active
      if (keyboardState[e.key].plane === 'h') {
        activeKeys.add(e.key); // Add key to activeKeys
        lastKey = e.key; // Update last active key
      }
    }
  }
  // player 2
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
  // player 1
  if (keyboardState[e.key]) {
    keyboardState[e.key].state = false; // Set state to inactive
    activeKeys.delete(e.key); // Remove key from activeKeys

    // Update lastKey only if the released key matches the current lastKey
    if (lastKey === e.key) {
      // If other keys are active, pick the most recent one
      lastKey = Array.from(activeKeys).pop() || null;
    }
  }
  // player 2
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
// TODO add attack lock to slow attacks
window.addEventListener("keypress", (e) => {
  // player 1
  if (e.key === " ") {
    game.characters.player.attack();
  }
  // player 2
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
      if (character.health > 0) {
        character.draw();
      }
      // health bar logic and rendering
      let widthOfBar = ((canvas.width / 2) / 100)
      // player 1
      if (character.name == 'player' && character.health > 0) {
        ctx.fillStyle = 'blue'
        ctx.fillRect(10, 10, (character.health * widthOfBar) - 15, 25)
      }
      // player 2
      else if (character.name == 'enemy' && character.health > 0) {
        ctx.fillStyle = 'red'
        ctx.fillRect(canvas.width - 10, 10, -((character.health * widthOfBar) - 15), 25)
      }
      if (character.health <= 0) {
        console.log(character.opononent.name, ' wins!!')
      }
    }
  }

  start() {
    const loop = () => {
    // loop thru key states and update velocity
      //
      //player 1
      for (const key in keyboardState) {
        const item = keyboardState[key];
        // for horizontal movement
        if (item.state && item.plane === 'h' && lastKey === key) {
          this.characters.player.velocity.x = item.speed;
        }
        // for jump
        else if (item.state && item.plane === 'v') {
          if (this.characters.player.jumpLock == false) {
            this.characters.player.jumpState = true
          }
        }
      }
      //player 2
      for (const key in keyboardStateEnemy) {
        const itemEnemy = keyboardStateEnemy[key];
        // for horizontal movement
        if (itemEnemy.state && itemEnemy.plane === 'h' && lastKeyEnemy === key) {
          this.characters.enemy.velocity.x += itemEnemy.speed;
        }
        // for jump
        else if (itemEnemy.state && itemEnemy.plane === 'v') {
          if (this.characters.player.jumpLock == false) {
            this.characters.enemy.jumpState = true
          }
        }
      }
      this.render();
      // recurse
      requestAnimationFrame(loop);
    };
    loop();
  }
}

const game = new Game(
  {
    player: new Character(
      { x: 0, y: window.innerHeight - 150 },
      { x: 1, y: 0 },
      'blue',
      'player',
    ),
    enemy: new Character(
      { x: window.innerWidth - 50, y: window.innerHeight - 150 },
      { x: -1, y: 0 },
      'red',
      'enemy',
    ),
});

game.characters.player.setOpponent(game.characters.enemy)
game.characters.enemy.setOpponent(game.characters.player)

game.start();