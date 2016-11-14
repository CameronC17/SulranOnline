var animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame    || window.oRequestAnimationFrame      || window.msRequestAnimationFrame     || null ;

//CANVAS IS 1400 X 750

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

//game vars

var camera = { "x": 3, "y": 5 };
var mouse = { "x": -1, "y": -1};
var lastPress = new Date().getTime();

window.addEventListener('mousedown', function(e) {Mouse.mouseDown()}, false);
window.addEventListener('mouseup', function(e) {Mouse.mouseUp()}, false);
window.addEventListener('mousemove', function(e) {Mouse.mouseMove(e)}, false);

window.addEventListener('keyup', function(e) { Key.onKeyup(e); }, false);
window.addEventListener('keydown', function(e) { Key.onKeydown(e); }, false);

function drawSidebar() {
  ctx.fillStyle="#888888";
  ctx.fillRect(1250, 0, 150, c.height);//dfgdfgd
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
      if (x + camera.x >= 0 && y + camera.y >= 0 && x + camera.x < map.sulran.ground[0].length && y + camera.y < map.sulran.ground.length) {
        ctx.fillStyle=getTile(map.sulran.ground[y + camera.y][x + camera.x]);
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
  if (now > lastPress + 100) {
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

}

var recursiveAnim = function() {
  //console.log(Key.isDown(Key.SPACE));
  drawMap();
  drawSidebar();
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
  },
  mouseUp: function() {
    this.pos = {"x": -1, "y": -1};
    lastPress -= 500;
    this.down = false;
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
