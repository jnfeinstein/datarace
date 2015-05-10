var auth = require('../auth'),
    findOrCreate = require('mongoose-findorcreate'),
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Schema = mongoose.Schema;

var UserSchema = Schema({
  authId: String,
  challenges: [{type: Schema.ObjectId, ref: 'Challenge'}],
  invites: [{type: Schema.ObjectId, ref: 'Invite'}],
  counters: [{type: Schema.ObjectId, ref: 'Counter'}],
  name: String,
  nickname: String,
  email: String,
  picture: String,
  bytes: Number
});

UserSchema.plugin(findOrCreate);

UserSchema.methods.fetchAsync = function() {
  return auth.getUserAsync(this.authId)
    .bind(this)
    .then(function(user) {
      var self = this;

      ['email', 'picture', 'name', 'nickname'].forEach(function(prop) {
        self[prop] = user[prop];
      });

      return this;
    })
    .catch(function(error) {
      this.error = error;
      return error;
    });
}

var User = mongoose.model('User', UserSchema);
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

User.getFromReqAsync = function(req) {
  var authId = req.user.sub;

  return User.findOrCreateAsync({ authId: authId })
    .then(function(users) {
      return users[0];
    });
}

module.exports = User;
