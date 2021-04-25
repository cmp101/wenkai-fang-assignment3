var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = require('../models/Post.js');
var User = require('../models/User.js');
var Comment = require('../models/Comment.js');

/* GET ALL PostS */
router.get('/', async function(req, res, next) {
  try {
    const posts = await Post.find().populate('author').sort({ created_date: 1 }).exec()
    res.json(posts);
  } catch (err) {
    if (err) return next(err);
  }
});

/* GET SINGLE Post BY ID */
router.get('/:id', async function(req, res, next) {
  try {
    const posts = await Post.findById(req.params.id).populate('author').populate({ path: 'comments', options: { sort: { 'created_date': 1 } }, populate: { path: 'author' }}).exec()
    res.json(posts);
  } catch (err) {
    if (err) return next(err);
  }
});

/* SAVE Post */
router.post('/', function(req, res, next) {
  Post.create({
  title: req.body.title,
  body: req.body.body,
  url: req.body.url,
  author: req.body.author,
  }, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE Post */
router.put('/:id', function(req, res, next) {
  Post.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE Post */
router.delete('/:id', function(req, res, next) {
  Post.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
