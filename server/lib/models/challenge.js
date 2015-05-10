var findOrCreate = require('mongoose-findorcreate'),
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Schema = mongoose.Schema;

var ChallengeSchema = Schema({
  name: String,
  picture: String,
  creator: {type: Schema.ObjectId, ref: 'User'},
  users: [{type: Schema.ObjectId, ref: 'User'}],
  expiresAt: Date
});

ChallengeSchema.plugin(findOrCreate);

var Challenge = mongoose.model('Challenge', ChallengeSchema);
Promise.promisifyAll(Challenge);
Promise.promisifyAll(Challenge.prototype);

module.exports = Challenge;
