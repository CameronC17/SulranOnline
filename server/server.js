var io = require('socket.io')(8080);

//Class requires
var DBController = require('./DBController').DBController;
var Connected = require('./classes/connected').Connected;

//Create instances of classes
var connected = new Connected();

console.log("Server started");

io.on('connection', function (socket) {
  connected.addConnection(socket);

  socket.on('disconnect', function () {
    connected.disconnect(socket.id);
  });

  socket.on('input', function() {
    boooop();
  })



});
