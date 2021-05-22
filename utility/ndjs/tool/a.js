

const fs = require('fs');
var path = require('path');
var cheerio=require("cheerio"); //>> npm install cheerio
 

   




function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + "," + hour + ":" + min + ":" + sec;

}
var dt=getDateTime();
console.log(dt);
//return;

function getFileNamesFromDir(startPath, filter){
  function recursiveDir(startPath, filter, xx){
      var files=fs.readdirSync(startPath);
      for(var i=0;i<files.length;i++){
          var filename=path.join(startPath,files[i]);
          //console.log(filename);
          var stat = fs.lstatSync(filename);
          if (stat.isDirectory()){
              recursiveDir(filename,filter); //recurse
          }
          else if (filename.indexOf(filter)>=0) {
              //console.log('-- found: ',filename);
              outFilesArr.push(filename);
          };
      };  
  }
  var outFilesArr=[];
  recursiveDir(startPath,filter);
  return outFilesArr;
};
function makePathDir(pathdir){
  var arr=pathdir.split("/");
  var spathdir="";
  for(var i=0;i<arr.length;i++){
    var node=arr[i];
    if(node.length<=0) continue;
    spathdir+=arr[i];
    if (!fs.existsSync(spathdir)){
          fs.mkdirSync(spathdir);
      } 
      spathdir+="/";
  }
}
function getFileInfo(bookref){
    var ret={"dir":"","fname":"","fsize":0};
    if(!bookref) return ret;
      var arr=bookref.split("/");

      
      var base="./out/"+booklist_org;
      makePathDir(base);

      var fnm = base+"/"+arr[0]+"_"+arr[1]+".htm";

      ret.dir=base;
      ret.fname=fnm;


      if (!fs.existsSync(base)){
           fs.mkdirSync(base);
      }  
      if (fs.existsSync(fnm)){
        const stats = fs.statSync(fnm);
        ret.fsize = stats.size;
      }  
    //console.log(ret);
    return ret;
}

function writeBody2file(fnam, body){
      fs.writeFileSync(fnam, body, function(err) {
        if(err) {
          return console.log(err);
        }

        console.log("The file was saved! "+fnm);
      });   
}

/////
function request_a_book(bookname){
  var fileinfo=getFileInfo(bookname);
  if(fileinfo.fsize>0) {
    console.log("already exist.",fileinfo.fsize);
    return;
  }

  options.form.url=gBaseUrl+bookname;
  request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
      writeBody2file(fileinfo.fname, body);

    });
};//

var outdirtmp="out/tmp";
makePathDir(outdirtmp);

var tardir="../../jsdb/bible/cuvs";
var tardir="../../jsdb/bible/niv";
var tardir="../../jsdb/bible/kjv";
var tardir="../../jsdb/bible/stu";
var tardir="../../jsdb/bible/hgr";
var tardir="../../jsdb/bible/bbe";
var tardir="../../jsdb/bible/wlvs"; 
var tardir="../../jsdb/bible/pinyin/CUV_chars/splitter/2015"; 
function merge_jsfiles_in_Dir(sdir){
  var arr=getFileNamesFromDir(tardir,".js");
  var merges="";
  console.log(tardir,arr);
  for(var i=0;i<arr.length;i++){
    var fname=arr[i];
    var content=fs.readFileSync(fname);
    merges+=content+"\n\n\n";
  };
  console.log(merges);

  writeBody2file(outdirtmp+"/merged.js","var P = new Object();\n"+merges);
}
merge_jsfiles_in_Dir(tardir);
return;





















function recursive_request_a_book(MainBooksList){
  if(g_idx>=MainBooksList.length){
    console.log("end at",g_idx);
    return;
  }
  var bookname=MainBooksList[g_idx];
  var fileinfo=getFileInfo(bookname);
  var dt=getDateTime();
  console.log("\n",g_idx, dt, fileinfo);
  if(fileinfo.fsize>1000) {
    console.log("already exist.");
    g_idx++;
    recursive_request_a_book();
    return;
  }

  options.form.url=gBaseUrl+bookname;
  //options.form.url="http://www.amazon.com/";
  request(options, function (error, response, body) {
      
      if (error) {//throw new Error(error);
        console.log("abort", error, response);
        return;
      }

      console.log("body-len="+body.length);
      if(0===body.length) console.log(response);
      writeBody2file(fileinfo.fname, body);
      g_idx++;
      setTimeout(recursive_request_a_book,1000);
  });
};//



////  11111111: get booklist from bookref arr. gen boolist_org
g_idx=0;
// recursive_request_a_book(BookRefsArr); 
//// MainStep 1. 
//  in: BookRefsArr
// out: boolist_org 



