var auth = require('../auth'),
    findOrCreate = require('mongoose-findorcreate'),
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Schema = mongoose.Schema;

var UserSchema = Schema({
  authId: String,
  challenges: [{type: Schema.ObjectId, ref: 'Challenge'}],
  counters: [{type: Schema.ObjectId, ref: 'Counter'}],
  name: String,
  nickname: String,
  email: String,
  picture: String
});

UserSchema.plugin(findOrCreate);

UserSchema.methods.fetchAsync = function() {
  return api.getUserAsync(this.authId)
    .bind(this)
    .then(function(user) {
      ['email', 'picture', 'name', 'nickname'].forEach(function(prop) {
        this[prop] = user[prop];
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
