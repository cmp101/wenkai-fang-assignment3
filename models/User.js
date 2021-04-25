var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
  username: { type: String, unique : true, required : true, dropDups: true },
  password: { type: String, required : true },
  name: String,
  updated_date: { type: Date, default: Date.now },
  created_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
