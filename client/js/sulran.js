var debug = true;

class Sulran {
    constructor(canvas, connString) {
        //this.connection = new Connection(connString);
        this.graphics = new Draw(canvas, spriter);
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
                this._pressed[event.keyCode] = true;
            },
            onKeyup: function(event) {
                delete this._pressed[event.keyCode];
            }
        }
    }

    drawLoading() {
      this.ctx.fillStyle="#22bb77";
      this.ctx.fillRect(0, 0, this.c.width, this.c.height);
      this.ctx.fillStyle="#fff";
      this.ctx.fillText("Loading...", 20, 20);
    }

    draw() {
      //stuff before the draw
      this.player.move(this.Key);


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

    emit(data) {
        this.socket.emit('boop');
    }
}

class Draw {
    constructor(canvas) {
        this.c = document.getElementById(canvas);
        this.ctx = this.c.getContext("2d");

        this.visibleMap = {};
    }

    clearScreen() {
        this.ctx.fillStyle = "#f733e7";
        this.ctx.fillRect(0, 0, this.c.width, this.c.height);
    }

    sidebar() {
        this.ctx.fillStyle = "#343434";
        this.ctx.fillRect(1000, 0, 200, 800);
    }

    chat() {
        this.ctx.fillStyle = "#f4f142";
        this.ctx.fillRect(0, 800, 1200, 200);
    }

    UI() {
        this.sidebar();
        this.chat();
    }

    getTile(tile) {
      switch (tile) {
          case "w1":
              return {"xPos": 0, "yPos": 0};
              break;
          case "w2":
              return {"xPos": 96, "yPos": 16};
              break;
          case "g1":
              return {"xPos": 64, "yPos": 16};
              break;
          case "g2":
              return {"xPos": 16, "yPos": 128};
              break;
          case "g3":
              return {"xPos": 48, "yPos": 16};
              break;
          case "b":
              return {"xPos": 96, "yPos": 32};
              break;
          case "new":
              return {"xPos": 16, "yPos": 16};
              break;
          default:
              return {"xPos": 96, "yPos": 128};
              break;
      }
    }

    visibleLand() {
        // first numbers to centre the character
        var xPos = -20 - (this.visibleMap.pModX),
            yPos = -30 - (this.visibleMap.pModY);
        for (var y = 1; y < this.visibleMap.map.length; y++) {
            for (var x = 0; x < this.visibleMap.map[0].length; x++) {
                var tile = this.getTile(this.visibleMap.map[y][x]);
                var sprite = spriter.getSprite("tiles");
                this.ctx.drawImage(sprite.image,tile.xPos,tile.yPos,16,16,xPos,yPos,40,40);

                //test stuff on tiles. remove eventually!
                if (debug) {
                  this.ctx.strokeStyle="#fff";
                  this.ctx.fillStyle="#fff";
                  this.ctx.strokeRect(xPos,yPos,40,40);
                  this.ctx.fillText(this.visibleMap.map[y][x], xPos + 2, yPos + 10);
                }

                xPos += 40;
            }
            xPos = -20 - (this.visibleMap.pModX);
            yPos += 40;
        }
    }

    player() {
        this.ctx.fillStyle = "#ffff66";
        this.ctx.fillRect(485, 366, 30, 60);
    }

    debugLines() {
      this.ctx.fillStyle="#ff66cc";
      this.ctx.fillRect(0, 399, 1000, 2);
      this.ctx.fillRect(499, 0, 2, 800);
    }

    draw() {
        this.clearScreen();
        this.visibleLand();
        this.player();
        this.UI();
        if (debug)
          this.debugLines();
    }

}

class Player {
    constructor(map) {
        this.position = [60, 60];
        this.map = map;
    }

    move(keypress) {
      var movement = {
          "up": false,
          "down": false,
          "left": false,
          "right": false,
      }
      if (keypress.isDown(keypress.LEFT)) {
          movement.left = true;
      }
      if (keypress.isDown(keypress.RIGHT)) {
          movement.right = true;
      }
      if (keypress.isDown(keypress.UP)) {
          movement.up = true;
      }
      if (keypress.isDown(keypress.DOWN)) {
          movement.down = true;
      }

      this.position = this.map.checkMove(this.position, movement, 3);
    }
}

class Map {
    constructor() {
        this.map = map;
    }

    checkMove(currPos, dir, speed) {
        var userPosOnGrid = {
            "x": Math.floor(currPos[0] / 40),
            "y": Math.floor(currPos[1] + 30 / 40)
        }

        var xMove = 0,
            yMove = 0;

        if (dir.up)
            yMove -= speed;
        if (dir.down)
            yMove += speed;
        if (dir.left)
            xMove -= speed;
        if (dir.right)
            xMove += speed;

        var playerPos = {
            "xLeft": Math.floor((currPos[0] - 15) / 40),
            "xRight": Math.floor((currPos[0] + 15) / 40),
            "yUp": Math.floor((currPos[1] - 15) / 40),
            "yDown": Math.floor((currPos[1] + 15) / 40)
        }

        var playerBounds = {
          "leftSide": Math.floor((currPos[0] - 15 + xMove) /40),
          "rightSide": Math.floor((currPos[0] + 15 + xMove) /40),
          "topSide": Math.floor((currPos[1] - 15 + yMove) /40),
          "bottomSide": Math.floor((currPos[1] + 15 + yMove) /40)
        }

        var retPos = {
          "x": currPos[0],
          "y": currPos[1]
        }

        if (yMove > 0) {
          if (this.map.sulran.ground[playerBounds.bottomSide][playerPos.xLeft] != "w1" && this.map.sulran.ground[playerBounds.bottomSide][playerPos.xRight] != "w1") {
            retPos.y += yMove;
          }
        } else {
          if (this.map.sulran.ground[playerBounds.topSide][playerPos.xLeft] != "w1" && this.map.sulran.ground[playerBounds.topSide][playerPos.xRight] != "w1") {
            retPos.y += yMove;
          }
        }

        if (xMove > 0) {
          if (this.map.sulran.ground[playerPos.yUp][playerBounds.rightSide] != "w1" && this.map.sulran.ground[playerPos.yDown][playerBounds.rightSide] != "w1") {
            retPos.x += xMove;
          }
        } else {
          if (this.map.sulran.ground[playerPos.yUp][playerBounds.leftSide] != "w1" && this.map.sulran.ground[playerPos.yDown][playerBounds.leftSide] != "w1") {
            retPos.x += xMove;
          }
        }

        return [retPos.x, retPos.y];
    }

    build(playerPos) {
        var rtnMap = [];
        var userPosOnGrid = {
            "x": Math.floor(playerPos[0] / 40),
            "y": Math.floor(playerPos[1] / 40)
        }
        for (var y = userPosOnGrid.y - 12; y < userPosOnGrid.y + 13; y++) {
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
