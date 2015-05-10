var Auth0 = Promise.promisifyAll( require('auth0') );

var api = new Auth0({
  domain:       'datarace.auth0.com',
  clientID:     'anDND1WDueNYUpAyiwp4JN5sJVfZGsfC',
  clientSecret: 'DF_36sXdNUenLHdB_tO1ewhuOkjgn5JL2FRGYL8Ljp2nd5Vdeg4i31pPAcnO1aUf'
});

function User(id) {
  this.id = id;
}

User.prototype.constructor = User;

User.prototype.fetch = function() {
  return api.getUserAsync(this.id)
    .bind(this)
    .then(function(user) {
      ['email', 'picture', 'name', 'nickname'].forEach(function(prop) {
        this[prop] = user[prop];
      });

      return this;
    })
    .catch(function(error) {
      this.error = error;
    });
}

User.prototype.error = function() {
  return this.error;
}

User.fromReq = function(req) {
  return new User(req.user.sub);
}

module.exports = User;
