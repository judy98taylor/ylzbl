var http = require('http');
var url = require('url');
var util = require('util');
// http://47.94.13.114:8888/a/s/d?f=1
// http://127.0.0.1:8888/a/s/d?f=1
var cache = null;
var curTime = null;

http.createServer(function (req0, res0) {
  res0.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  // res0.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  // res0.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  var params = url.parse(req0.url, true);
  if (params.pathname == '/a/s/d') {
    // res.end(util.inspect(url.parse(req.url, true)));
    // res.end();
    if (params.query.f == 1) {

      // Date.now() 13wei ms  1h 60*60*1000
      if (!curTime || (Date.now() - curTime > 3000)) {
        getData();
      } else {
        res0.end(util.inspect({
          code: 0,
          type: 'cache',
          data: cache
        }));
      }

    } else {
      res0.end('search x');
    }
  } else {
    // res0.end('pathname x');

    res0.end(`<!DOCTYPE html>
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
      <img src="./images/logo.svg" alt="">
    </body>
    
    </html>
    `);
  }

  function getData() {
    http.get('http://nodejs.org/dist/index.json', (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error('请求失败。\n' +
          `状态码: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('无效的 content-type.\n' +
          `期望 application/json 但获取的是 ${contentType}`);
      }
      if (error) {
        console.error(error.message);
        // 消耗响应数据以释放内存
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          cache = parsedData;
          curTime = Date.now();
          // console.log(parsedData);
          res0.end(util.inspect({
            code: 0,
            data: cache
          }));
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(`错误: ${e.message}`);
    });
  }


  // res.end(util.inspect(url.parse(req.url, true)));
}).listen(8888);
