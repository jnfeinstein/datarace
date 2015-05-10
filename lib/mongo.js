var mongoose = require('mongoose');

module.exports = {
  connect: function() {
    return mongoose.connect('mongodb://mongo.datarace.net/development');
  }
}
