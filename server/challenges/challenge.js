var mongoose = require('mongoose'),
    schema = lib.Mongo.Schemas.Challenge;

module.exports = Promise.promisifyAll( mongoose.model('Challenge', schema) );
