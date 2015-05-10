var auth = require('../auth'),
    findOrCreate = require('mongoose-findorcreate'),
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Schema = mongoose.Schema;

var UserSchema = Schema({
  newAuth: Boolean,
  challenges: [{type: Schema.ObjectId, ref: 'Challenge'}],
  invites: [{type: Schema.ObjectId, ref: 'Invite'}],
  counters: [{type: Schema.ObjectId, ref: 'Counter'}],
  name: String,
  nickname: String,
  email: String,
  password: String,
  picture: String,
  bytes: Number,
});

UserSchema.plugin(findOrCreate);

UserSchema.methods.fetchAsync = function() {
  return auth.getUserAsync("auth0|" + this._id)
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
  return User.findById( req.user.sub.replace('auth0|','') )
    .then(function(user) {
      return users;
    });
}

module.exports = User;
