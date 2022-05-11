//Gamepad Lib exemple with API gamepad

class Gamepad {
  constructor() {
    this.gamepads = false;
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
    //Create Dom element in your HTML webPage with class="returnInput" for show the button pressed
    const textDisplay = document.querySelector(".returnInput");
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
    }

    textDisplay.textContent = JSON.stringify(this.gamepadState, null, 2);
    requestAnimationFrame(() => {
      this.gamePadUpdate();
    });
  }
}
