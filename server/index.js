var app     = require('express')(),
    http    = require('http').Server(app),
    path    = require("path"),
    static  = require('express').static;

app.use(static('www'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/../client/index.html'));
});

http.listen(3000);