//// 222222222 gen outmain.htm from booklist_org
console.log("-------2222--------");
var startPath="out/"+booklist_org;
function gen_outmain_htm(startPath){

  var outHtmArr=getFileNamesFromDir(startPath,".htm");
  console.log(outHtmArr);

  var tb="<table border='1'>\n";
  for(var i=0;i<outHtmArr.length;i++){
    var bookname=outHtmArr[i];
    tb+="<tr><td>"+i+"</td><td><a href='"+bookname+"'>"+bookname+"</a></td><tr>\n";
  }
  var htm="<html>\n"+tb+"\n</table>\n</html>";
  writeBody2file("outmain.htm", htm);  
}
// gen_outmain_htm(startPath);
//// MainStep 2. 
//  input: /booklist_org/ 
//////out: ./outmain.htm



//// 3333. convert htm files in booklist_org into table inside booklist_tbl
//// --prepare for toc. 
console.log("-------33333--------");
var g_all_ctext_org_arr=[];
Array.prototype.unique = function() {
  return this.filter(function (value, index, self) { 
    return self.indexOf(value) === index;
  });
}
function raw_content_to_table(htmfile){//:=out/booklist_org/analects_zh.htm
  var arr=htmfile.split("/");
  var contents = fs.readFileSync(htmfile, 'utf8');
  var base=htmfile.replace(/_zh\.htm$/, "");
  var reg=new RegExp("^out/booklist_org/","")
  base=base.replace(reg, "");
  console.log(base);
  var regex = new RegExp("href=[\'|\"]"+base+"/[0-9a-zA-Z\-]{1,}/zh[\'|\"]","g");
  var mat = contents.match(regex);
  if(!mat) return;
  mat=mat.unique();
  console.log(mat, mat.length);
  
  var tb="<table border='1'>";
  for(var i=0;i<mat.length;i++){
    var paths=mat[i].substr(5);
    paths=paths.replace(/\"/g,"");
    console.log(paths);
    var href2=gBaseUrl+paths;
    g_all_ctext_org_arr.push(href2);
    tb+="<tr><td>"+i+"</td><td><a href='"+href2+"''>"+paths+"</a></td>";
    
    var localpath=paths;
    localpath=localpath.replace("/","__");
    localpath=localpath.replace("/zh",".htm");
    var localfile="../"+ctext_tbl+"/"+localpath;
    tb+="<td><a href='"+localfile+"'>"+localfile+"</a></td>";
    tb+="<tr>\n";
  }
  tb+="</table>";
  var bookdir="out/"+booklist_tbl;
  makePathDir(bookdir);
  var fname=bookdir+"/"+arr[2];//.replace(booklist_org,booklist_tbl);
  console.log(fname);
  writeBody2file(fname,tb);
  //https://ctext.org/analects/xue-er/zh
  //console.log(contents);

}
function convert_org_table_to_my_table(){
  var outHtmArr=getFileNamesFromDir(startPath,".htm");
  for(var i=0;i<outHtmArr.length;i++){
      var htmfile=outHtmArr[i];
      console.log(i);
      raw_content_to_table(htmfile);
  }
  console.log(g_all_ctext_org_arr,"g_all_ctext_org_arr.length=",g_all_ctext_org_arr.length);

}
 convert_org_table_to_my_table(); 
 //// MainStep 3. 
 //  in: booklist_org, 
 // out: booklist_tbl.
//.      g_all_ctext_org_arr



/////  4444:
console.log("----4444----");
function getFileInfoFromUrl(url){//url:=https://ctext.org/book-of-changes/pi/zh
  var ret={"dir":"","fname":"","fsize":0};
  if(!url) return ret;
  var nodes=url.split("/");
  ret.dir="out/"+ctext_org;
  ret.fname=ret.dir+"/"+nodes[3]+"__"+nodes[4]+".htm";

  if (!fs.existsSync(ret.dir)){
           fs.mkdirSync(ret.dir);
      }  
  if (fs.existsSync(ret.fname)){
        const stats = fs.statSync(ret.fname);
        ret.fsize = stats.size;
      } 

  return ret;
}
function recursive_request_a_chapter_text(){
  if(g_idx>=g_all_ctext_org_arr.length){
    console.log("end at:",g_idx);
    goto_step5();
    return;
  }
  var url=g_all_ctext_org_arr[g_idx];
  var fileinfo=getFileInfoFromUrl(url);
  var dt=getDateTime();
  console.log("\n",g_idx,dt,fileinfo);
  if(fileinfo.fsize>1000) {
    console.log("already exist.");
    g_idx++;
    setTimeout(recursive_request_a_chapter_text,0);
    return;
  }

  //g_idx++;
  //recursive_request_a_chapter_text();
  //return;

  options.form.url=url;
  //options.form.url="http://www.amazon.com/";
  request(options, function (error, response, body) {
      
      if (error) {//throw new Error(error);
        console.log("**** error ****", error);
        writeBody2file(fileinfo.fname+"error.response.json", JSON.stringify(response,null,4));
        //return;
      }else{
        console.log("body-len="+body.length);
        if(0===body.length) {
          var ename=fileinfo.fname+"body0.response.json";
          console.log("bodyEmpty, response is saved in ", ename);
          writeBody2file(ename, JSON.stringify(response,null,4));
        }
        writeBody2file(fileinfo.fname, body);
      }

      g_idx++;
      setTimeout(recursive_request_a_chapter_text,1000);
  });
};////
function goto_setp4(){
  g_idx=0;
  recursive_request_a_chapter_text();   
}
//.  goto_setp4();   
//// MainStep 4. 
//.   in: g_all_ctext_org_arr
///. out: ctext_org/.


//// 555-
// run tidy -im -utf8 *.htm  to evaluation. 
// check conent3 div 
    //npm install html-entities
    const Entities = require('html-entities').XmlEntities;
    const entities = new Entities();
    //console.log(entities.encode('<>"\'&©®')); // &lt;&gt;&quot;&apos;&amp;©®
    //console.log(entities.encodeNonUTF('<>"\'&©®')); // &lt;&gt;&quot;&apos;&amp;&#169;&#174;
    //console.log(entities.encodeNonASCII('<>"\'&©®')); // <>"\'&©®
    //console.log(entities.decode('&lt;&gt;&quot;&apos;&amp;&copy;&reg;&#8710;')); // <>"'&&copy;&reg;∆
function goto_step5(all_urls_arr){
  var cheerio=require("cheerio");
  console.log("-----555----");
  var allpages={};
  var dir="out/"+ctext_tbl;
  makePathDir(dir);
  for(var i=0;i<all_urls_arr.length; i++){
    var url=all_urls_arr[i];
    var fileinfo=getFileInfoFromUrl(url);
    //console.log(fileinfo);
    var content=fs.readFileSync(fileinfo.fname,'utf8');
    var $ = cheerio.load(content);

    var tname=$("#content3").find("table").eq(0).find("tr>td>h2").eq(0).find("div").each(function(){
      $(this).empty();
    });
    tname=$("#content3").find("table").eq(0).find("tr>td>h2").eq(0).text();
    var tb1=$("#content3").find("table").eq(1);
    tb1.find("div").each(function(){
      $(this).text("");
    });

    var cnt=tb1.html();
    cnt=entities.decode(cnt);
    var cntleng=cnt.length;
    if(cntleng<100){// need further dig.
      console.log(cntleng, "******-need further dig-******",fileinfo);
      $("#content3").find("a[href]").each(function(){
        var deeper=$(this).text();
        var dphref=$(this).attr("href");
        if(  dphref.indexOf("#")<0 ){
          if(dphref.indexOf("?")<0 ){
            var orgFile=dphref.replace(/\//g,"__");
            orgFile=fileinfo.fname+"@"+orgFile+".htm";
            var tblFile=orgFile.replace(ctext_org,ctext_tbl);
            //console.log(deeper, orgFile);
            allpages[tblFile]=[-1, gBaseUrl+dphref];
          }else if(dphref.indexOf("text.pl?")>=0){
            var orgFile=dphref;//.replace(/\?/g,"~");
            //orgFile=dphref.replace(/\&/g,"$");
            orgFile=fileinfo.fname+"@"+orgFile+".htm";
            var tblFile=orgFile.replace(ctext_org,ctext_tbl);
            console.log("\n???",deeper, dphref,tblFile);
            allpages[tblFile]=[-1, gBaseUrl+dphref];
          }
        }    
      });
    }////Need further_Dig/

    var fnm=fileinfo.fname.replace(ctext_org, ctext_tbl);

    //console.log(i,fnm, tname);
    writeBody2file(fnm,tname+"<table border='1'>"+cnt+"</table>");
    allpages[fnm]=[cntleng,url];
  }
  var olidx="var __all_pages_table_dat=\n";
  olidx+=JSON.stringify(allpages,null,4);
  writeBody2file("out/__all_pages_table_dat.js",olidx);

  console.log("end----555")  
}
goto_step5(g_all_ctext_org_arr); 
//// MainStep 5. 
// in:ctext_org/*.htm, 
// out:ctext_xcontent3 
  

