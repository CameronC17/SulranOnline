var animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame    || window.oRequestAnimationFrame      || window.msRequestAnimationFrame     || null ;

var game = new Sulran("canvas", "http://localhost:8080");

window.addEventListener('mousedown', function(e) {game.mouseEvent(e, "down");}, false);
window.addEventListener('mouseup', function(e) {game.mouseEvent(e, "up");}, false);
window.addEventListener('mousemove', function(e) {game.mouseEvent(e, "move");}, false);

var recursiveAnim = function() {
  game.draw();
  animFrame(recursiveAnim);
};
animFrame(recursiveAnim);
