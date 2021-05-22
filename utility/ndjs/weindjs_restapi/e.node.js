var express = require('express');
var path = require('path');
var app = express();
var url = require('url');


app.use(express.static(__dirname + 'client'));


app.get('/', function(req, res) {
    var q = url.parse(req.url, true).query;
    console.log("/q=", q);
    res.sendFile(path.join(__dirname + '/client/index.html'));
});
app.get('/client/client.js', function(req, res) {
    var q = url.parse(req.url, true).query;
    console.log("/client/q=", q);
    res.sendFile(path.join(__dirname + '/client/client.js'));
});

app.g_iPort=7777;
app.listen(app.g_iPort, () => {
    console.log("app listern port:",app.g_iPort);

  });
  console.log("port:", app.g_iPort);