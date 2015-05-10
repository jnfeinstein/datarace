var router = require('express').Router(),
    lib = require('./lib'),
    User = lib.models.User;

router.get('/', function(req, res) {
  User.findAsync({ newAuth: false })
    .then(function(users) {
      res.json(users);
    });
});

router.get('/me', function(req, res) {
  User.getFromReqAsync(req)
    .then(function(user) {
      res.json(user);
    });
});

router.get('/:id', function(req, res) {
  User.findById(req.params.id)
    .then(function(user) {
      res.json(user);
    });
});

setInterval(function() {
  User.findAsync({ newAuth: true })
    .then(function(users) {
      return users.map(function(user) {
        return user.fetchAsync();
      });
    })
    .map(function(user) {
      if (!user instanceof Error) {
        user.newAuth = false;
        return user.saveAsync();
      }
    });
}, 5000);

module.exports = router;
