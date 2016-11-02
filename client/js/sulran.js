debug = true;

class Sulran {
  constructor(canvas, connString) {
    this.connection = new Connection(connString);
    this.graphics = new Draw(canvas);
    this.map = new Map();
    this.player = new Player(this.map);

    this.c = document.getElementById(canvas);
    this.ctx = this.c.getContext("2d");

    //variables
    this.mouse = {
      "down": [-1, -1],
      "up": [-1, -1],
      "move": [-1, -1]
    }

    this.Key = this.createKey();
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

  createKey() {
    var obj = this;
    return {
    	//http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
      _pressed: {},
      LEFT: 65,
      UP: 87,
      RIGHT: 68,
      DOWN: 83,
      isDown: function(keyCode) {
        return this._pressed[keyCode];
      },
      onKeydown: function(event) {
        var movement = {
          "up": false,
          "dowm": false,
          "left": false,
          "right": false,
        }
        if (event.keyCode == 65) {
          movement.left = true;
        }
        if (event.keyCode == 68) {
          movement.right = true;
        }
        if (event.keyCode == 87) {
          movement.up = true;
        }
        if (event.keyCode == 83) {
          movement.down = true;
        }

        obj.player.move(movement);

        this._pressed[event.keyCode] = true;
      },
      onKeyup: function(event) {
        delete this._pressed[event.keyCode];
      }
    }
  }

  draw() {
    //get all necessary data
    this.graphics.visibleMap = this.map.build(this.player.position);

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

    this.visibleMap = {};
  }

  clearScreen() {
    this.ctx.fillStyle="#f733e7";
    this.ctx.fillRect(0, 0, this.c.width, this.c.height);
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
    // first numbers to centre the character
    var xPos = -40 - (this.visibleMap.pModX),
        yPos = -15 - (this.visibleMap.pModY);
    for (var y = 1; y < this.visibleMap.map.length; y++) {
      for (var x = 0; x < this.visibleMap.map[0].length; x++) {
        var tile = this.visibleMap.map[y][x];
        this.ctx.fillStyle = this.getTile(tile);
        this.ctx.fillRect(xPos, yPos, 40, 40);
        xPos += 40;
      }
      xPos = -40 - (this.visibleMap.pModX);
      yPos += 40;
    }
  }

  player() {
    this.ctx.fillStyle="#ffff66";
    this.ctx.fillRect(480, 355, 40, 70);
  }

  draw() {
    this.clearScreen();
    this.visibleLand();
    this.player();
    this.UI();
  }

}

class Player {
  constructor(map) {
    this.position = [40, 40];
    this.map = map;
  }

  move(movement) {
    if (movement.left)
      this.position[0]-=3;
    if (movement.right)
      this.position[0]+=3;
    if (movement.up)
      this.position[1]-=3;
    if (movement.down)
      this.position[1]+=3;

  }
}

class Map {
  constructor() {

  }

  build(playerPos) {
    var rtnMap = [];
    var userPosOnGrid = {
      "x": Math.floor(playerPos[0] / 40),
      "y": Math.floor(playerPos[1] / 40)
    }
    for (var y = userPosOnGrid.y - 11; y < userPosOnGrid.y + 13; y++) {
      var row = [];
      for (var x = userPosOnGrid.x - 13; x < userPosOnGrid.x + 14; x++) {
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
    var graphics = {
      "map": rtnMap,
      "pModX": playerPos[0] % 40,
      "pModY": playerPos[1] % 40
    }

    return graphics;
  }


}
