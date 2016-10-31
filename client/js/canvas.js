var animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame    || window.oRequestAnimationFrame      || window.msRequestAnimationFrame     || null ;

window.addEventListener('mousedown', function(e) {var pos = getMousePos(e);topGraph.mouseDown(pos);}, false);
window.addEventListener('mouseup', function(e) {var pos = getMousePos(e);topGraph.mouseUp(pos);}, false);
window.addEventListener('mousemove', function(e) {var pos = getMousePos(e);topGraph.mouseMove(pos);}, false);

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var game = new Sulran();

//animation loop
var recursiveAnim = function() {
    topGraph.draw();
    animFrame(recursiveAnim);
};
animFrame(recursiveAnim);

function getMousePos(evt) {
    var rect = this.c.getBoundingClientRect();
    //Return mouse location related to canvas with JSON format
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    }
}

function loadData(id) {
  //first we clear the objects
  topGraph.clearData();
  //add objects
  for (var i = 0; i < data[id].objects.length; i++) {
    var obj = data[id].objects[i];
    topGraph.addObject(obj[0], obj[1], obj[2], obj[3],obj[4], obj[5], obj[6]);
  }
  //add links
  for (var i = 0; i < data[id].links.length; i++) {
    var link = data[id].links[i];
    if (link.length == 2)
      topGraph.linkObject(link[0], link[1]);
    else
      topGraph.linkObject(link[0], link[1], link[2], link[3], link[4]);
  }
}
