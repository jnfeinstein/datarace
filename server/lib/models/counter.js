var findOrCreate = require('mongoose-findorcreate'),
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Schema = mongoose.Schema;

var CounterSchema = Schema({
  user: {type: Schema.ObjectId, ref: 'User'},
  challenge: {type: Schema.ObjectId, ref: 'Challenge'},
  bytes: Number,
  expired: Boolean
});

CounterSchema.plugin(findOrCreate);

var Counter = mongoose.model('Counter', CounterSchema);
Promise.promisifyAll(Counter);
Promise.promisifyAll(Counter.prototype);

module.exports = Counter;
