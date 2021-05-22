



var https = require('https');
var http = require('http');

const express = require('express');        // call express
const app = express();                 // define our app using express
var bodyParser = require('body-parser');
//var stripe     = require("stripe")("CUSTOM_TEST_TOKEN");
var url = require('url');
var cors = require('cors');


const {

    MASTER_SVR,
} = require('./config/config')



var { BibleObjJsonpApi } = require("./MyNodjsModules/BibleObjsonpApi_mod");
const { BibleUti } = require("./MyNodjsModules/BibleObjGituser_mod")

var HebrewQ = require("./MyNodjsModules/HebrewQ.module").HebrewQ;
var BibDesk = require("./MyNodjsModules/BibDesk.module").BibDesk;

var Upload_Object = require("./upload/Upload_Object.module").Upload_Object;

////////////////////////////////
//server site workload.
const fs = require('fs');
var path = require('path');
var cheerio = require("cheerio"); //>> npm install cheerio
/////////////////////////////////////////////////////////////////





//// for BibleObjApi  with Jsonpster ////////
//var bii = new BibleObj();
BibleObjJsonpApi.init(app, "../../../../");

//// For HebrewQ study /////




// use it before all route definitions. for cross domain post.
app.use(cors({ origin: null }));

app.set('trust proxy', true) //:return client req.ip
app.use(express.urlencoded({ extended: true })); //:return req.query


/////////////////////////////////////////////////// 
//
app.g_iPort = 8080;
app.get("/", (req, res) => {
    console.log("root ok");
    console.log("res.req.headers.host=", res.req.headers.host);
    //res.send("<script>alert(\'ss\');</script>");
    var obj = { samp: 'ffa' };
    var s = JSON.stringify(res.req.headers);
    res.send("restapi Jsonpster. clientSite:" + s);
});

app.listen(app.g_iPort, (request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        // At this point, we have the headers, method, url and body, and can now
        // do whatever we need to in order to respond to this request.
    });


    if (request.method === 'POST' && request.url === '/echo') {
        console.log("get Post")
        request.pipe(response);
    } else {
        console.log("end")
        response.statusCode = 404;
        response.end();
    }
    console.log("nodejs app is listerning ...");
    //hbrq.get_VocabHebrewBufObj();
});
console.log("port:", app.g_iPort);
//
////////////////////////////////////////////////
//require("../../htmf/studynotes")
//BibleUti.access_dir(app,"bsnp")








///////////////////////////////
// php -S localhost:7778
// will override nodejs. server
//
// https://www.npmjs.com/package/nodemon
// npm install -g nodemon
/////////////////////////
// Server Site:
// nodemon a.node.js
//
// client site:
// open restapi_tester.htm
// then click index button.
//
// load htm file for webpage js file issues.
// https://stackoverflow.com/questions/48050666/node-js-serve-html-but-cant-load-script-files-in-served-page
//
//

