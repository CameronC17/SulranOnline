var animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame    || window.oRequestAnimationFrame      || window.msRequestAnimationFrame     || null ;

var spriter = new Spriter();
var game = new Sulran("canvas", "http://localhost:8080");

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

window.addEventListener('mousedown', function(e) {game.mouseEvent(e, "down");}, false);
window.addEventListener('mouseup', function(e) {game.mouseEvent(e, "up");}, false);
window.addEventListener('mousemove', function(e) {game.mouseEvent(e, "move");}, false);

window.addEventListener('keyup', function(e) { game.Key.onKeyup(e); }, false);
window.addEventListener('keydown', function(e) { game.Key.onKeydown(e); }, false);

var recursiveAnim = function() {
  game.draw();
  animFrame(recursiveAnim);
}

function checkLoaded() {
  if (spriter.checkLoaded())
    animFrame(recursiveAnim);
  else {
    game.drawLoading();
		setTimeout(function () {
			//Recursively loop
	      checkLoaded();
	    }, 50);
  }
}

//wait for images to have loaded before starting the animation
checkLoaded();
