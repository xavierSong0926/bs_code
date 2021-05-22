var http = require('http');
var url = require('url');

//////
const fs = require('fs');
var path = require('path');
var cheerio=require("cheerio"); //>> npm install cheerio
 

function writeBody2file(fnam, body){
      fs.writeFileSync(fnam, body, function(err) {
        if(err) {
          return console.log(err);
        }

        console.log("The file was saved! "+fnm);
      });   
}


//create a server object:
http.createServer(function (req, res) {
  res.write('Hello World!'); //write a response to the client
  res.write(req.url);
  //res.write(req);

  var q = url.parse(req.url, true).query;
  var txt = q.year + " " + q.month;

  res.end(); //end the response
  console.log("req:",req.url);

  var ks=Object.keys(req);
  var s="req=\n"+JSON.stringify(ks,null,4);
  writeBody2file("b.json",s);
}).listen(8777); //the server object listens on port 8080