var debug = false;

function getObject(obj) {
  switch (obj) {
    case "tree1":
      return { "startX": 5, "startY": 1, "width": 50, "height": 53, "solid": true, "solidStartX": 20, "solidStartY": 45, "solidWidth": 10, "solidHeight": 10 };
      break;
    case "seat1":
      return { "startX": 57, "startY": 21, "width": 30, "height": 15, "solid": true, "solidStartX": 0, "solidStartY": 0, "solidWidth": 30, "solidHeight": 1 };
      break;
    case "gate1":
      return { "startX": 58, "startY": 1, "width": 19, "height": 16, "solid": true, "solidStartX": 5, "solidStartY": 6, "solidWidth": 10, "solidHeight": 10 };
      break;
    case "sheep1":
      return { "startX": 88, "startY": 5, "width": 14, "height": 12, "solid": true, "solidStartX": 2, "solidStartY": 1, "solidWidth": 10, "solidHeight": 6 };
      break;
    case "box1":
      return { "startX": 93, "startY": 21, "width": 18, "height": 26, "solid": true, "solidStartX": 0, "solidStartY": 14, "solidWidth": 18, "solidHeight": 8 };
      break;
    default:
      return { "startX": 250, "startY": 50, "width": 15, "height": 15, "solid": false };
      break;
  }
}

class Sulran {
    constructor(canvas, connString) {
        //this.connection = new Connection(connString);
        this.map = new Map();
        this.player = new Player(this.map);
        this.graphics = new Draw(canvas, this, this.player);

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
        if (pos.x > 0 && pos.x < this.c.width && pos.y > 0 && pos.y < this.c.height)
            this.mouse[type] = [pos.x, pos.y];
    }

