var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: false },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  body: { type: String, required: false },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  updated_date: { type: Date, default: Date.now },
  created_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
