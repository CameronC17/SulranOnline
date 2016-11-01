class Sulran {
  constructor(canvas, connString) {
    this.socket = new Connection(connString);
    this.graphics = new Draw(canvas);

    this.userPosition = [15, 15];

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
    for (var y = this.userPosition[1] - 10; y < this.userPosition[1] + 10; y++) {
      var row = [];
      for (var x = this.userPosition[0] - 13; x < this.userPosition[0] + 13; x++) {
        if (y < 0 || x < 0) {
          row.push("b");
        } else if (y >= map.sulran.ground.length || x >= map.sulran.ground[0].length) {
          row.push("b");
        } else {
          row.push(map.sulran.ground[y][x]);
        }
      }
      rtnMap.push(row);
    }
    this.graphics.visibleMap = rtnMap;
  }

  draw() {
    //get all necessary data
    this.buildMap();

    //draw
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

    this.visibleMap = [];
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

  getTile(tile) {
    switch (tile) {
      case "w1":
        return "#ff0000";
        break;
      case "g1":
        return "#33ff33";
        break;
      case "b":
        return "#000";
        break;
      default:
        return "#0000ff";
        break;
    }
  }

  visibleLand() {
    var xPos = 0,
        yPos = 0;
    for (var y = 0; y < this.visibleMap.length; y++) {
      for (var x = 0; x < this.visibleMap[0].length; x++) {
        var tile = this.visibleMap[y][x];
        this.ctx.fillStyle = this.getTile(tile);
        this.ctx.fillRect(xPos, yPos, 40, 40);
        xPos += 40;
      }
      xPos = 0;
      yPos += 40;
    }

    //this.ctx.fillStyle="#00ff00";
    //this.ctx.fillRect(300, 300, 300, 300)
  }

  draw() {
    this.clearScreen();
    this.visibleLand();
    this.UI();
  }

}
