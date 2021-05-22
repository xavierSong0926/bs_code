

const fs = require('fs');
var path = require('path');
var cheerio = require("cheerio"); //>> npm install cheerio

const Uti = require("../../../../../../../bitbucket/wdingsoft/utis/zfrqCalc/Uti.Module").Uti;

var tst = require("../../../../jsdb/jsBibleObj/_crf.json.js");


var CrossReference = {
    show: function (crf) {
        var ret={};
        Object.keys(crf.obj).forEach(function (bkname, i) {
            var obk = crf.obj[bkname];
            Object.keys(obk).forEach(function (chp, k) {
                var chpObj = obk[chp];
                Object.keys(chpObj).forEach(function (vers, k) {
                    var txt = chpObj[vers];
                    if (txt.length > 0) {
                        var sbcv=`${bkname}${chp}:${vers}`;
                        ret[sbcv]=txt;
                        console.log(`${bkname}${chp}:${vers} : ${txt}`);
                    }
                });
            });
        });
        fs.writeFileSync("crossRef.json.js",JSON.stringify(ret,null,4));
    },
    update: function (crf, note) {
        //console.log(note);
        Object.keys(note.obj).forEach(function (bkname, i) {
            var obk = note.obj[bkname];
            Object.keys(obk).forEach(function (chp, k) {
                var chpObj = obk[chp];
                Object.keys(chpObj).forEach(function (vers, k) {
                    var txt = chpObj[vers];
                    if (txt.length > 0) {
                        //console.log(bkname, chp, ":", vers, txt);
                        var ret1 = { book: bkname, chap: chp, vers: vers, valid: true };
                        var arr2 = CrossReference.search_Ref(txt);
                        CrossReference.cross_update(crf, ret1, arr2);
                    }
                });
            });
        });
        CrossReference.show(crf);
    },

    search_Ref: function (txt) {
        var retarr = [];
        var mat = txt.match(/[\(]\s{0,}([A-Z0-9][A-Za-z]{2})[\s]{0,}(\d+)[\s]{0,}[\:][\s]{0,}(\d+)([\-\,\d]{0,})[\)]/g);
        if (mat) {
            console.log("-----");
            console.log(mat);
            for (var i = 0; i < mat.length; i++) {
                var bcv = mat[i];
                var mat3 = bcv.match(/[\(]\s{0,}([A-Z0-9][A-Za-z]{2})[\s]{0,}(\d+)[\s]{0,}[\:][\s]{0,}(\d+)([\-\,\d]{0,})[\)]/);
                if (mat3) {
                    console.log("=======");
                    console.log(mat3);
                    var ret = { book: mat3[1], chap: mat3[2], vers: mat3[3], valid: true };
                    retarr.push(ret);
                }
            }
        }
        return retarr;
    },
    getBCV: function (ret) {
        return `(${ret.book}${ret.chap}:${ret.vers})`;
    },
    cross_update: function (_crf, ret1, arr) {
        function push2crf(_crf, ret, ret2) {
            if (false === ret.valid || false === ret2.valid) return;
            var matBVC = CrossReference.getBCV(ret2);
            var arr1 = _crf.obj[ret.book][ret.chap][ret.vers].split(/[\;|\s]/);
            if (arr1.indexOf(matBVC) < 0) {
                arr1.push(matBVC);
                _crf.obj[ret.book][ret.chap][ret.vers] = arr1.join(";");
            }
        }
        for (var i = 0; i < arr.length; i++) {
            var ret2 = arr[i];
            push2crf(_crf, ret1, ret2);
            push2crf(_crf, ret2, ret1);
        }
        _crf.writeback();
    }
};////////////////////////

var _crf = Uti.LoadObj("../../../../jsdb/jsBibleObj/_crf.json.js");
var _bnotes = Uti.LoadObj("../../../../jsdb/jsBibleObj/_bnotes.json.js");
CrossReference.update(_crf, _bnotes);
