var router = require('express').Router(),
    Challenge = lib.models.Challenge,
    User = lib.models.User;

router.get('/', function(req, res) {
  User.getFromReqAsync(req)
    .then(function(user) {
      return user.populateAsync('challenges');
    })
    .then(function(user) {
      res.json(user.challenges);
    });
});

router.post('/new', function(req, res) {

});

module.exports = router;
