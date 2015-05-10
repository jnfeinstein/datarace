var router = require('express').Router(),
    lib = require('./lib'),
    Counter = lib.models.Counter,
    User = lib.models.User;

router.post('/', function(req, res) {
  var bytes = req.body.bytes;

  var reqUser;

  User.getFromReqAsync(req)
    .then(function(user) {
      reqUser = user;

      return Counter.findAsync({
        user: user._id,
        expired: false
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
