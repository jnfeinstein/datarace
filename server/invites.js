var router = require('express').Router(),
    lib = require('./lib'),
    Invite = lib.models.Invite,
    Challenge = lib.models.Challenge,
    Counter = lib.models.Counter,
    User = lib.models.User,
    Promise = require('bluebird');

router.get('/', function(req, res) {
  User.getFromReqAsync(req)
    .then(function(user) {
      return Invite.findAsync({ user: user._id });
    })
    .then(function(invites) {
      res.json(invites);
    });
});

router.post('/', function(req, res) {
  var userIds = req.body.users,
      challengeId = req.body.challenge;

  var reqUser;

  User.getFromReqAsync(req)
    .then(function(user) {
      return userIds.map(function(userId) {
        return Invite.findOrCreateAsync({
          creator: reqUser._id,
          user: userId,
          challenge: challengeId
        });
      });
    })
    .then(function() {
      res.send('success');
    });
});

router.post('/:id', function(req, res) {
  var id = req.params.id,
      accept = req.body.accept;

  var reqUser;

  User.getFromReqAsync(req)
    .then(function(user) {
      reqUser = user;
      return Invite.findByIdAsync(id);
    })
    .then(function(invite) {
      if ( !invite.user.equals(reqUser._id) ) {
        return Promise.reject('not authorized');
      }

      invite.remove();

      if (accept) {
        return [
          Challenge.updateAsync(
            { _id: invite.challenge },
            { $push: { users: invite.user } }
          ),
          Counter.createAsync({
            challenge: invite.challenge,
            user: invite.user
          })
        ];
      }
    })
    .then(function() {
      res.send('success');
    })
    .catch(function() {
      res.send('not authorized');
    })
});

module.exports = router;
