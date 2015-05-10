var router = require('express').Router(),
    lib = require('./lib'),
    Challenge = lib.models.Challenge,
    User = lib.models.User;

router.get('/', function(req, res) {
  User.getFromReqAsync(req)
    .then(function(user) {
      return user.populateAsync('challenges');
    })
    .then(function(user) {
      res.json(user.challenges);
    });
});

router.post('/', function(req, res) {
  var name = req.body.name;

  User.getFromReqAsync(req)
    .then(function(user) {
      return Challenge.findOrCreate({
        creator: user._id,
        name: name
      });
    })
    .then(function(challenge) {
      res.json(challenge);
    });
});

module.exports = router;
