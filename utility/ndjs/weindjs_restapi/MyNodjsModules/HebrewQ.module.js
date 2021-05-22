//2018/05/12 MyNodejsModuels/Uti.module.js

const fs = require('fs');
const path = require('path');
var url = require('url'); //for web app.

var Uti = require("./Uti.module").Uti;

// require("../../../../../../wdingbox/hebrew_ciu/HebrewQ/audjs/") //path for module.
//const HROOT = "../../../../../wdingbox/hebrew_ciu/HebrewQ/audjs/"; //path for runtime svr.
const HROOT = "../../../../hebrew_ciu/HebrewQ/audjs/"; //path for runtime svr.
//require("../../../../../hebrew_ciu/HebrewQ/audjs")

var HebrewUti = {
  get_VocabHebrewBufObj: function () {
    var currentPath = process.cwd();
    console.log(currentPath);


    var filesArr = Uti.getFileNamesFromDir(HROOT, ".js");

    console.log(filesArr);

    //return;
    var targf = HROOT + "VocabHebrewBuf.js"
    var content = fs.readFileSync(targf, "utf8");
    var idx = 2 + content.indexOf("=\n");
    var shead = content.substr(0, idx);
    console.log("shead==", shead);
    content = content.substring(idx);

    var obj = JSON.parse(content);
    Object.keys(obj).forEach(function (k) {
      var arr = obj[k];
      //console.log(k,arr);
    });
    return { header: shead, obj: obj, fname: targf };
  },
  updateVocabHebrewBuf: function (inpObj) {
    fs.writeFileSync(inpObj.fname, JSON.stringify(inpObj.dat, null, 4), 'utf8');//debug only.

    var upobj = inpObj.dat;//JSON.parse(inp.dat);
    var rsObj = HebrewUti.get_VocabHebrewBufObj();
    Object.keys(upobj).forEach(function (k) {
      rsObj.obj[k] = upobj[k];
    });
    var s = rsObj.header;
    s += JSON.stringify(rsObj.obj, null, 4);
    fs.writeFileSync(rsObj.fname, s);
  }
}


var SvcUti = {
  GetApiInputParamObj: function (req) {
    console.log("req.url=", req.url);
    var q = url.parse(req.url, true).query;
    console.log("q=", q);
    if (q.inp === undefined) {
      console.log("q.inp undefined. Maybe upload.");
      return q;
    }
    var s = decodeURIComponent(q.inp);//must for client's encodeURIComponent
    var inpObj = JSON.parse(s);
    console.log("inpObj=", inpObj);
    return inpObj;
  },
};

var SvcRestApi = {
  updateVocabHebrewBuf: function (inpObj) {
    return HebrewUti.updateVocabHebrewBuf(inpObj);
  },
}

var HebrewQ = function () {
}
HebrewQ.prototype.HebrewRestApi = function (app) {
  HebrewUti.get_VocabHebrewBufObj();//test loading ok.

  Object.keys(SvcRestApi).forEach(function (api) {
    app.get("/" + api, (req, res) => {
      var inpObj = SvcUti.GetApiInputParamObj(req);
      var ret = SvcRestApi[api](inpObj);
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.write("Jsonpster.Response(" + ret + ");");
      res.end();
    });
  });
}///////////////////////////////

module.exports.HebrewQ = HebrewQ;

