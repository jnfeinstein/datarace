var router = require('express').Router(),
    lib = require('./lib'),
    User = lib.models.User;

router.post('/', function(req, res) {
  var bytes = req.body.bytes;

  var reqUser;

  User.getFromReqAsync(req)
    .then(function(user) {
      reqUser = user;

      return user.populateAsync({
        path: 'counters',
        match: { expired: false }
      });
    })
    .then(function(counters) {
      return [
        reqUser.updateAsync({
          $inc: { bytes: bytes }
        }),
        counters.updateAsync({
          $inc: { bytes: bytes }
        })
      ];
    })
    .then(function(rez) {
      res.send('success');
    });
});

module.exports = router;
