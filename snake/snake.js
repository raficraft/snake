class Snake {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.canvasSize = [400, 600];
    this.ctx = this.canvas.getContext("2d");
    this.snake = [
      [7, 9],
      [6, 9],
      [5, 9],
    ];
    this.apple = [5, 5];
    this.gridSize = 20;
    this.direction = "e";
    this.speed = 800;
    this.score = 0;
    this.running = false;

    this.gamepads = false;
    this.gamepadState = {};

    this.addKeayboardEvent(this.direction);
    this.connectgamePad();
    this.disconnectGamepad();

    requestAnimationFrame(() => {
      this.gamePadUpdate();
    });

    //Start game
    requestAnimationFrame(() => {
      this.move();
    });

    window.addEventListener("resize", () => {
      resizeGame();
    });
  }

  resizeGame() {}

  x_coordMax() {
    if (this.gridSize % 10 !== 0) {
      alert("Change gridSize for a multiple of ten");
    }
    return this.canvasSize[0] / this.gridSize - 1;
  }

  y_coordMax() {
    if (this.gridSize % 10 !== 0) {
      alert("Change gridSize for a multiple of ten");
    }
    return this.canvasSize[1] / this.gridSize - 1;
  }

  gameOver() {
    // if (
    //   this.snake[0][0] > this.x_coordMax() ||
    //   this.snake[0][0] < 0 ||
    //   this.snake[0][1] > this.y_coordMax() ||
    //   this.snake[0][1] < 0
    // ) {
    //   return true;
    // } else {
    const [head, ...body] = this.snake;

    //if head colision body
    for (let bodyElem of body) {
      if (bodyElem[0] === head[0] && bodyElem[1] === head[1]) {
        return true;
      }
    }
    // }
    // return false;
  }

  addKeayboardEvent() {
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowRight": {
          if (this.direction !== "o") {
            this.direction = "e";
          }
          break;
        }
        case "ArrowLeft": {
          if (this.direction !== "e") {
            this.direction = "o";
          }
          break;
        }
        case "ArrowUp": {
          if (this.direction !== "s") {
            this.direction = "n";
          }
          break;
        }
        case "ArrowDown": {
          if (this.direction !== "n") {
            this.direction = "s";
          }
          break;
        }
      }
    });
  }

  move() {
    console.log(this.speed);
    if (!this.updateSnakePosition(this.snake)) {
      this.drawMap(this.ctx);
      this.drawSnake(this.ctx, this.snake, this.gridSize);
      this.drawApple(this.ctx, this.apple, this.gridSize);
      this.drawScore();
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.move();
        });
      }, 1000 - this.speed);
    } else {
      alert("Game Over !");
    }
  }

  //Gamepad

  addGamePadEvent() {
    if (this.gamepads) {
      if (this.gamepadState.cross.right) {
        if (this.direction !== "o") {
          this.direction = "e";
        }
        return;
      }

      if (this.gamepadState.cross.left) {
        if (this.direction !== "e") {
          this.direction = "o";
        }
        return;
      }

      if (this.gamepadState.cross.down) {
        if (this.direction !== "n") {
          this.direction = "s";
        }
        return;
      }

      if (this.gamepadState.cross.up) {
        if (this.direction !== "s") {
          this.direction = "n";
        }
        return;
      }
    }
  }

  connectgamePad() {
    window.addEventListener("gamepadconnected", (event) => {
      console.log("gamePad Connected", event.gamepad);
    });
  }

  disconnectGamepad() {
    window.addEventListener("gamepaddisconnected", (event) => {
      console.log("gamePad disconnected", event.gamepad);
    });
  }

  gamePadUpdate() {
    this.gamepads = navigator.getGamepads()[0];
    if (this.gamepads) {
      this.gamepadState = {
        id: this.gamepads.id,
        stick_left: [
          this.gamepads.axes[0].toFixed(2),
          this.gamepads.axes[1].toFixed(2),
        ],
        stick_right: [
          this.gamepads.axes[2].toFixed(2),
          this.gamepads.axes[3].toFixed(2),
        ],
        button: {
          A: this.gamepads.buttons[0].pressed,
          B: this.gamepads.buttons[1].pressed,
          X: this.gamepads.buttons[2].pressed,
          Y: this.gamepads.buttons[3].pressed,
          L: this.gamepads.buttons[4].pressed,
          R: this.gamepads.buttons[5].pressed,
          ZL: this.gamepads.buttons[6].pressed,
          ZR: this.gamepads.buttons[7].pressed,
          start: this.gamepads.buttons[9].pressed,
          stick_1: this.gamepads.buttons[10].pressed,
          stick_2: this.gamepads.buttons[11].pressed,
        },

        cross: {
          up: this.gamepads.buttons[12].pressed,
          down: this.gamepads.buttons[13].pressed,
          left: this.gamepads.buttons[14].pressed,
          right: this.gamepads.buttons[15].pressed,
        },
      };
      this.addGamePadEvent();
    }

    requestAnimationFrame(() => {
      this.gamePadUpdate();
    });
  }

  // Draw element of game

  updateSnakePosition(snake) {
    let head;
    switch (this.direction) {
      case "e":
        head = [
          snake[0][0] + 1 > this.x_coordMax() ? 0 : snake[0][0] + 1,
          snake[0][1],
        ];
        break;
      case "o":
        head = [
          snake[0][0] - 1 < 0 ? this.x_coordMax() : snake[0][0] - 1,
          snake[0][1],
        ];
        break;

      case "n":
        head = [
          snake[0][0],
          snake[0][1] - 1 < 0 ? this.y_coordMax() : snake[0][1] - 1,
        ];
        break;

      case "s":
        head = [
          snake[0][0],
          snake[0][1] + 1 > this.y_coordMax() ? 0 : snake[0][1] + 1,
        ];
        break;
    }

    snake.unshift(head);

    //if snake eat apple
    if (head[0] === this.apple[0] && head[1] === this.apple[1]) {
      this.generateApple();
      this.speed = this.speed + 5 < 920 ? this.speed + 5 : this.speed;
    } else {
      snake.pop();
    }
    return this.gameOver(snake);
  }

  drawScore() {
    this.ctx.fillStyle = "black";
    this.ctx.font = "32px sans-serif";
    this.ctx.textBaseline = "top";
    this.ctx.fillText(this.score, this.gridSize, this.gridSize);
  }

  drawMap(ctx) {
    this.canvas.width = this.canvasSize[0];
    this.canvas.height = this.canvasSize[1];
    ctx.fillStyle = "rgb(215,215,215)";
    ctx.fillRect(0, 0, 800, 800);
  }

  drawSnake(ctx, snake, size) {
    ctx.fillStyle = "#7fca1d";
    for (let body of snake) {
      ctx.fillRect(body[0] * size, body[1] * size, size - 2, size - 2);
    }
  }

  drawApple(ctx, apple, size) {
    const img = new Image();
    img.src = "./assets/pomme.png";
    ctx.drawImage(img, apple[0] * size, apple[1] * size, size, size);
  }

  generateApple() {
    const [x, y] = [
      Math.trunc(Math.random() * this.x_coordMax()),
      Math.trunc(Math.random() * this.y_coordMax()),
    ];

    for (let body of this.snake) {
      if (body[0] === x && body[1] === y) {
        return this.generateApple();
      }
    }

    this.apple = [x, y];
    this.score = this.score + 1;
  }
}

new Snake();
