global.Promise = require('bluebird');

var app = require('express')(),
    env = require('./env'),
    http = require('http').Server(app),
    jwt = require('express-jwt'),
    lib = require('../lib'),
    path = require("path"),
    static = require('express').static;

var jwtCheck = jwt({
  secret: new Buffer('DF_36sXdNUenLHdB_tO1ewhuOkjgn5JL2FRGYL8Ljp2nd5Vdeg4i31pPAcnO1aUf', 'base64'),
  audience: 'anDND1WDueNYUpAyiwp4JN5sJVfZGsfC'
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/../client/index.html'));
});

app.use( '/challenges', jwtCheck);
app.use( '/challenges', require('./challenges') );

if ( !env.isProduction() ) {
  app.use(static('.'));
}

http.listen(3000);
