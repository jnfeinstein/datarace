var mongoose = require('mongoose');

mongoose.connect('mongodb://mongo.datarace.net/development');

module.exports = {
  db: mongoose.connection
}
