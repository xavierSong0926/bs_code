//var request = require("request");
const fs = require('fs');
var path = require('path');
//var Uti = require("../../../../../../utis/zfrqCalc/Uti.Module").Uti;
var Uti = require("../../../../utis/zfrqCalc/Uti.Module").Uti;
//var a=require("../latexBibTmpl");
//const bibTmp = Uti.LoadObj("../latexBibTmpl.js");
//const latexBibTmpl_InputTable = bibTmp.obj;
//console.log(bibTmp);


var cheerio = require("cheerio");  ////:npm install request cheerio   



function htm2json(gobj, fname) {
    var body = fs.readFileSync(fname);
    var $ = cheerio.load(body);

    var i = 0;
    $(".bVerse__col-three").each(function () {
        var txt = $(this).text();
        txt = txt.trim("\\n");
        var p = txt.indexOf("-");
        var vs = txt.substr(0, p).trim();
        var str = txt.substr(p + 1).trim();
        str = str.replace(/[\n|\r][\s]+/g, " ");
        console.log(i++, vs);
        console.log(str);
        gobj[vs] = str;

        var vol = vs.substr(0, 3);
    });
    //////
}

var gobj = {};
var path = "./kjv_sonship/htm/";
var files = [
    "Gen",
    "Exo",
    "Lev",
    "Deu",
    "1Sa",
    "1Ch",
    "Est",
    "Ecc",
    "Lam",
    "Joe",
    "NT"
];
for (var i = 0; i < files.length; i++) {
    var fname = `${path}${files[i]}.htm`;
    htm2json(gobj, fname);
}
var outfile = "./kjv_sonship/json/HebrewSonship.json.js";
fs.writeFileSync(outfile, JSON.stringify(gobj, null, 4));

//////////////////////////////////////////////////////////
var arr = Object.keys(gobj);
var volNumObj={}
for (var i = 0; i < arr.length; i++) {
    var key = arr[i];
    var vol = key.substr(0, 3);
    if(undefined === volNumObj[vol]){
        volNumObj[vol]=0;
    }
    volNumObj[vol]++;
}
console.log(volNumObj);



//Strong's Number H1121 matches the Hebrew בֵּן (ben),
//which occurs 4,906 times in 3,654 verses in the Hebrew concordance of the KJV
//Page 1 / 74 (Gen 3:16–Gen 11:19)