



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

// var HebrewQ = require("./MyNodjsModules/HebrewQ.module").HebrewQ;
// var BibDesk = require("./MyNodjsModules/BibDesk.module").BibDesk;

var Upload_Object = require("./upload/Upload_Object.module").Upload_Object;

////////////////////////////////
//server site workload.
const fs = require('fs');
var path = require('path');
var cheerio = require("cheerio"); //>> npm install cheerio
/////////////////////////////////////////////////////////////////




//// For upload /////////
var uploadObj = new Upload_Object();
uploadObj.upload_page(app);

//// for BibleObjApi  with Jsonpster ////////
//var bii = new BibleObj();
BibleObjJsonpApi.init(app, "../../../../");

//// For HebrewQ study /////
//var hbrq = new HebrewQ();
//hbrq.HebrewRestApi(app);

////
//var bibDesk = new BibDesk();
//bibDesk.RestApi(app);




/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

// use it before all route definitions. for cross domain post.
app.use(cors({ origin: null }));

app.set('trust proxy', true) //:return client req.ip
app.use(express.urlencoded({ extended: true })); //:return req.query


/////////////////////////////////////////////////// 
//
app.g_iPort = 7778;
app.get("/", (req, res) => {
  console.log("root ok");
  console.log("res.req.headers.host=", res.req.headers.host);
  //res.send("<script>alert(\'ss\');</script>");
  var obj = { samp: 'ffa' };
  var s = JSON.stringify(res.req.headers);
  res.send("restapi Jsonpster. clientSite:" + s);
});

app.listen(app.g_iPort, () => {
  console.log("nodejs app is listerning ...");
  //hbrq.get_VocabHebrewBufObj();
});
console.log("port:", app.g_iPort);
//
////////////////////////////////////////////////
//require("../../htmf/studynotes")
//BibleUti.access_dir(app,"bsnp")




if (MASTER_SVR.https.port === MASTER_SVR.http.port) {
  console.log(`\n- https diabled: MASTER_SVR.https.port === MASTER_SVR.https.port === ${MASTER_SVR.http.port} .`)
} else {
  //How to Fix the NET::ERR_CERT_AUTHORITY_INVALID Error
  const options = {
    key: fs.readFileSync('./config/https_credentials/key.pem'),
    cert: fs.readFileSync('./config/https_credentials/cert.pem')
  };
  https_svr = https.createServer(options, app).listen(MASTER_SVR.https.port, async function () {
    console.log(`* Https svr listerning: ${MASTER_SVR.https.port}\n-----------\n`);
  });
}






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

