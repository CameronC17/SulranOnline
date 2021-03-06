var animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame    || window.oRequestAnimationFrame      || window.msRequestAnimationFrame     || null ;

//CANVAS IS 1400 X 750
//tiles drawn at 62.5% of their actual size
//draw the player at 25*43.75 (w*h)

//image loading stuff
var spriter = new Spriter();
var images = [
  {
    "name" : "tiles",
    "image" : "http://i.imgur.com/AFbBJVk.png",
    "width" : 16,
    "height" : 16,
    "mWidth" : 128,
    "mHeight" : 240,
    "timing" : 0
  },
  {
    "name" : "things",
    "image" : "http://i.imgur.com/JKPNOdD.png",
    "width" : 816,
    "height" : 208,
    "mWidth" : 816,
    "mHeight" : 208,
    "timing" : 0
  }
]
spriter.loadSprites(images);

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
var selectedObject = null;

//tile button vars
var tileButtons = [
  {"type": "g1", "x": 20, "y": 10},
  {"type": "g2", "x": 50, "y": 10},
  {"type": "g3", "x": 80, "y": 10},
  {"type": "w1", "x": 110, "y": 10},
  {"type": "b", "x": 20, "y": 40},
  {"type": "new", "x": 50, "y": 40},
  {"type": "w2", "x": 80, "y": 40}
];

var objectButtons = [
  { "object" : "tree1" },
  { "object" : "gate1" },
  { "object" : "sheep1" },
  { "object" : "box1" },
  { "object" : "seat1" }
];

var sizeButtons = [
  { "type": "manual", "x": 108, "y": 12 },
  { "type": "x+", "x": 40, "y": 35 },
  { "type": "x-", "x": 80, "y": 35 },
  { "type": "y+", "x": 40, "y": 66 },
  { "type": "y-", "x": 80, "y": 66 }
];

window.addEventListener('mousedown', function(e) { Mouse.mouseDown() }, false);
window.addEventListener('mouseup', function(e) { Mouse.mouseUp() }, false);
window.addEventListener('mousemove', function(e) { Mouse.mouseMove(e) }, false);

window.addEventListener('keyup', function(e) { Key.onKeyup(e); }, false);
window.addEventListener('keydown', function(e) { Key.onKeydown(e); }, false);

function inputMap() {
  if (textarea.value == "") {
    editMap = {
      "ground": [["w1", "w1", "w1"], ["w1", "w1", "w1"], ["w1", "w1", "w1"]],
      "objects": [],
      "npcs": []
    }
  } else {
    editMap = JSON.parse(textarea.value);
  }

  document.getElementById('input').style.display = "none";
  textarea.value = "";
}

function outputMap() {
  //create a new data uri and then link the user to it
  //var link = "www.google.com";
  //var dataURI = encodeURIComponent("data:application/octet-stream;charset=utf-8;base64," + JSON.stringify(editMap));
  //var dataURI = encodeURIComponent({"cam": 3, "yes": "ok"});
  //console.log(dataURI);
  //window.open(
    //  dataURI,
      //'_blank'
    //);

  //document.getElementById('outputText').innerText = JSON.stringify(editMap);
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
  var tile = getTile(selectedTile);
  var sprite = spriter.getSprite("tiles");
  ctx.drawImage(sprite.image,tile.xPos,tile.yPos,16,16,1285, 640, 80, 80);

  ctx.fillStyle="#fff";
  ctx.fillRect(1250, 500, 150, 2);

  //object selector bit
  ctx.fillStyle="#fff";
  ctx.fillRect(1250, 260, 150, 2);

  //and the increase/decrease size bit
  if (editMap != null) {
    ctx.font="16px Arial";
    ctx.fillText("Change size", 1266, 526);
    ctx.fillStyle="#550099";
    ctx.fillText("X", 1266, 552);
    ctx.fillText("Y", 1266, 580);
    ctx.fillText(editMap.ground[0].length, 1366, 552);
    ctx.fillText(editMap.ground.length, 1366, 580);
  }

  //hover tile
  ctx.fillStyle="#fff";
  ctx.fillText("x:" + hoverTile.x + ", y:" + hoverTile.y, 1260, 490);
  ctx.fillRect(1250, 470, 150, 2);

}

