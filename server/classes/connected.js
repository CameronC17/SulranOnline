class Connected {
  constructor(socket) {
    this.connected = [];
    console.log("Connected class - initialised.");
  }

  addConnection(conn) {
    //var ipAddress = conn.request.connection.remoteAddress;
    var user = {
      "id": conn.id,
      "username": ""
    }
    this.connected.push(user);
    console.log(" + New connection.");
  }

  disconnect(id) {
    var id = this.getConnectedIndexByID(id);
    if (id > -1) {
      this.connected.splice(id, 1);
      console.log(" - User disconnected.");
    } else {
      console.log("Unable to disconnect user, id not found");
    }
  }

  getConnectedIndexByID(id) {
    return this.connected.map(function(e) { return e.id; }).indexOf(id);
  }

}

exports.Connected = Connected;
