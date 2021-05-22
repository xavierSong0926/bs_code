//2018/05/12 MyNodejsModuels/Uti.module.js

const fs = require('fs');
const path = require('path');

var Utility = {
    GetJsonStringFrmFile: function (fname) {
        if (!fs.existsSync(fname)) console.log("not existsSync", fname)
        var content = fs.readFileSync(fname, "utf8");
        console.log("load size", content.length, fname)
        var idx = content.indexOf("{");
        var shead = content.substr(0, idx);
        console.log("shead==", shead);
        content = content.substring(idx);
        return { fname: fname, header: shead, jstrn: content };
    },
    getDateTime: function () {

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
    },
    IsChar_utf8zi: function (zi) {
        var code = zi.charCodeAt(0);
        if (code < 12422 || code > 58384) {
            return false;
        }
        return true;
    },

    GetFilesAryFromDir: function (startPath, deep) {//startPath, filter
        function recursiveDir(startPath, deep, outFilesArr) {
            var files = fs.readdirSync(startPath);
            for (var i = 0; i < files.length; i++) {
                var filename = path.join(startPath, files[i]);
                //console.log(filename);
                var stat = fs.lstatSync(filename);
                if (stat.isDirectory()) {
                    if (deep) {
                        recursiveDir(filename, deep, outFilesArr); //recurse
                    }
                    continue;
                }/////////////////////////
                outFilesArr.push(filename);
            };
        };/////////////////////////////////////

        var outFilesArr = [];
        recursiveDir(startPath, deep, outFilesArr);
        return outFilesArr;
    },
    GetFileNamesFromDir: function (startPath, deep, filter) {//startPath, filter
        var sample_filter = { extnames: ".htm", kstrinm: "KeyStrInName" }

        function recursiveDir(startPath, deep, filter, xx) {
            var files = fs.readdirSync(startPath);
            for (var i = 0; i < files.length; i++) {
                var filename = path.join(startPath, files[i]);
                //console.log(filename);
                var stat = fs.lstatSync(filename);
                if (stat.isDirectory()) {
                    if (deep) {
                        recursiveDir(filename, deep, filter); //recurse
                    }
                    continue;
                }/////////////////////////

                if (!filter) {
                    outFilesArr.push(filename);
                    continue;
                }


                var opth = path.parse(filename);
                if (filter.extnary) {
                    //var extnm = path.extname(filename);
                    if (filter.extnary.indexOf(opth.ext) < 0) {
                        continue;
                    };
                }
                if (filter.kstrinm) {
                    //var basnm = path.basename(filename);
                    if (opth.name.indexOf(filter.kstrinm) < 0) {
                        continue;
                    }
                }
                outFilesArr.push(filename);
            };
        };/////////////////////////////////////

        if (filter) {
            var extrn = filter.extnames.replace(/[\;\,\.]+$/, '');
            filter.extnary = extrn.split(/[\;|\,]/);
        }
        console.log("filter:", filter)

        var outFilesArr = [];
        recursiveDir(startPath, deep, filter);
        return outFilesArr;
    },

    getFileNamesFromDir: function (startPath, filter) {
        function recursiveDir(startPath, filter, xx) {
            var files = fs.readdirSync(startPath);
            for (var i = 0; i < files.length; i++) {
                var filename = path.join(startPath, files[i]);
                //console.log(filename);
                var stat = fs.lstatSync(filename);
                if (stat.isDirectory()) {
                    recursiveDir(filename, filter); //recurse
                    continue;
                }
                if (!filter) {
                    outFilesArr.push(filename);
                    continue;
                }
                var extnm = path.extname(filename);
                if (extnm === filter) {
                    //console.log('-- found: ', filename);
                    outFilesArr.push(filename);
                };
            };
        }
        var outFilesArr = [];
        recursiveDir(startPath, filter);
        return outFilesArr;
    },
    makePathDir: function (pathdir) {
        var curdir = process.cwd();
        var arr = pathdir.split("/");
        var spathdir = "";
        for (var i = 0; i < arr.length; i++) {
            var node = arr[i];
            if (node.length <= 0) continue;
            if (node === ".") continue;
            if (node === "..") {
                //spathdir=path.basename(curdir);
                continue;
            }
            spathdir += arr[i];
            if (!fs.existsSync(spathdir)) {
                fs.mkdirSync(spathdir);
            }
            spathdir += "/";
        }
    },
    MakePathDirOfFile: function (pathdirfile) {
        var pathdir = path.dirname(pathdirfile);
        this.makePathDir(pathdir)
    },
    getFileInfo: function (bookref) {
        var ret = { "dir": "", "fname": "", "fsize": 0 };
        if (!bookref) return ret;
        var arr = bookref.split("/");


        var base = "./out/" + booklist_org;
        makePathDir(base);

        var fnm = base + "/" + arr[0] + "_" + arr[1] + ".htm";

        ret.dir = base;
        ret.fname = fnm;


        if (!fs.existsSync(base)) {
            fs.mkdirSync(base);
        }
        if (fs.existsSync(fnm)) {
            const stats = fs.statSync(fnm);
            ret.fsize = stats.size;
        }
        //console.log(ret);
        return ret;
    },
    GetFileSize: function (fnm) {
        if (fs.existsSync(fnm)) {
            const stats = fs.statSync(fnm);
            return stats.size;
        }
        return -1;
    },

    writeBody2file: function (fnam, body) {
        this.MakePathDirOfFile(fnam);
        fs.writeFileSync(fnam, body, function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved! " + fnm);
        });
    },
    writeObj2file: function (fnam, header, body) {
        fs.writeFileSync(fnam, header + JSON.stringify(body, null, 4), function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved! " + fnm);
        });
    },
    LoadObj: function (jsfnm) {
        var ret = { obj: {} };
        ret.fname = jsfnm;
        ret.fsize = this.GetFileSize(jsfnm);
        if (ret.fsize > 0) {
            var t = fs.readFileSync(jsfnm, "utf8");
            var i = t.indexOf("{");
            ret.header = t.substr(0, i);
            var s = t.substr(i);
            ret.obj = JSON.parse(s);
        }
        ret.writeback = function () {
            var s2 = JSON.stringify(this.obj, null, 4);
            fs.writeFileSync(this.fname, this.header + s2);
        }
        return ret;
    },
    SortFrq_FrqObj: function (frqObj) {
        var arrFrqKey = [];
        const FIXEDLEN = 9;
        var arrKeys = Object.keys(frqObj);
        for (var i = 0; i < arrKeys.length; i++) {
            var key = arrKeys[i];
            var frq = frqObj[key].toString().padStart(FIXEDLEN, "0");
            arrFrqKey.push(frq + key);
        }
        arrFrqKey.sort().reverse();
        var sortedFrqObj = {};
        for (var i = 0; i < arrFrqKey.length; i++) {
            var ss = arrFrqKey[i];
            var frq = ss.substr(0, FIXEDLEN);
            var key = ss[FIXEDLEN];
            sortedFrqObj[key] = parseInt(frq);
        }
        return sortedFrqObj;
    },

    Cat2Files: function (cwdir, relativePathFile) {

        var rarr = relativePathFile.split("/");
        var sparentPath = path.dirname(cwdir);
        var islic = 0;
        for (var i = 0; i < rarr.length; i++) {
            var nod = rarr[i];
            if (nod === ".") continue;
            if (nod === "..") {
                sparentPath = path.dirname(sparentPath);
                islic = i;
            }
        }
        //console.log(islic);
        var arr = rarr.slice(islic + 1);
        var childpathfile = arr.join("/");
        var newPathFile = sparentPath + "/" + childpathfile;

        //console.log("relativePathFile", relativePathFile);
        //console.log("cwdir", cwdir);
        //console.log("newPf", newPathFile);
        sparentPath = path.dirname(newPathFile);
        //console.log("newdr", sparentPath);
        //Uti.makePathDir(sparentPath);
        //console.log(rarr);
        return newPathFile;
    },

    CalcStatis: function (sortedFrqObj) {
        var keys = Object.keys(sortedFrqObj);
        var frqTot = 0;
        for (var i = 0; i < keys.length; i++) {
            var ky = keys[i];
            var fq = parseInt(sortedFrqObj[ky]);
            frqTot += fq;
        }
        var totFrq90pcnt = parseInt(0.9 * frqTot);
        var totFrq80pcnt = parseInt(0.8 * frqTot);
        var totFrq50pcnt = parseInt(0.5 * frqTot);
        var indxAt90pcnt = -1, indxAt80pcnt = -1, indxAt50pcnt = -1;
        var tot = 0;
        for (var i = 0; i < keys.length; i++) {
            var ky = keys[i];
            var fq = parseInt(sortedFrqObj[ky]);
            tot += fq;
            if (tot >= totFrq90pcnt) {
                if (indxAt90pcnt < 0) indxAt90pcnt = i;
            }
            if (tot >= totFrq80pcnt) {
                if (indxAt80pcnt < 0) indxAt80pcnt = i;
            }
            if (tot >= totFrq50pcnt) {
                if (indxAt50pcnt < 0) indxAt50pcnt = i;
            }
        }
        var indxAt90pcntPosRate = indxAt90pcnt / keys.length;
        var indxAt80pcntPosRate = indxAt80pcnt / keys.length;
        var indxAt50pcntPosRate = indxAt50pcnt / keys.length;
        var ret = {
            numOfZi: keys.length,
            frqTot: frqTot,
            frqTot50pcnt: totFrq50pcnt,
            frq50pcnt_PosIndx: indxAt50pcnt,
            frq50pcnt_PosRate: indxAt50pcntPosRate.toFixed(2),
            frqTot80pcnt: totFrq80pcnt,
            frq80pcnt_PosIndx: indxAt80pcnt,
            frq80pcnt_PosRate: indxAt80pcntPosRate.toFixed(2),
            frqTot90pcnt: totFrq90pcnt,
            frq90pcnt_PosIndx: indxAt90pcnt,
            frq90pcnt_PosRate: indxAt90pcntPosRate.toFixed(2)
        }
        return ret;
    }
};/////



exports.Uti = Utility;

