export default class Snake {
  constructor() {
    console.log("YOLOs");

    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.snake = [
      [7, 9],
      [6, 9],
      [5, 9],
    ];
    this.apple = [5, 5];
    this.gridSize = 40; // 20 * 20
    this.direction = "e";
    this.speed = 100;
    this.score = 0;

    this.addKeayboardEvent(this.direction);
    requestAnimationFrame(() => {
      this.move();
    });
  }

  drawScore() {
    this.ctx.fillStyle = "black";
    this.ctx.font = "40px sans-serif";
    this.ctx.textBaseline = "top";
    this.ctx.fillText(this.score, this.gridSize, this.gridSize);
  }

  gameOver() {
    if (
      this.snake[0][0] > 19 ||
      this.snake[0][0] < 0 ||
      this.snake[0][1] > 19 ||
      this.snake[0][1] < 0
    ) {
      return true;
    } else {
      const [head, ...body] = this.snake;

      //if head colision body
      for (let bodyElem of body) {
        if (bodyElem[0] === head[0] && bodyElem[1] === head[1]) {
          return true;
        } else {
        }
      }
    }
    return false;
  }

  addKeayboardEvent() {
    window.addEventListener("keydown", (event) => {
      console.log("key", event.key);
      switch (event.key) {
        case "ArrowRight": {
          if (this.direction !== "o") {
            this.direction = "e";
          }
          break;
        }
        case "ArrowLeft": {
          if (this.direction !== "e") {
            console.log(this.direction);
            this.direction = "o";
          }
          break;
        }
        case "ArrowUp": {
          console.log("???");
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

  generateApple() {
    const [x, y] = [
      Math.trunc(Math.random() * 19),
      Math.trunc(Math.random() * 19),
    ];

    for (let body of this.snake) {
      if (body[0] === x && body[1] === y) {
        return this.generateApple();
      }
    }

    this.apple = [x, y];
    this.score = this.score + 1;
  }

  updateSnakePosition(snake) {
    console.log("update positon", this.direction);
    let head;
    switch (this.direction) {
      case "e":
        head = [snake[0][0] + 1, snake[0][1]];
        break;
      case "o":
        head = [snake[0][0] - 1, snake[0][1]];
        break;
      case "s":
        head = [snake[0][0], snake[0][1] + 1];
        break;
      case "n":
        head = [snake[0][0], snake[0][1] - 1];
        break;
    }

    snake.unshift(head);
    if (head[0] === this.apple[0] && head[1] === this.apple[1]) {
      this.generateApple();
      this.speed = this.speed + 5 < 720 ? this.speed + 5 : this.speed;
    } else {
      snake.pop();
    }
    return this.gameOver(snake);
  }

  drawMap(ctx) {
    ctx.fillStyle = "rgb(215,215,215)";
    ctx.fillRect(0, 0, 800, 800);
  }

  drawSnake(ctx, snake, size) {
    ctx.fillStyle = "#7fca1d";
    for (let body of snake) {
      ctx.fillRect(body[0] * size, body[1] * size, size, size);
    }
  }

  drawApple(ctx, apple, size) {
    ctx.fillStyle = "#fc5837";
    ctx.fillRect(apple[0] * size, apple[1] * size, size, size);
  }

  move() {
    if (!this.updateSnakePosition(this.snake)) {
      this.drawMap(this.ctx);
      this.drawSnake(this.ctx, this.snake, this.gridSize);
      this.drawApple(this.ctx, this.apple, this.gridSize);
      this.drawScore();
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.move();
        });
      }, 3000 - this.speed);
    } else {
      alert("Game Over !");
    }
  }
}

new Snake();
