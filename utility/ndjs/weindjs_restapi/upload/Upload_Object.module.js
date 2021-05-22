
var bodyParser = require('body-parser');
//var stripe     = require("stripe")("CUSTOM_TEST_TOKEN");
var url = require('url');

var Uti = require("../MyNodjsModules/Uti.module").Uti;

////////////////////////////////
//server site workload.
const fs = require('fs');
var path = require('path');
var cheerio = require("cheerio"); //>> npm install cheerio



//////////////////////////////////////////
//
//    Upload file
//
//const express = require('express');
const fileUpload = require('express-fileupload');
//const app = express();


var Upload_Object = function () {
};
Upload_Object.prototype.upload_page = function (app) {
    // default options
    app.use(fileUpload());
    app.post('/upload_submit', function (req, res) {
        if (!req || !req.files || Object.keys(req.files).length == 0) {
            return res.status(400).send('No files were uploaded.');
        }

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        let sampleFile = req.files.sampleFile;
        var uploadFileNmae = req.files.sampleFile.name;
        var uploadDestPath = req.body.destDir;
        console.log("uploadFileNmae=", uploadFileNmae);
        console.log("uploadDestName=", uploadDestPath);

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(`${uploadDestPath}/${uploadFileNmae}`, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.send(`File: ${uploadFileNmae} <br>was uploaded to: ${uploadDestPath}`);
        });
    });
    //Cannot POST - handling form POST from an external site.
    app.get('/upload_page', function (req, res) {
        console.log("generate upload_page.htm...");
        var swebpage = fs.readFileSync("./upload/upload_page.htm", "utf8");
        return res.send(swebpage);
    });
}
//
////////////////////////////////


module.exports.Upload_Object = Upload_Object;


