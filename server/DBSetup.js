var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sulran');

var UserSchema = new mongoose.Schema({
  username : { type: String, required: true },
  password : { type: String, required: true }
});

var User = mongoose.model('User', UserSchema);

var userArray = [
  {
    "username" : "Cameron",
    "password" : "password"
  },
  {
    "username" : "Snez",
    "password" : "password"
  }
];

User.collection.insert(userArray, onInsert);

function onInsert(err, docs) {
    if (err) {
        console.log("Unable to add documents to the database.");
    } else {
        console.info('All users were successfully stored.');
    }
}
