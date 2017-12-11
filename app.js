var express = require('express');
var request = require('request');
// var querystring = require('querystring');
var app = express();
// add '/wx'
var router = express.Router();

var sign = require('./sign.js');

// 测试号管理
// var APPID = 'wxd4be76ef2f5650ca';
// var APPSECRET = 'a0101e02f613b918f4b17b016aa86864';

var APPID = 'wx43d17d7d013dc48f';
var APPSECRET = 'e90a6f9769f8748cb164f4282ada0295';
var access_token = null;
var expires_in = null;
var curTime = null;
var jsapi_ticket = null;
var url = null;
var wxData_share = null;
router.get('/', function (req, res) {
  url = req.query.url.split('#')[0];
  res.send(url);
  // res.send('hi');

  // res.format({
  //   'text/plain': function () {
  //     res.send('hey');
  //   },

  //   'text/html': function () {
  //     res.send('<p>hey</p>');
  //   },

  //   'application/json': function () {
  //     res.send({ message: 'hey' });
  //   },

  //   'default': function () {
  //     // log the request and respond with 406
  //     res.status(406).send('Not Acceptable');
  //   }
  // });

});

router.get('/get_wxData_share', (req, res) => {
  url = req.query.url.split('#')[0];

  // if (req.query.url == undefined) {
  //   res.send('url参数错误');
  // }
  // url = req.query.url;
  // console.log(url);

  // Date.now() 13wei ms  1h 60*60*1000
  // if (!curTime || (Date.now() - curTime >= expires_in * 1e3)) {
  if (!curTime || (Date.now() - curTime >= 7000 * 1e3)) {
    console.log('nocache');
    getData();
  } else {
    console.log('cache');
    res.json({
      code: 0,
      type: 'cache',
      data: wxData_share
    });
  }

  function getData() {

    request.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`, (err, resp, body) => {
      // body = {"access_token":"ACCESS_TOKEN","expires_in":7200} str
      // res.end(body);

      if (err) {
        console.log('access_token err');
        res.end('access_token err');
      }
      access_token = JSON.parse(body).access_token;
      expires_in = JSON.parse(body).expires_in;
      curTime = Date.now();


      // https://mp.weixin.qq.com/wiki?action=doc&id=mp1421141115&t=0.40126891578020696#fl1
      request.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`, (err, resp, body) => {
        if (err) {
          console.log('jsapi_ticket err');
          res.send('jsapi_ticket err');
        }
        // 成功返回如下JSON
        jsapi_ticket = JSON.parse(body).ticket;
        // console.log(sign('jsapi_ticket', 'http://www.ylzbl.com/wx/h5/20171210/index.html'));
        /*
         *something like this
         *{
         *  jsapi_ticket: 'jsapi_ticket',
         *  nonceStr: '82zklqj7ycoywrk',
         *  timestamp: '1415171822',
         *  url: 'http://example.com',
         *  signature: '1316ed92e0827786cfda3ae355f33760c4f70c1f'
         *}
         */

        // 注意 URL 一定要动态获取，不能 hardcode.
        wxData_share = sign(jsapi_ticket, url);

        console.log('wxData_share ok', wxData_share);

        res.json({
          code: 0,
          type: 'nocache',
          data: wxData_share
        });

      });
    });
  }
});



app.use('/wx', router);
app.use('/wx', express.static('wx'));

var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