//paste the get tile function from sulran into here!!!!
function getTile(tile) {
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

//eventully wont need the width and height and stuff in here when we get images, but for now its necessary
function getObject(obj) {
  switch (obj) {
    case "tree1":
      return { "startX": 5, "startY": 1, "width": 50, "height": 53, "solid": true };
      break;
    case "seat1":
      return { "startX": 57, "startY": 21, "width": 30, "height": 15, "solid": true };
      break;
    case "gate1":
      return { "startX": 58, "startY": 1, "width": 19, "height": 16, "solid": true };
      break;
    case "sheep1":
      return { "startX": 88, "startY": 5, "width": 14, "height": 12, "solid": false };
      break;
    case "box1":
      return { "startX": 93, "startY": 21, "width": 18, "height": 26, "solid": false };
      break;
    default:
      return { "startX": 250, "startY": 50, "width": 15, "height": 15, "solid": false };
      break;
  }
}

function drawMap() {
  for (var y = 0; y < 30; y++) {
    for (var x = 0; x < 56; x++) {
      if (x + camera.x >= 0 && y + camera.y >= 0 && x + camera.x < editMap.ground[0].length && y + camera.y < editMap.ground.length) {
        var tile = getTile(editMap.ground[y + camera.y][x + camera.x]);
        var sprite = spriter.getSprite("tiles");
        ctx.drawImage(sprite.image,tile.xPos,tile.yPos,16,16,x*25,y*25,25,25);
      } else {
        ctx.fillStyle="#000";
        ctx.fillRect(x * 25, y * 25, 25, 25);
      }
    }
  }
}

function drawObjects() {
  for (let obj of editMap.objects) {
    var object = getObject(obj.object);
    //if the object is in sight
    //if (obj.x + object.width > (camera.x * 25) && obj.x < ((camera.x + 50) * 25) && obj.y + object.height > (camera.y * 25) && obj.y < ((camera.y + 30) * 25)) {
    if (obj.x + object.width > (camera.x * 25) - 100 && obj.x < ((camera.x + 60) * 25) + 200 && obj.y + object.height > (camera.y * 25) - 100 && obj.y < ((camera.y + 60) * 25) + 100) {
      var sprite = spriter.getSprite("things");
      ctx.drawImage(sprite.image,object.startX,object.startY,object.width,object.height,(obj.x * 0.625) - (camera.x * 25),(obj.y * 0.625) - (camera.y * 25),object.width * 0.625,object.height * 0.625);
      //ctx.drawImage(sprite.image,object.startX,object.startY,object.width,object.height,obj.x - (camera.x * 25),obj.y - (camera.y * 25),object.width * 0.625,object.height * 0.625);
      //ctx.fillStyle=objData.colour;
      //ctx.fillRect(obj.x - (camera.x * 25), obj.y - (camera.y * 25), objData.width, objData.height);
    }
  }
}

function setWalls() {
  for (var i = 0; i < editMap.ground.length; i++) {
    //if we are at the top or bottom
    if (i == 0 || i == editMap.ground.length - 1) {
      for (var j = 0; j < editMap.ground[i].length; j++) {
        editMap.ground[i][j] = selectedTile;
      }
    } else {
        editMap.ground[i][0] = selectedTile;
        editMap.ground[i][editMap.ground[i].length - 1] = selectedTile;
    }
  }
}

function checkKeys() {
  //movement around the area
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

  //auto walls to the edges key
  if (Key.isDown(Key.WALLS))
    setWalls();
}

function drawMouseHover() {
  //check if mouse is within boundaries
  if (Mouse.pos.x > 0 && Mouse.pos.x < 1250 && Mouse.pos.y > 0 && Mouse.pos.y < 750) {
    hoverTile.x = Math.floor(Mouse.pos.x / 25) + camera.x;
    hoverTile.y = Math.floor(Mouse.pos.y / 25) + camera.y;

    var hoverPos = {
      "x": Mouse.pos.x - (Mouse.pos.x % 25),
      "y": Mouse.pos.y - (Mouse.pos.y % 25)
    }
    ctx.globalAlpha=0.8;
    if (selectedObject == null) {
      ctx.fillStyle="#fff600";
      ctx.fillRect(hoverPos.x, hoverPos.y, 25, 25);
    } else {
      var object = getObject(selectedObject);
      var sprite = spriter.getSprite("things");
      ctx.drawImage(sprite.image,object.startX,object.startY,object.width,object.height,Mouse.pos.x - (object.width * 0.625), Mouse.pos.y - (object.height * 0.625),object.width * 0.625,object.height * 0.625);
      //ctx.fillRect(Mouse.pos.x - object.width, Mouse.pos.y - object.height, object.width, object.height);
    }
    ctx.globalAlpha=1;
  }
}

function changeTile() {
  //if we are hovering over a tile
  if (hoverTile.x >= 0 && hoverTile.y >= 0 && hoverTile.x < editMap.ground[0].length && hoverTile.y < editMap.ground.length) {
    editMap.ground[hoverTile.y][hoverTile.x] = selectedTile;
  }
}

function addNewObject(newObj) {
  // if the ojbects array is empty.... else
  var newObjDetails = getObject(newObj.object);
  if (editMap.objects.length == 0) {
    editMap.objects.push(newObj);
  } else {
    if (editMap.objects.length == 1) {
      var checkObjDetails = getObject(editMap.objects[0].object);
      if (newObj.y + (newObjDetails.height * 0.625) < editMap.objects[0].y + (checkObjDetails.height * 0.625))
        editMap.objects.unshift(newObj);
      else
        editMap.objects.push(newObj);
    } else {
      var added = false;
      for (var i = 0; i < editMap.objects.length; i++) {
        var obj = editMap.objects[i];
        var checkObjAgain = getObject(obj.object);
        if (newObj.y + (newObjDetails.height * 0.625) < obj.y + (checkObjAgain.height * 0.625)) {
          editMap.objects.splice(i, 0, newObj);
          added = true;
          break;
        }
      }
      if (!added)
        editMap.objects.push(newObj);
    }
  }
}

function placeObject() {
  var object = getObject(selectedObject);
  var objData = {
    "x": (((camera.x * 25) + Mouse.pos.x) * 1.6) - object.width,
    "y": (((camera.y * 25) + Mouse.pos.y) * 1.6) - object.height
    //"x": (camera.x * 25) + Mouse.pos.x - (object.width * 0.625),
    //"y": (camera.y * 25) + Mouse.pos.y - (object.height * 0.625)
  }
  if (objData.x > 0 && objData.x + object.width < editMap.ground[0].length * 40 && objData.y > 0 && objData.y + object.height < editMap.ground.length * 40) {
    addNewObject({ "object" : selectedObject, "x": objData.x, "y": objData.y });
  }
}

function drawTileSelector() {
  for (let button of tileButtons) {
    var tile = getTile(button.type);
    var sprite = spriter.getSprite("tiles");
    ctx.drawImage(sprite.image,tile.xPos,tile.yPos,16,16,1250 + button.x,0 + button.y,25,25);
  }
}

function drawObjectSelector() {
  var currPos = { "x": 0, "y": 0 }
  for (let button of objectButtons) {
    var obj = getObject(button.object);
    //ctx.fillStyle="#222222";
    //ctx.fillRect(1270 + currPos.x, 270 + currPos.y, 25, 25);
    var sprite = spriter.getSprite("things");
    var scale = 0;
    if (obj.width > obj.height) {
      scale = obj.width / 25;
      ctx.drawImage(sprite.image,obj.startX,obj.startY,obj.width,obj.height,1270 + currPos.x,270 + currPos.y, 25, (obj.height / scale));
      //ctx.fillRect(1270 + currPos.x, 270 + currPos.y, 25, (obj.height / scale));
    } else if (obj.height > obj.width) {
      scale = obj.height / 25;
      ctx.drawImage(sprite.image,obj.startX,obj.startY,obj.width,obj.height,1270 + currPos.x,270 + currPos.y, (obj.width / scale), 25);
      //ctx.fillRect(1270 + currPos.x, 270 + currPos.y, (obj.width / scale), 25);
    } else {
      ctx.drawImage(sprite.image,obj.startX,obj.startY,obj.width,obj.height,1270 + currPos.x,270 + currPos.y, 25, 25);
      //ctx.fillRect(1270 + currPos.x, 270 + currPos.y, 25, 25);
    }

    currPos.x += 30;
    if (currPos.x > 110) {
      currPos.x = 0;
      currPos.y += 30;
    }
  }
}

function drawPlayerScale() {
  ctx.fillStyle="#f262bb";
  ctx.globalAlpha="0.7";
  ctx.fillRect(400, 487, 18.75, 37.5);
  ctx.globalAlpha="1";
}

function tileSelector() {
  for (let button of tileButtons) {
    var buttPos = { "x": button.x + 1250, "y": button.y + 0 }
    if (Mouse.pos.x > buttPos.x && Mouse.pos.x < buttPos.x + 25 && Mouse.pos.y > buttPos.y && Mouse.pos.y < buttPos.y + 25) {
      selectedTile = button.type;
      selectedObject = null;
    }
  }
}

function objectSelector() {
  var currPos = { "x": 0, "y": 0 };
  for (let button of objectButtons) {
    var buttPos = { "x": 1270 + currPos.x, "y": 270 + currPos.y };
    if (Mouse.pos.x > buttPos.x && Mouse.pos.x < buttPos.x + 25 && Mouse.pos.y > buttPos.y && Mouse.pos.y < buttPos.y + 25) {
      selectedObject = button.object;
    }
    currPos.x += 30;
    if (currPos.x > 110) {
      currPos.x = 0;
      currPos.y += 30;
    }
  }
}

function drawSizeChanger() {
  for (let button of sizeButtons) {
    ctx.font="14px Arial";
    var xWidth = 25;
    if (button.type == "manual") {
      ctx.font="11px Arial";
      xWidth = 40;
    }
    ctx.fillStyle="#000088";
    ctx.fillRect(1250 + button.x, 500 + button.y, xWidth, 18);
    ctx.fillStyle="#fff";
    ctx.fillText(button.type, 1250 + button.x + 4, 500 + button.y + 14);
  }
}

function editMapSize(x, y) {
  //if we want to add to the x
  if (x > 0) {
    for (let row of editMap.ground) {
      for (var i = 0; i < x; i++) {
        row.push(selectedTile);
      }
    }
  } else if (x < 0) {
    x *= -1;
    for (let row of editMap.ground) {
      row.splice(-x, x);
    }
  }

  //if we want to add to the y
  if (y > 0) {
    // add the arrays to the big array
    for (var i = 0; i < y; i++) {
      editMap.ground.push([]);
      var numColumns = editMap.ground[0].length;
      for (var n = 0; n < numColumns; n++) {
        editMap.ground[editMap.ground.length - 1].push(selectedTile);
      }
    }
  } else if (y < 0) {
    y *= -1;
    editMap.ground.splice(-y, y);
  }

  //console.log(editMap.ground[0].length, editMap.ground.length);
}

function manualSetSize() {
  var mapWidth = window.prompt("Please enter the width you want.");
  var mapHeight = window.prompt("Please enter the height you want.");
  var currWidth = editMap.ground[0].length;
  var currHeight = editMap.ground.length;
  editMapSize((mapWidth - currWidth), (mapHeight - currHeight));
}

function sizeChanger() {
  for (let button of sizeButtons) {
    var buttPos = { "x": button.x + 1250, "y": button.y + 500 };
    var xWidth = 25;
    if (button.type == "manual")
      xWidth = 40;
    if (Mouse.pos.x > buttPos.x && Mouse.pos.x < buttPos.x + xWidth && Mouse.pos.y > buttPos.y && Mouse.pos.y < buttPos.y + 18) {
      switch (button.type) {
        case "manual":
          manualSetSize();
          break;
        case "x+":
          editMapSize(1, 0);
          break;
        case "x-":
          editMapSize(-1, 0);
          break;
        case "y+":
          editMapSize(0, 1);
          break;
        case "y-":
          editMapSize(0, -1);
          break;
        default:
          console.log("Unkown button clicked. ?!?!?!1");
          break;
      }
    }
  }
}

var recursiveAnim = function() {
  clearScreen();
  //console.log(Key.isDown(Key.SPACE));
  if (editMap != null){
    drawMap();
    drawObjects();
  }
  drawSidebar();
  drawTileSelector();
  drawObjectSelector();
  if (editMap != null)
    drawSizeChanger();
  drawPlayerScale();
  drawMouseHover();
  checkKeys();
  animFrame(recursiveAnim);
};

ctx.fillStyle="#006688";
ctx.fillRect(0, 0, c.width, c.height);
ctx.fillStyle="#fff";
ctx.fillText("Loading", 300, 300);

function checkLoaded() {
  if (spriter.checkLoaded())
    animFrame(recursiveAnim);
  else {
		setTimeout(function () {
			//Recursively loop
	      checkLoaded();
	    }, 50);
  }
}

//wait for images to have loaded before starting the animation
checkLoaded();

var Mouse = {
  pos: {"x": -1, "y": -1},
  down: false,
  mouseMove: function(event) {
    this.pos = this.getMousePos(event);
    if (editMap != null && this.down && selectedObject == null)
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
    if (this.pos.x > 0 && this.pos.x < 1401 && this.pos.y > 0 && this.pos.y < 751) {
      this.down = true;
      //if we have a map loaded
      if (editMap != null) {
        //if the click isnt in the sidebar
        if (this.pos.x < 1250) {
          if (selectedObject == null)
            changeTile();
          else
            placeObject();
        }
        else {
          //if were at the top or bottom of the sidebar
          if (this.pos.y < 260) {
            tileSelector();
          } else if (this.pos.y < 470) {
            objectSelector();
          } else
            sizeChanger();
        }
      }
    }
  },
  mouseUp: function() {
    //this.pos = {"x": -1, "y": -1};
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
  WALLS: 80,
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