    getMousePos(evt) {
        var rect = this.c.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        }
    }

    createKey() {
        return {
            //http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
            _pressed: {},
            LEFT: 65,
            UP: 87,
            RIGHT: 68,
            DOWN: 83,
            checkMovement: function() {
              if (this._pressed[this.LEFT] && !this._pressed[this.RIGHT])
                spriter.changeAnimation("character", "moveLeft");
              else if (this._pressed[this.RIGHT] && !this._pressed[this.LEFT])
              spriter.changeAnimation("character", "moveRight");

              if (this._pressed[this.UP] && !this._pressed[this.DOWN])
                spriter.changeAnimation("character", "moveUp");
              else if (this._pressed[this.DOWN] && !this._pressed[this.UP])
              spriter.changeAnimation("character", "moveDown");


            },
            isEmpty: function() {
              return !(this._pressed[this.LEFT] || this._pressed[this.UP] || this._pressed[this.RIGHT] || this._pressed[this.DOWN]);
            },
            isDown: function(keyCode) {
              if (this.isEmpty())
                spriter.changeAnimation("character", "idle");
              else
                this.checkMovement();

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

    loaded() {
      spriter.animate("character", true);
    }

    drawLoading() {
      this.ctx.fillStyle="#22bb77";
      this.ctx.fillRect(0, 0, this.c.width, this.c.height);
      this.ctx.fillStyle="#fff";
      this.ctx.fillText("Loading...", 20, 20);
    }

    checkMouseCommand() {
        if (this.mouse.down[0] > -1 && this.mouse.down[1] > -1) {
            if (this.mouse.down[0] < 1000 && this.mouse.down[1] < 800) {
                console.log("game screen");
            } else if (this.mouse.down[0] >= 1000 && this.mouse.down[1] < 800) {
                console.log("side bar");
            } else if (this.mouse.down[1] >= 800) {
                console.log("chat");
            }
            this.mouse.down = [-1, -1];
        }
    }

    engine() {
      //stuff before the draw
      this.player.move(this.Key);
      this.checkMouseCommand();

      //get all necessary data
      this.graphics.visibleMap = this.map.build(this.player.position);

      //draw
      this.graphics.draw();
    }
}

class Weapon {
    constructor(type){
        this.name = "Pistol";
        this.image = "google.com";
        this.damage = 5;
        this.distance = 200;
        this.fireSpeed = 50;
        this.reloadSpeed = 200;
        this.currAmmo = 12;
        this.maxAmmo = 36;
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
    constructor(canvas, game, player) {
        this.c = document.getElementById(canvas);
        this.ctx = this.c.getContext("2d");

        this.game = game;
        this.player = player;

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

    spellbar() {
        var xPos = 350;
        this.ctx.font = "12px Arial";
        for (var i = 0; i < 6; i++) {
            //background
            this.ctx.fillStyle = "#343434";
            this.ctx.fillRect(xPos, 730, 50, 50);
            this.ctx.fillStyle = "#595959";
            this.ctx.fillRect(xPos + 5, 735, 40, 40);

            //put the spell images here

            //put the spell cooldowns here

            //text
            this.ctx.fillStyle = "#fff";
            this.ctx.fillText(i + 1, xPos + 22, 777);

            xPos += 60;
        }
    }

    weaponIndicator() {
        this.ctx.globalAlpha = 0.6;
        //background
        this.ctx.fillStyle="#444444";
        this.ctx.fillRect(840, 720, 150, 70);


        //weapon image
        this.ctx.fillStyle = "#fff";
        this.ctx.font = "30px Arial";
        //replace with an image eventually !!!!!!!!!!!!!
        this.ctx.fillText(this.player.weapon.name, 910, 754);

        //weapon ammo indicator
        //text
        this.ctx.font = "18px Arial";
        this.ctx.fillText(this.player.weapon.currAmmo + "/" + this.player.weapon.maxAmmo, 848, 754);

        //bullets
        var startX = 850;
        var startY = 760;
        for (var i = 0; i < this.player.weapon.maxAmmo; i++) {
            if (i <= this.player.weapon.currAmmo)
                this.ctx.fillStyle = "#fff";
            else
                this.ctx.fillStyle = "#222222";
            this.ctx.fillRect(startX, startY, 3, 7);
            startX += 5;
            if (startX == 980) {
                startX = 850;
                startY += 9;
            }
        }

        this.ctx.globalAlpha = 1;
    }

    UI() {
        this.spellbar();
        this.weaponIndicator();
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
        // TILES
        // first numbers to centre the character
        var sprite = spriter.getSprite("tiles");
        var xPos = -20 - (this.visibleMap.pModX),
            yPos = -30 - (this.visibleMap.pModY);
        for (var y = 1; y < this.visibleMap.map.length; y++) {
            for (var x = 0; x < this.visibleMap.map[0].length; x++) {
                var tile = this.getTile(this.visibleMap.map[y][x]);
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

        // OBJECTS
        var lastPosition = -10;
        //console.log(this.visibleMap.objs.length);
        var things = spriter.getSprite("things");
        for (let object of this.visibleMap.objs) {
          var obj = getObject(object.object);
          //check when to draw the player
          if (this.game.player.position[1] + 15 > lastPosition && this.game.player.position[1] + 15 <= object.y + obj.height && lastPosition != null) {
            this.playerDraw();
            lastPosition = null;
          }
          else if (lastPosition != null)
            lastPosition = object.y + obj.height;

          //now draw the actual object
          var objPos = {
            "x": 500 + (object.x - this.visibleMap.pX),
            "y": 410 + (object.y - this.visibleMap.pY)
          }

          this.ctx.drawImage(things.image,obj.startX,obj.startY,obj.width,obj.height,objPos.x,objPos.y,obj.width,obj.height);

          if (debug) {
            if (obj.solid) {
              this.ctx.fillStyle="#0000bb";
              this.ctx.fillRect(object.x + obj.solidStartX  - this.visibleMap.pX + 500, object.y + obj.solidStartY  - this.visibleMap.pY + 410, obj.solidWidth, obj.solidHeight);
            }
          }
        }
        //if we have gone through all of the objects and still not drawn the player
        if (lastPosition != null) {
          this.playerDraw();
        }
    }

    playerDraw() {
        var playerSprite = spriter.getSprite("character");
        this.ctx.drawImage(playerSprite.image,playerSprite.x,playerSprite.y, playerSprite.width, playerSprite.height, 480, 364, 40, 60);

        if (debug) {
          this.ctx.globalAlpha=0.7;
          //solid bit
          this.ctx.fillStyle="#ff00ff";
          this.ctx.fillRect(483, 393, 35, 35);
          this.ctx.globalAlpha=1;
        }
    }

    debugLines() {
      this.ctx.fillStyle="#ff66cc";
      this.ctx.fillRect(0, 399, 1000, 2);
      this.ctx.fillRect(499, 0, 2, 800);
    }

    draw() {
        this.clearScreen();
        this.visibleLand();
        this.UI();

        if (debug)
          this.debugLines();
    }

}

class Player {
    constructor(map) {
        this.map = map;

        //player info
        this.position = [60, 60];
        this.weapon = new Weapon();
        this.cHealth = 100;
        this.mHealth = 100;
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

      //                                                 speed    \/
      this.position = this.map.checkMoveTiles(this.position, movement, 3);
    }
}

class Map {
    constructor() {
        this.map = map;
    }

    checkMoveTiles(currPos, dir, speed) {
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
          "y": currPos[1],
          "moved": false
        }

        //add the else within each if to return the closest position if movement too large
        if (yMove > 0) {
          if (this.map.sulran.ground[playerBounds.bottomSide][playerPos.xLeft] != "w1" && this.map.sulran.ground[playerBounds.bottomSide][playerPos.xRight] != "w1") {
            retPos.y += yMove;
            retPos.moved = true;
          }
        } else {
          if (this.map.sulran.ground[playerBounds.topSide][playerPos.xLeft] != "w1" && this.map.sulran.ground[playerBounds.topSide][playerPos.xRight] != "w1") {
            retPos.y += yMove;
            retPos.moved = true;
          }
        }

        if (xMove > 0) {
          if (this.map.sulran.ground[playerPos.yUp][playerBounds.rightSide] != "w1" && this.map.sulran.ground[playerPos.yDown][playerBounds.rightSide] != "w1") {
            retPos.x += xMove;
            retPos.moved = true;
          }
        } else {
          if (this.map.sulran.ground[playerPos.yUp][playerBounds.leftSide] != "w1" && this.map.sulran.ground[playerPos.yDown][playerBounds.leftSide] != "w1") {
            retPos.x += xMove;
            retPos.moved = true;
          }
        }

        if (retPos.moved) {
            return this.checkMoveObjects(currPos, {"x": xMove, "y": yMove}, retPos);
        } else {
            return [retPos.x, retPos.y];
        }
    }


    checkMoveObjects(currPos, velocity, noObjPos) {
        var playerBounds = {
          "leftSide": (currPos[0] - 15 + velocity.x),
          "rightSide": (currPos[0] + 15 + velocity.x),
          "topSide": (currPos[1] - 15 + velocity.y),
          "bottomSide": (currPos[1] + 15 + velocity.y)
        }

        var hitObject = { x: false, y: false };
        for (let object of this.map.sulran.objects) {
            let obj = getObject(object.object);
            if (obj.solid) {
                if ((playerBounds.rightSide > object.x + obj.solidStartX) && (playerBounds.leftSide < object.x + obj.solidStartX + obj.solidWidth) && (playerBounds.bottomSide - velocity.y > object.y + obj.solidStartY) && (playerBounds.topSide - velocity.y < object.y + obj.solidStartY + obj.solidHeight)) {
                    hitObject.x = true;
                }
                if ((playerBounds.bottomSide > object.y + obj.solidStartY) && (playerBounds.topSide < object.y + obj.solidStartY + obj.solidHeight) && (playerBounds.rightSide - velocity.x > object.x + obj.solidStartX) && (playerBounds.leftSide - velocity.x < object.x + obj.solidStartX + obj.solidWidth)) {
                    hitObject.y = true;
                }
            }
        }

        if (!hitObject.x && !hitObject.y)
            return [noObjPos.x, noObjPos.y];

        if (!hitObject.x)
            currPos[0] += velocity.x;
        if (!hitObject.y)
            currPos[1] += velocity.y;

        return currPos;

        // if (hitObject)
        //     return oldPos;
        // else
        //     return [attemptPos.x, attemptPos.y];

    }

    build(playerPos) {
        var rtnMap = [];
        var rtnObjs = [];
        var userPosOnGrid = {
            "x": Math.floor(playerPos[0] / 40),
            "y": Math.floor(playerPos[1] / 40)
        }

        //builds the map tiles
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

        //builds the objects on the map
        for (let object of map.sulran.objects) {
          if (object.x > playerPos[0] - 800 && object.x < playerPos[0] + 800 && object.y > playerPos[1] - 800 && object.y < playerPos[1] + 800) {
            rtnObjs.push(object);
          }
        }

        var graphics = {
            "map": rtnMap,
            "objs": rtnObjs,
            "pX": playerPos[0],
            "pY": playerPos[1],
            "pModX": playerPos[0] % 40,
            "pModY": playerPos[1] % 40
        }

        return graphics;
    }


}
