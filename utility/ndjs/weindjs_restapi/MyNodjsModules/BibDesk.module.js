//2018/05/12 MyNodejsModuels/Uti.module.js

const fs = require('fs');
const path = require('path');
var url = require('url'); //for web app.

var Uti = require("./Uti.module").Uti;
var SvcUti = require("./SvcUti.module").SvcUti;

var SvcRestApi = {
    BibDeskApi_SaveBibSingleItem: function (inpObj) {
        console.log("api : BibDeskApi_SaveBibSingleItem");
        var spathfile = "../../../../../../bitbucket/wdingsoft/weid/pdf2018/latx/bib_generator/authorInfo/bibDat/BibDat_OBI.json.js";
        spathfile=inpObj.filename;
        console.log(spathfile);
        var ret = Uti.LoadObj(spathfile);
        //console.log(ret);
        var uid = inpObj["uid"];
        var itm = inpObj["itm"];
        console.log("uid=",uid);
        console.log("ret.obj[uid]=",ret.obj[uid]);
        if(undefined === ret.obj[uid]){
            ret.obj[uid]={};
        }
        ret.obj[uid] = itm;
        ret.writeback();
        console.log("itm=",itm);

        return JSON.stringify(inpObj);
    },
}

var BibDesk = function () {
}
BibDesk.prototype.RestApi = function (app) {
    SvcUti.BindApp2Api(app, SvcRestApi);

}///////////////////////////////

module.exports.BibDesk = BibDesk;

