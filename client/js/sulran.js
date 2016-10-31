class Sulran {
  constructor(canvas, connString) {
    this.socket = new Connection(connString);
    this.graphics = new Draw(canvas);

    this.userPosition = [10, 10];

    console.log(map);

    this.c = document.getElementById(canvas);
    this.ctx = this.c.getContext("2d");

    //variables
    this.mouse = {
      "down": [-1, -1],
      "up": [-1, -1],
      "move": [-1, -1]
    }
  }

  mouseEvent(e, type) {
    var pos = this.getMousePos(e);
    this.mouse[[type]] = [pos.x, pos.y];
  }

  getMousePos(evt) {
    var rect = this.c.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    }
  }

  buildMap() {
    var rtnMap = [];
    for (var y = this.userPosition[1] - 6; y < this.userPosition[1] + 6; y++) {
      var row = [];
      for (var x = this.userPosition[0] - 8; x < this.userPosition[0]; x++) {

      }
    }
  }

  draw() {
    this.graphics.draw();
  }
}

class Connection {
  constructor(connString) {
    this.socket = io(connString);
  }
}

class Draw {
  constructor(canvas) {
    this.c = document.getElementById(canvas);
    this.ctx = this.c.getContext("2d");

    this.map = [];
  }

  clearScreen() {
    this.ctx.fillStyle="#fff";
    this.ctx.clearRect(0, 0, this.c.width, this.c.height);
  }

  sidebar() {
    this.ctx.fillStyle="#343434";
    this.ctx.fillRect(1000, 0, 200, 800);
  }

  chat() {
    this.ctx.fillStyle="#f4f142";
    this.ctx.fillRect(0, 800, 1200, 200);
  }

  UI() {
    this.sidebar();
    this.chat();
  }

  draw(map) {
    this.clearScreen();
    //this.drawMap();
    this.UI();
  }

}
