var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var crypto = require('../utils/crypt.js')

/* GET SINGLE User BY ID */
router.get('/:id', function(req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if (err) return next(err);
    res.json(user);
  });
});

/* REGISTER User */
router.post('/register', function(req, res, next) {
  var hashedPassword = crypto.encrypt(req.body.password);
  User.create({
    username : req.body.username,
    password : hashedPassword
  }, function (err, user) {
    if (err) return res.status(500).send("There was a problem registering the user.", err)
    // create a token
    res.status(200).send({ user_id: user._id, username: user.username });
  });
});

/* LOGIN User */
router.post('/login', function(req, res, next) {
  var hashedPassword = crypto.encrypt(req.body.password);
  User.findOne({ username: req.body.username }, function (err, user) {
    // create a token
    if (!user) return res.status(404).send("User not found!")
    if (user && hashedPassword !== user.password) return res.status(401).send("Invalid Credentials")
    // if (err) return res.status(500).send("There was a problem registering the user.")
    res.status(200).send({ user_id: user._id, username: user.username });
  });
});

/* UPDATE User */
router.put('/:id', function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
    if (err) return next(err);
    res.json(user);
  });
});

/* DELETE User */
router.delete('/:id', function(req, res, next) {
  User.findByIdAndRemove(req.params.id, req.body, function (err, user) {
    if (err) return next(err);
    res.json(user);
  });
});

module.exports = router;
