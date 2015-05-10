var router = require('express').Router(),
    User = require('../user');

router.get('/', function(req, res) {
  var user = User.fromReq(req);
  Challenge.findAsync({ participants: user.id })
    .then(function(challenges) {
      res.send(challenges);
    });
});

router.post('/new', function(req, res) {

});

module.exports = router;
