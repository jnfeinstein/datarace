var router = require('express').Router(),
    lib = require('./lib'),
    User = lib.models.User;

router.get('/', function(req, res) {
  User.findAsync()
    .then(function(users) {
      res.json(users);
    });
});

router.get('/:id', function(req, res) {
  User.findById(req.params.id)
    .then(function(user) {
      res.json(user);
    });
});

router.get('/me', function(req, res) {
  User.getFromReqAsync(req)
    .then(function(user) {
      res.json(user);
    });
});

module.exports = router;
