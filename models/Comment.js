var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CommentSchema = new mongoose.Schema({
  text: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  post_id: { type: Schema.Types.ObjectId, ref: 'Post' },
  updated_date: { type: Date, default: Date.now },
  created_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', CommentSchema);
