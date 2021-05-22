//2018/05/12 MyNodejsModuels/Uti.module.js

const fs = require('fs');
const path = require('path');
var url = require('url'); //for web app.


var SvcUti = {
    GetApiInputParamObj: function (req) {
        console.log("req.url=", req.url);
        var q = url.parse(req.url, true).query;
        console.log("q=", q);
        if (q.inp === undefined) {
            console.log("q.inp undefined. Maybe unload or api err");
            return q;
        }
        var s = decodeURIComponent(q.inp);//must for client's encodeURIComponent
        var inpObj = JSON.parse(s);
        console.log("inp=", inpObj);
        return inpObj;
    },
    BindApp2Api: function (app, svcApi) {
        Object.keys(svcApi).forEach(function (api) {
            app.get("/" + api, (req, res) => {
                var inpObj = SvcUti.GetApiInputParamObj(req);
                console.log(typeof svcApi[api], api);

                var ret = svcApi[api](inpObj);
                res.writeHead(200, { 'Content-Type': 'text/javascript' });
                res.write("Jsonpster.Response(" + ret + ");");
                res.end();
            });
        });
    },
    Jsonpster: function (app, restApi) {
        /////for loadfile. This is extra feature for Jsonpster.
        app.get("/LoadJsonFile", (req, res) => {
            var inpObj = SvcUti.GetApiInputParamObj(req);
            var content = fs.readFileSync(inpObj.filename, "utf8");
            var idx = content.indexOf("{");
            if(idx<0){
                console.log("Invalid js file content.", content)
            }
            var shead = content.substr(0, idx);
            console.log("shead==", shead);
            content = content.substring(idx);
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            //res.write(ret);
            res.write(`Jsonpster.Response(${content});`);
            res.end();
        });

        ////////////////////////////////////////////
        app.get("/Jsonpster", (req, res) => {
            console.log();
            console.log("res.req.headers.host=", res.req.headers.host);
            Object.keys(res.req.headers).forEach(function (v) {
                console.log(v);
            })

            var q = url.parse(req.url, true).query;
            q.test = function (i) {
                alert(i);
            }
            console.log(JSON.stringify(q));


            //////////////
            var jstr_RestApi = JSON.stringify(restApi);
            var s = `
var Jsonpster = {
    inp:null,
    api:null,
Url: function (){
        this.m_src = 'http://${res.req.headers.host}/'+this.api+'?inp='+encodeURIComponent(JSON.stringify(this.inp));
        return this.m_src;
    },
Run : function (cbf) {
    if (!cbf) alert('callback Response null');
    if (!this.api) alert('api=null');
    if (!this.inp) alert('inp=null');
    this.Response = cbf;
    var s = document.createElement('script');
    s.src = this.Url()
    document.body.appendChild(s);
    console.log('Jsonpster:',this.s, Jsonpster);
    this.api = this.inp = null;
}};
const RestApi = JSON.parse('${jstr_RestApi}');
`;;;;;;;;;;;;;;

            console.log(s);
            res.send(s);
            res.end();
        });
    }
};






module.exports.SvcUti = SvcUti;

