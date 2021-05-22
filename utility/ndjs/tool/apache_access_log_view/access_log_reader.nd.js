

const fs = require('fs');
var path = require('path');
//var cheerio=require("cheerio"); //>> npm install cheerio




//fs.writeSync()


function getDateTime() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return year + "-" + month + "-" + day + "," + hour + ":" + min + ":" + sec;

}
var dt = getDateTime();
console.log(dt);
//return;
function sort_val(oFrq) {
  const iLEN = 10;
  var tmp = [];
  Object.keys(oFrq).forEach(function (k, i) {
    var str = oFrq[k].toString().padStart(iLEN, "0") + k;
    tmp.push(str);
    console.log(str);
  });
  tmp.sort().reverse();
  var ret = {};
  for (var i = 0; i < tmp.length; i++) {
    var frq = tmp[i].substr(0, iLEN);
    var key = tmp[i].substr(iLEN);
    ret[key] = parseInt(frq);
  }
  return ret;
}
function access_log_to_json() {
  const logfilename = "/var/log/apache2/access_log";
  var log = fs.readFileSync("access_log", "utf8");
  var lnarr = log.split(/[\n|\r]/);
  console.log(lnarr.length);
  var retArr = [], IpFrq = {}, RqFrq = {};

  // 22.54.103.239 - - [30/Apr/2019:01:49:41 -0400] "GET /PMA2017/index.php?lang=en HTTP/1.1" 404 215
  var reg = new RegExp(/((\d{1,3}[\.]\d{1,3}[\.]\d{1,3}[\.]\d{1,3})|(\:\:1)|(\\[\w]+\\[\w]+\\[\w]+\\[\w]+))\s+\-\s+\-\s+\[([^\]]+)\]\s+[\"]([^\"]{0,})[\"]\s(\w+)\s+([\w\-]+)$/, "");

  lnarr.forEach(function (line, i) {
    var nodarr = line.split(/[\s]+/);
    //console.log(nodarr.length);
    if (nodarr.length != 10) {
      //console.log(line);
    }

    var mat = line.match(reg);
    if (mat) {
      if (mat[1] === "::1") {
        console.log(mat);
      }
      var ip = mat[1], req = mat[6];
      retArr.push({ ip: ip, dtm: mat[5], req: req, d1: mat[7], d2: mat[8] });
      if (undefined == IpFrq[ip]) {
        IpFrq[ip] = 0;
      }
      IpFrq[ip]++;
      if (undefined == RqFrq[req]) {
        RqFrq[req] = 0;
      }
      RqFrq[req]++;

    }
    else {
      console.log(line);
    }

  });

  var str = "var access_log=\n" + JSON.stringify(retArr, null, 4);
  fs.writeFileSync("access_log.json.js", str);

  RqFrq = sort_val(RqFrq);
  var str = "var access_fr_RqFrq=\n" + JSON.stringify(RqFrq, null, 4);
  fs.writeFileSync("access_fr_RqFrq.json.js", str);

  IpFrq = sort_val(IpFrq);
  var str = "var access_fr_IpFrq=\n" + JSON.stringify(IpFrq, null, 4);
  fs.writeFileSync("access_fr_IpFrq.json.js", str);
}
access_log_to_json();