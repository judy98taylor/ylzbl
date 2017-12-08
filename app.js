var express = require('express');
var request = require('request');
var querystring = require('querystring');
var app = express();
// add '/wx'
var router = express.Router();
var APPID = 'wx43d17d7d013dc48f';
var APPSECRET = 'e90a6f9769f8748cb164f4282ada0295';
router.get('/', function(req, res) {
  res.send(`<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script>
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?51087724efba08bc0eb242d22ef54815";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
    </script>
    
  </head>
  
  <body>
    <p style="color:red;">web pathname x</p>
    <img src="http://nodejs.cn/static/images/logo.svg" alt="">
    <img src="/wx/asd/images/gif.gif" alt="">
  </body>
  
  </html>
  `);
});

router.get('/get', function(req, res) {

  // req.query get
  // req.params post

  var obj = { a: 1, b: 2, c: 3 };
  request.get(`http://nodejs.org/dist/index.json?${querystring.stringify(obj)}`, function(error, response, body) {
    // console.log('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.

    res.json(JSON.parse(body));
  });

});

router.get('/get_access_token', (req, res) => {
  request.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`, (err, resp, body) => {
    // body = {"access_token":"ACCESS_TOKEN","expires_in":7200} str
    res.end(body);
  });
});





app.use('/wx', router);
app.use('/wx', express.static('wx'));

var server = app.listen(8888, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
