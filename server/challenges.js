var router = require('express').Router(),
    lib = require('./lib'),
    Challenge = lib.models.Challenge,
    Counter = lib.models.Counter,
    Invite = lib.models.Invite,
    User = lib.models.User;

router.get('/', function(req, res) {
  User.getFromReqAsync(req)
    .then(function(user) {
      return Challenge.findAsync({ users: user._id });
    })
    .then(function(challenges) {
      res.json(challenges);
    });
});

router.post('/', function(req, res) {
  var name = req.body.name,
      users = req.body.users;

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
      challenge[0].picture = reqUser.picture;

      Counter.createAsync({
        challenge: challenge._id,
        user: reqUser._id
      });

      users.forEach(function(user) {
        Invite.findOrCreateAsync({
          creator: reqUser._id,
          user: user,
          challenge: challenge[0]._id,
          picture: challenge[0].picture,
          name: challenge[0].name
        });
      });

      return challenge[0].saveAsync();
    })
    .then(function(challenge) {
      res.json(challenge[0]);
    });
});

module.exports = router;
