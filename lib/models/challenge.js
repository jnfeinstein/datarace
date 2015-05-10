var mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Schema = mongoose.Schema;

var ChallengeSchema = Schema({
  creator: {type: Schema.ObjectId, ref: 'User'},
  users: [{type: Schema.ObjectId, ref: 'User'}],
  counters: [{type: Schema.ObjectId, ref: 'Counter'},],
  expiresAt: Date
});

var Challenge = mongoose.model('Challenge', ChallengeSchema);
Promise.promisifyAll(Challenge);
Promise.promisifyAll(Challenge.prototype);

module.exports = Challenge;
