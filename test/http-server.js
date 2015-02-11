var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  var data = JSON.stringify({ret:0});
  res.end(data);
}).listen(1234, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1234/');