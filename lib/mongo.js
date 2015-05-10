var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

require('mongo-relation');

var ChallengeSchema = Schema({
  creator: ObjectId,
  users: [ObjectId],
  counters: [ObjectId],
  expiresAt: Date
});

var CounterSchema = Schema({
  user: ObjectId,
  challenge: ObjectId,
  bytes: Number
});

var UserSchema = Schema({
  id: String,
  challenges: [ObjectId],
  counters: [ObjectId],
  name: String,
  nickname: String,
  email: String,
  picture: String
});

UserSchema.habtm('Challenge');
UserSchema.hasMany('Counters');

ChallengeSchema.hasMany('Counter');
ChallengeSchema.habtm('User')
ChallengeSchema.hasOne('User', {through: 'creator', dependent: 'delete'});

CounterSchema.belongsTo('User', {dependent: 'delete'});
CounterSchema.belongsTo('Challenge', {dependent: 'delete'});



module.exports = {
  connect: function() {
    return mongoose.connect('mongodb://mongo.datarace.net/development');
  },
  Schemas: {
    Challenge: ChallengeSchema,
    Counter: CounterSchema,
    User: UserSchema
  }
}
