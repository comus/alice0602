var express = require('express');
var app = express();
var Server = require('http').Server;
var server = new Server(app);

server.listen(8080);

app.use('/', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
