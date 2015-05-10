var mongoose = require('mongoose'),
    schema = lib.Mongo.Schemas.Counter;

module.exports = Promise.promisifyAll( mongoose.model('Counter', schema) );
