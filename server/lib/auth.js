var Auth0 = require('auth0'),
    Promise = require('bluebird');

var api = new Auth0({
  domain:       'datarace.auth0.com',
  clientID:     'anDND1WDueNYUpAyiwp4JN5sJVfZGsfC',
  clientSecret: 'DF_36sXdNUenLHdB_tO1ewhuOkjgn5JL2FRGYL8Ljp2nd5Vdeg4i31pPAcnO1aUf'
});

Promise.promisifyAll(api);

module.exports = api;