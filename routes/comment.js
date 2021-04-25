var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = require('../models/Post.js');
var User = require('../models/User.js');
var Comment = require('../models/Comment.js');

/* GET ALL Comment */
router.get('/', function(req, res, next) {
  Comment.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

/* GET SINGLE Comment BY ID */
router.get('/:id', function(req, res, next) {
  Comment.findById(req.params.id, function (err, comment) {
    if (err) return next(err);
    res.json(comment);
  });
});

/* SAVE Comment */
router.post('/', async function(req, res, next) {
  const commentData = { post_id: req.body.post_id, text: req.body.text, author: req.body.author }
  Comment.create(commentData, async function (err, comment) {
    if (err) return next(err);
    const allComments = req.body.comments
    allComments.push(comment)
    const updated = await Post.findByIdAndUpdate(req.body.post_id, { comments: allComments}).exec()
    const post = await Post.findById(req.body.post_id).populate('author').populate({ path: 'comments', options: { sort: { 'created_date': 1 } }, populate: { path: 'author' } }).exec()
    res.json(post);
  });
});

/* UPDATE Comment */
router.put('/:id', function(req, res, next) {
  Comment.findByIdAndUpdate(req.params.id, req.body, function (err, comment) {
    if (err) return next(err);
    res.json(comment);
  });
});

/* DELETE Comment */
router.delete('/:id', function(req, res, next) {
  Comment.findByIdAndRemove(req.params.id, req.body, function (err, comment) {
    if (err) return next(err);
    res.json(comment);
  });
});

module.exports = router;
