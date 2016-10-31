var mongoose = require('mongoose');

class DBController {
  constructor(connString) {
    mongoose.connect(connString);
    this.User = require('./db/user');
    console.log("Database connected: " + connString);
  }

}

exports.DBController = DBController;
