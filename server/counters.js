var router = require('express').Router(),
    lib = require('./lib'),
    User = lib.models.User;

router.post('/', function(req, res) {
  var bytes = req.body.bytes;

  User.getFromReqAsync(req)
    .then(function(user) {
      return [
        user.populateAsync({
          path: 'counters',
          match: { expired: false }
        }),
        user.update({
          bytes: { $add: ["$bytes", bytes] }
        })
      ];
    })
    .then(function(counters) {
      return counters.updateAsync({
        bytes: { $add: ["$bytes", bytes] }
      });
    })
    .then(function() {
      res.send('success');
    });
});

module.exports = router;
