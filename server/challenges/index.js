var router = require('express').Router(),
    Challenge = require('./challenge'),
    User = require('../user');

router.get('/', function(req, res) {
  var user = User.fromReq(req);
  Challenge.findAsync({ participants: user.id })
    .then(function(challenges) {
      res.send(challenges);
    });
});

module.exports = router;
