var findOrCreate = require('mongoose-findorcreate'),
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Schema = mongoose.Schema;

var InviteSchema = Schema({
  creator: {type: Schema.ObjectId, ref: 'User'},
  user: {type: Schema.ObjectId, ref: 'User'},
  challenge: { type: Schema.ObjectId, ref: 'Challenge'}
});

InviteSchema.plugin(findOrCreate);

var Invite = mongoose.model('Invite', InviteSchema);
Promise.promisifyAll(Invite);
Promise.promisifyAll(Invite.prototype);

module.exports = Invite;
