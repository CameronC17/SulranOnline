var animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame    || window.oRequestAnimationFrame      || window.msRequestAnimationFrame     || null ;

//CANVAS IS 1400 X 750

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var editMap = null;

//html elements
var textarea = document.getElementById('textarea');
document.getElementById('input').addEventListener("click", inputMap);
document.getElementById('output').addEventListener("click", outputMap);

//game vars
var camera = { "x": 0, "y": 0 };
var mouse = { "x": -1, "y": -1 };
var lastPress = new Date().getTime();
var hoverTile = { "x": -1, "y": -1 };
var selectedTile = "w1";

//tile button vars
var buttons = [
  {"type": "g1", "x": 20, "y": 10},
  {"type": "g2", "x": 50, "y": 10},
  {"type": "w1", "x": 80, "y": 10},
  {"type": "b1", "x": 110, "y": 10}
];

window.addEventListener('mousedown', function(e) { Mouse.mouseDown() }, false);
window.addEventListener('mouseup', function(e) { Mouse.mouseUp() }, false);
window.addEventListener('mousemove', function(e) { Mouse.mouseMove(e) }, false);

window.addEventListener('keyup', function(e) { Key.onKeyup(e); }, false);
window.addEventListener('keydown', function(e) { Key.onKeydown(e); }, false);

function inputMap() {
  //editMap = JSON.parse(textarea.value);
  editMap = map.sulran;
  document.getElementById('input').style.display = "none";
  textarea.value = "";
}

function outputMap() {
  textarea.value = JSON.stringify(editMap);
}

function clearScreen() {
  ctx.fillStyle="#fff";
  ctx.clearRect(0, 0, c.width, c.height);
}

function drawSidebar() {
  ctx.fillStyle="#888888";
  ctx.fillRect(1250, 0, 150, c.height);//dfgdfgd

  //now for the selected tile bit
  ctx.fillStyle="#fff";
  ctx.fillRect(1250, 600, 150, 2);
  ctx.font="20px Arial";
  ctx.fillText("Selected Tile", 1266, 626);
  ctx.fillStyle=getTile(selectedTile);
  ctx.fillRect(1285, 640, 80, 80);
}

//paste the get tile function from sulran into here!!!!
function getTile(tile) {
    switch (tile) {
        case "w1":
            return "#ff0000";
            break;
        case "g1":
            return "#33ff33";
            break;
        case "g2":
            return "#117711";
            break;
        case "b":
            return "#000";
            break;
        default:
            return "#0000ff";
            break;
    }
}

function drawMap() {
  for (var y = 0; y < 30; y++) {
    for (var x = 0; x < 56; x++) {
      if (x + camera.x >= 0 && y + camera.y >= 0 && x + camera.x < editMap.ground[0].length && y + camera.y < editMap.ground.length) {
        ctx.fillStyle=getTile(editMap.ground[y + camera.y][x + camera.x]);
        ctx.fillRect(x * 25, y * 25, 25, 25);
      } else {
        ctx.fillStyle="#000";
        ctx.fillRect(x * 25, y * 25, 25, 25);
      }
    }
  }
}

function checkMovementKeys() {
  var now = new Date().getTime();
  //if the last press was over 0.2secs ago
  if (now > lastPress + 60) {
    if (Key.isDown(Key.LEFT))
      camera.x--;
    if (Key.isDown(Key.RIGHT))
      camera.x++;
    if (Key.isDown(Key.UP))
      camera.y--;
    if (Key.isDown(Key.DOWN))
      camera.y++;

    lastPress = now;
  }
}

function drawMouseHover() {
  //check if mouse is within boundaries
  if (Mouse.pos.x > 0 && Mouse.pos.x < 1250 && Mouse.pos.y > 0 && Mouse.pos.y < 750) {
    hoverTile.x = Math.floor(Mouse.pos.x / 25);
    hoverTile.y = Math.floor(Mouse.pos.y / 25);

    var hoverPos = {
      "x": Mouse.pos.x - (Mouse.pos.x % 25),
      "y": Mouse.pos.y - (Mouse.pos.y % 25)
    }
    ctx.globalAlpha=0.8;
    ctx.fillStyle="#fff600";
    ctx.fillRect(hoverPos.x, hoverPos.y, 25, 25);
    ctx.globalAlpha=1;
  }
}

function changeTile() {
  //if the mouse is down
  if (Mouse.down) {
    //if we are hovering over a tile
    if (hoverTile.x + camera.x >= 0 && hoverTile.y + camera.y >= 0 && hoverTile.x + camera.x < editMap.ground[0].length && hoverTile.y + camera.y < editMap.ground.length) {
      //set that tile to the new one
      editMap.ground[hoverTile.y + camera.y][hoverTile.x + camera.x] = selectedTile;
    }
  }
}

function drawTileSelector() {
  for (let button of buttons) {
    ctx.fillStyle=getTile(button.type);
    ctx.fillRect(1250 + button.x, 0 + button.y, 25, 25);
  }
}

function tileSelector() {
  for (let button of buttons) {
    var buttPos = { "x": button.x + 1250, "y": button.y + 0 }
    if (Mouse.pos.x > buttPos.x && Mouse.pos.x < buttPos.x + 25 && Mouse.pos.y > buttPos.y && Mouse.pos.y < buttPos.y + 25) {
      selectedTile = button.type;
    }
  }
}

var recursiveAnim = function() {
  clearScreen();
  //console.log(Key.isDown(Key.SPACE));
  if (editMap != null)
    drawMap();
  drawSidebar();
  drawTileSelector();
  drawMouseHover();
  checkMovementKeys();
  animFrame(recursiveAnim);
};
animFrame(recursiveAnim);

var Mouse = {
  pos: {"x": -1, "y": -1},
  down: false,
  mouseMove: function(event) {
    this.pos = this.getMousePos(event);
    if (editMap != null)
      changeTile();
  },
  getMousePos: function(event) {
      var rect = c.getBoundingClientRect();
      return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
      }
  },
  mouseDown: function() {
    this.down = true;
    if (editMap != null) {
      if (this.pos.x < 1250)
        changeTile();
      else
        tileSelector();
    }
  },
  mouseUp: function() {
    this.pos = {"x": -1, "y": -1};
    this.down = false;
    lastPress -= 500;
  },
  reset: function() {
    this.pos = {"x": -1, "y": -1};
  }
}

var Key = {
  //http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
  _pressed: {},
  SPACE: 32,
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
