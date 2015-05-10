var app = require('express')(),
    bodyParser = require('body-parser'),
    cors = require('cors'),
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

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/../www/index.html'));
});

app.use( '/challenges', jwtCheck);
app.use( '/challenges', require('./challenges') );

app.use( '/counters', jwtCheck);
app.use( '/counters', require('./counters') );

app.use( '/invites', jwtCheck);
app.use( '/invites', require('./invites') );

app.use( '/users', jwtCheck);
app.use( '/users', require('./users') );

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
  res.status(500).send(err);
});

lib.Mongo.connect();

http.listen(3000);
