var http = require("http");
var express = require("express");
var app = express();
app.use(express.static('public'));
app.get('/', function(req, res) {
  res.send('hello world');
});

var serve = app.listen(8888, () => {
  console.log('listen 8888');
});
