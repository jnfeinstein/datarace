var router = require('express').Router(),
    lib = require('./lib'),
    Counter = lib.models.Counter,
    User = lib.models.User;

router.get('/', function(req, res) {
  User.getFromReqAsync(req)
    .then(function(user) {
      return Counter.findAsync({
        user: user._id
      });
    })
    .then(function(counters) {
      res.json(counters);
    });
});

router.post('/', function(req, res) {
  var bytes = req.body.bytes;

  var reqUser;

  User.getFromReqAsync(req)
    .then(function(user) {
      reqUser = user;

      return Counter.findAsync({
        user: user._id
      });
    })
    .then(function(counters) {
      reqUser.updateAsync({
        $inc: { bytes: bytes }
      });

      counters.forEach(function(counter) {
        counter.updateAsync({
          $inc: { bytes: bytes }
        });
      });

      res.send('success');
    });
});

module.exports = router;
