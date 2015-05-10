var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = Schema({
  creator: String,
  participants: [String],
  expiresAt: Date
});

var challenge = mongoose.model('Challenge', schema);

module.exports = Promise.promisifyAll(challenge);
