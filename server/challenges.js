var router = require('express').Router(),
    lib = require('./lib'),
    Challenge = lib.models.Challenge,
    User = lib.models.User;

router.get('/', function(req, res) {
  User.getFromReqAsync(req)
    .then(function(user) {
      return Challenge.findAsync({ user: user._id });
    })
    .then(function(challenges) {
      res.json(challenges);
    });
});

router.post('/', function(req, res) {
  var name = req.body.name;

  var reqUser;

  User.getFromReqAsync(req)
    .then(function(user) {
      reqUser = user;
      return Challenge.findOrCreateAsync({
        creator: user._id,
        name: name
      });
    })
    .then(function(challenge) {
      challenge[0].users = [reqUser._id];
      return challenge[0].saveAsync();
    })
    .then(function(challenge) {
      res.json(challenge[0]);
    });
});

module.exports = router;
