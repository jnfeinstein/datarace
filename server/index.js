var app = require('express')(),
    env = require('./env'),
    http = require('http').Server(app),
    jwt = require('express-jwt'),
    lib = require('./lib'),
    mongo = lib.Mongo,
    path = require("path"),
    static = require('express').static;

var jwtCheck = jwt({
  secret: new Buffer('DF_36sXdNUenLHdB_tO1ewhuOkjgn5JL2FRGYL8Ljp2nd5Vdeg4i31pPAcnO1aUf', 'base64'),
  audience: 'anDND1WDueNYUpAyiwp4JN5sJVfZGsfC'
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/../www/index.html'));
});

app.use( '/challenges', jwtCheck);
app.use( '/challenges', require('./challenges') );

if ( !env.isProduction() ) {
  app.use(static('www'));
}

// Log all errors
app.use(function (err, req, res, next) {
  console.error(err.stack);
  next(err);
});

// Generic error handler
app.use(function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
});

lib.Mongo.connect();

http.listen(3000);
