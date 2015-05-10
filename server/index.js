var app = require('express')(),
    env = require('./env'),
    http = require('http').Server(app),
    lib = require('../lib'),
    path = require("path"),
    static = require('express').static;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/../client/index.html'));
});

if ( !env.isProduction() ) {
  app.use(static('.'));
}

http.listen(3000);
