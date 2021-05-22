

const fs = require('fs');
const path = require('path');
var url = require('url');
const fsPromises = require("fs").promises;

//var Uti = require("./Uti.module").Uti;
//var SvcUti = require("./SvcUti.module").SvcUti;
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

//var btoa = require('btoa');
const crypto = require('crypto')

const NodeCache = require("node-cache");


const WorkingRootNodeName = "bist"
var BibleUti = {
    WorkingRootDir: function (v) {
        if (undefined === v) {
            return BibleUti.m_rootDir
        } else {
            BibleUti.m_rootDir = v
        }
    },


    GetFilesAryFromDir: function (startPath, deep, cb) {//startPath, filter
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
                else if (cb) {
                    //console.log("file:",filename)
                    if (!cb(filename)) continue
                }
                outFilesArr.push(filename);
            };
        };/////////////////////////////////////

        if (!fs.existsSync(startPath)) return []
        var outFilesArr = [];
        recursiveDir(startPath, deep, outFilesArr);
        return outFilesArr;
    },
    access_dir: function (http, dir) {
        function writebin(pathfile, contentType, res) {
            var content = fs.readFileSync(pathfile)
            //console.log("read:", pathfile)
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(content, 'binary')
            res.end()
        }
        function writetxt(pathfile, contentType, res) {
            var content = fs.readFileSync(pathfile, "utf8")
            //console.log("read:", pathfile)
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(content, 'utf-8')
            res.end()
        }
        // ./assets/ckeditor/ckeditor.js"
        // var dir = "./assets/ckeditor/"
        console.log("lib svr:", dir)
        var ftypes = {
            '.ico': 'image/x-icon',
            '.html': 'text/html',
            '.htm': 'text/html',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.wav': 'audio/wav',
            '.mp3': 'audio/mpeg',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.eot': 'appliaction/vnd.ms-fontobject',
            '.ttf': 'aplication/font-sfnt'
        }
        var binaries = [".png", ".jpg", ".wav", ".mp3", ".svg", ".pdf", ".eot"]
        BibleUti.GetFilesAryFromDir(dir, true, function (fname) {
            var ret = path.parse(fname);
            var ext = ret.ext
            //console.log("ret:",ret)
            if (ftypes[ext]) {
                console.log("base:", ret.base)
                console.log("api:", fname)
                http.use("/" + fname, async (req, res) => {
                    console.log('[post] resp write :', req.body, fname)
                    if (binaries.indexOf(ext) >= 0) {
                        writebin(fname, ftypes[ext], res)
                    } else {
                        writetxt(fname, ftypes[ext], res)
                    }
                })
                return true
            }
        });
    },
    GetFileStat: function (fnm) {
        if (fs.existsSync(fnm)) {
            const stats = fs.statSync(fnm);
            return stats;//.size; //mtime modifited
        }
        return { size: -1, mtime: 0 };
    },
    exec_Cmd: function (command) {
        return new Promise((resolve, reject) => {
            try {
                //command = "ls"
                //console.log('exec_Cmd:', command)
                exec(command, (err, stdout, stderr) => {
                    console.log('-exec_Cmd errorr:', err)
                    console.log('-exec_Cmd stderr:', stderr)
                    console.log('-exec_Cmd stdout:', stdout)

                    // the *entire* stdout and stderr (buffered)
                    //resolve(stdout);
                    resolve({
                        stdout: stdout,
                        stderr: stderr,
                        err: err
                    })

                });
            } catch (err) {
                console.log(err)
                reject(err);
            }
        })
    },
    execSync_Cmd: function (command) {
        try {
            //command = "ls"
            console.log('execSync Cmd:', command)
            var ret = execSync(command).toString();
            console.log(ret)
        } catch (error) {
            console.log("error:", error.status);  // 0 : successful exit, but here in exception it has to be greater than 0
            console.log("error:", error.message); // Holds the message you typically want.
            console.log("error:", error.stderr);  // Holds the stderr output. Use `.toString()`.
            console.log("error:", error.stdout);  // Holds the stdout output. Use `.toString()`.
            return error.message
        }
        return ret;
    },








    copy_biobj: function (BibleObj, oj) {
        //console.log("copy_biobj oj", JSON.stringify(oj, null, 4))
        if (!oj || Object.keys(oj).length === 0) return BibleObj
        var retOb = {}
        for (const [bkc, chpObj] of Object.entries(oj)) {
            if (!chpObj || Object.keys(chpObj).length === 0) {
                retOb[bkc] = BibleObj[bkc] //copy whole book
                continue
            }
            retOb[bkc] = {}
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                //console.log("bc", bkc, chp)
                if (!vrsObj || Object.keys(vrsObj).length === 0) {
                    if (BibleObj[bkc]) retOb[bkc][chp] = BibleObj[bkc][chp]  //copyy whole chapter
                    continue
                }
                retOb[bkc][chp] = {}
                for (const [vrs, txt] of Object.entries(vrsObj)) {
                    //console.log(`${key}: ${value}`);
                    if (BibleObj[bkc] && BibleObj[bkc][chp]) retOb[bkc][chp][vrs] = BibleObj[bkc][chp][vrs]
                }
            }
        }
        return retOb
    },
    convert_Tbcv_2_bcvT: function (rbcv, bcvRobj) {
        if (null === bcvRobj) bcvRobj = {}
        for (const [rev, revObj] of Object.entries(rbcv)) {
            for (const [vol, chpObj] of Object.entries(revObj)) {
                if (!bcvRobj[vol]) bcvRobj[vol] = {}
                for (const [chp, vrsObj] of Object.entries(chpObj)) {
                    if (!bcvRobj[vol][chp]) bcvRobj[vol][chp] = {}
                    for (const [vrs, txt] of Object.entries(vrsObj)) {
                        if (!bcvRobj[vol][chp][vrs]) bcvRobj[vol][chp][vrs] = {}
                        bcvRobj[vol][chp][vrs][rev] = txt
                    };
                };
            };
        };
        return bcvRobj;
    },

    search_str_in_bcvT: function (bcvR, Fname, searchStrn) {
        function _parse_global_parm(searchPat) {
            var arsrmat = searchPat.match(/^\/(.*)\/([a-z]*)$/)
            var exparm = "g"
            if (arsrmat && arsrmat.length === 3) {
                console.log(arsrmat)
                searchPat = arsrmat[1]
                exparm += arsrmat[2]
            }
            return { searchPat: searchPat, parm: exparm };
        }
        var parsePat = _parse_global_parm(searchStrn)
        console.log("searchStrn=", searchStrn)
        function _parse_AND(searchPat) {
            var andary = []
            var andmat = searchPat.match(/[\(][\?][\=][\.][\*]([^\)]+)[\)]/g)   //(?=.*Sarai)(?=.*Abram)
            if (andmat) {
                console.log(andmat)
                andmat.forEach(function (fand) {
                    var cors = fand.match(/(?:[\(][\?][\=][\.][\*])([^\)]+)([\)])/)
                    if (cors.length === 3) andary.push(cors[1])
                    console.log("cors", cors)
                })
            }
            return andary;
        }
        var andary = _parse_AND(searchStrn)
        console.log("andary:", andary)


        var retOb = {}
        for (const [bkc, chpObj] of Object.entries(bcvR)) {
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                for (const [vrs, revObj] of Object.entries(vrsObj)) {
                    var bFound = false
                    for (const [rev, txt] of Object.entries(revObj)) {
                        if (rev === Fname) {
                            var rep = new RegExp(parsePat.searchPat, parsePat.parm);
                            var mat = txt.match(rep);
                            if (mat) {
                                mat.forEach(function (s, i) {
                                    //if (s.length > 0) console.log(i, s)
                                })
                                bFound = true
                                var txtFound = txt

                                if (andary.length === 0) {
                                    var repex = new RegExp(mat[0], parsePat.parm)
                                    txtFound = txt.replace(repex, "<font class='matInSvr'>" + mat[0] + "</font>");
                                } else {
                                    andary.forEach(function (strkey) {
                                        var repex = new RegExp(strkey, parsePat.parm)
                                        txtFound = txtFound.replace(repex, "<font class='matInSvr'>" + strkey + "</font>");
                                    })
                                }

                                bcvR[bkc][chp][vrs][rev] = txtFound
                            }
                        }
                    }
                    if (bFound) {
                        for (const [rev, txt] of Object.entries(revObj)) {
                            if (!retOb[bkc]) retOb[bkc] = {}
                            if (!retOb[bkc][chp]) retOb[bkc][chp] = {};//BibleObj[bkc][chp]
                            if (!retOb[bkc][chp][vrs]) retOb[bkc][chp][vrs] = {};//BibleObj[bkc][chp]
                            retOb[bkc][chp][vrs][rev] = txt
                        }
                    }
                }
            }
        }
        return retOb
    },
    search_str_in_bibObj__not_used: function (bibObj, searchStrn) {
        var retOb = {}
        for (const [bkc, chpObj] of Object.entries(bibObj)) {
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                for (const [vrs, txt] of Object.entries(vrsObj)) {
                    var rep = new RegExp(searchStrn, "g");
                    var mat = txt.match(rep);
                    if (mat) {
                        var txtFound = txt.replace(mat[0], "<font class='matInSvr'>" + mat[0] + "</font>");

                        if (!retOb[bkc]) retOb[bkc] = {}
                        if (!retOb[bkc][chp]) retOb[bkc][chp] = {};//BibleObj[bkc][chp]
                        if (!retOb[bkc][chp][vrs]) retOb[bkc][chp][vrs] = {};//BibleObj[bkc][chp]
                        retOb[bkc][chp][vrs][rev] = txtFound
                    }
                }
            }
        }
        return retOb
    },
    bcv_parser: function (sbcv, txt) {
        sbcv = sbcv.replace(/\s/g, "");
        if (sbcv.length === 0) return alert("please select an item first.");
        var ret = { vol: "", chp: "", vrs: "" };
        var mat = sbcv.match(/^(\w{3})\s{,+}(\d+)\s{,+}[\:]\s{,+}(\d+)\s{,+}$/);
        var mat = sbcv.match(/^(\w{3})\s+(\d+)\s+[\:]\s+(\d+)\s+$/);
        var mat = sbcv.match(/^(\w{3})(\d+)\:(\d+)$/);
        if (mat) {
            ret.vol = mat[1].trim();
            ret.chp = "" + parseInt(mat[2]);
            ret.vrs = "" + parseInt(mat[3]);
        } else {
            alert("sbcv=" + sbcv + "," + JSON.stringify(ret));
        }
        ret.chp3 = ret.chp.padStart(3, "0");
        ret._vol = "_" + ret.vol;

        ret.std_bcv = `${ret.vol}${ret.chp}:${ret.vrs}`

        var pad3 = {}
        pad3.chp = ret.chp.padStart(3, "0");
        pad3.vrs = ret.vrs.padStart(3, "0");
        pad3.bcv = `${ret.vol}${pad3.chp}:${pad3.vrs}`
        ret.pad3 = pad3

        var obj = {}
        obj[ret.vol] = {}
        obj[ret.vol][ret.chp] = {}
        obj[ret.vol][ret.chp][ret.vrs] = txt
        ret.bcvObj = obj

        ///////validation for std bcv.
        // if (undefined === _Max_struct[ret.vol]) {
        //     ret.err = `bkc not exist: ${ret.vol}`
        // } else if (undefined === _Max_struct[ret.vol][ret.chp]) {
        //     ret.err = `chp not exist: ${ret.chp}`
        // } else if (undefined === _Max_struct[ret.vol][ret.chp][ret.vrs]) {
        //     ret.err = `vrs not exist: ${ret.vrs}`
        // } else {
        //     ret.err = ""
        // }

        return ret;
    },


    loadObj_by_fname: function (jsfnm) {
        var ret = { obj: null, fname: jsfnm, fsize: -1, header: "", err: "" };

        if (!fs.existsSync(jsfnm)) {
            console.log("f not exit:", jsfnm)
            return ret;
        }
        ret.stat = BibleUti.GetFileStat(jsfnm)
        ret.fsize = ret.stat.size;
        if (ret.fsize > 0) {
            var t = fs.readFileSync(jsfnm, "utf8");
            var i = t.indexOf("{");
            if (i > 0) {
                ret.header = t.substr(0, i);
                var s = t.substr(i);
                try {
                    ret.obj = JSON.parse(s);
                } catch (e) {
                    ret.err = e;
                }

            }
        }

        ret.writeback = function () {
            var s2 = JSON.stringify(this.obj, null, 4);
            BibleUti.execSync_Cmd(`echo 'lll'| sudo -S chmod -R 777 ${this.fname}`)
            fs.writeFileSync(this.fname, this.header + s2);
            ret.dlt_size = ret.header.length + s2.length - ret.fsize
        }
        return ret;
    },
    inpObj_to_karyObj: function (inpObj) {
        var keyObj = { kary: [] }
        for (const [bkc, chpObj] of Object.entries(inpObj)) {
            keyObj.bkc = bkc
            keyObj.kary.push(bkc)
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                keyObj.chp = chp
                keyObj.kary.push(chp)
                for (const [vrs, txt] of Object.entries(vrsObj)) {
                    keyObj.vrs = vrs
                    keyObj.txt = txt
                    keyObj.kary.push(vrs)
                    keyObj.kary.push(txt)
                }
            }
        }
        return keyObj;
    },

    ____________Write2vrs_txt_by_inpObj__________: function (jsfname, doc, inpObj, bWrite) {
        var out = {}
        var bib = BibleUti.loadObj_by_fname(jsfname);
        out.m_fname = bib.fname

        if (bib.fsize > 0) {
            console.log("fsize:", bib.fsize)
            for (const [bkc, chpObj] of Object.entries(inpObj)) {
                console.log("chpObj", chpObj)
                for (const [chp, vrsObj] of Object.entries(chpObj)) {
                    console.log("vrsObj", vrsObj)
                    for (const [vrs, txt] of Object.entries(vrsObj)) {
                        var readtxt = bib.obj[bkc][chp][vrs]
                        out.data = { dbcv: `${doc}~${bkc}${chp}:${vrs}`, txt: readtxt }
                        console.log("origtxt", readtxt)

                        if (bWrite) {
                            console.log("newtxt", txt)
                            bib.obj[bkc][chp][vrs] = txt
                            bib.writeback();
                            out.desc += ":Write-success"
                        } else {
                            out.desc += ":Read-success"
                        }
                    }
                }
            }
        }
        return out
    },



    decrypt_txt: function (toDecrypt, privateKey) {
        //const absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey)
        //const privateKey = fs.readFileSync(absolutePath, 'utf8')
        const buffer = Buffer.from(toDecrypt, 'base64')
        const decrypted = crypto.privateDecrypt(
            {
                key: privateKey.toString(),
                passphrase: '',
                padding: crypto.constants.RSA_PKCS1_PADDING
            },
            buffer,
        )
        return decrypted.toString('utf8')
    },


    _check_pub_testing: function (inp) {
        if (inp.usr.passcode.length === 0) {
            return inp_usr
        }
        ////SpecialTestRule: repopath must be same as password.
        inp.usr.repopath = inp.usr.repopath.trim()
        const PUB_TEST = "pub_test"
        if (inp.usr_proj.projname.indexOf(PUB_TEST) === 0) {
            if (inp.usr_proj.projname !== inp.usr.passcode && "3edcFDSA" !== inp.usr.passcode) {
                console.log("This is for pub_test only but discord to the rule.")
                return null
            } else {
                console.log("This is for pub_test only: sucessfully pass the rule.")
                inp.usr.passcode = "3edcFDSA"
            }
        }
        return inp
    },
    _deplore_usr_proj_dirs: function (usr_proj, base_Dir) {
        //const base_Dir = "bible_study_notes/usrs"


        usr_proj.base_Dir = base_Dir
        usr_proj.user_dir = `${base_Dir}/${usr_proj.hostname}/${usr_proj.username}`
        usr_proj.git_root = `${base_Dir}/${usr_proj.hostname}/${usr_proj.username}/${usr_proj.projname}`
        usr_proj.acct_dir = `${base_Dir}/${usr_proj.hostname}/${usr_proj.username}/${usr_proj.projname}/account`
        usr_proj.dest_myo = `${base_Dir}/${usr_proj.hostname}/${usr_proj.username}/${usr_proj.projname}/account/myoj`
        usr_proj.dest_dat = `${base_Dir}/${usr_proj.hostname}/${usr_proj.username}/${usr_proj.projname}/account/dat`


        console.log("deplore: usr_proj=", usr_proj)
    },

    _interpret_repo_url: function (proj_url) {
        if (!proj_url) return null
        //https://github.com/wdingbox/Bible_obj_weid.git
        var reg = new RegExp(/^https\:\/\/github\.com\/(\w+)\/(\w+)(\.git)$/)
        const hostname = "github.com"

        var mat = proj_url.match(/^https\:\/\/github\.com[\/](([^\/]*)[\/]([^\.]*))[\.]git$/)
        if (mat && mat.length === 4) {
            //console.log("mat:", mat)
            //return { format: 2, desc: "full_path", full_path: mat[0], user_repo: mat[1], user: mat[2], repo: mat[3] }
            var username = mat[2]
            var projname = mat[3]


            var owner = `_${hostname}_${username}_${projname}`
            var ownerId = `${hostname}/${username}/${projname}`
            return { hostname: hostname, username: username, projname: projname, ownerId: ownerId, ownerstr: owner }
        }
        return null
    },

    default_inp_out_obj: function () {
        return {
            data: null, desc: "", err: null,
            state: { bGitDir: -1, bMyojDir: -1, bDatDir: -1, bEditable: -1, bRepositable: -1 }
        }
    },
    Parse_POST_req_to_inp: function (req, res, cbf) {
        console.log("req.method", req.method)
        console.log("req.url", req.url)

        //req.pipe(res)
        if (req.method === "POST") {
            //req.pipe(res)
            console.log("POST: ----------------", "req.url=", req.url)
            var body = "";
            req.on("data", function (chunk) {
                body += chunk;
                console.log("on post data:", chunk)
            });

            req.on("end", async function () {
                console.log("on post eend:", body)

                var inpObj = null
                try {
                    inpObj = JSON.parse(body)
                    inpObj.out = BibleUti.default_inp_out_obj()
                } catch (err) {
                    inpObj.err = err
                }
                console.log("POST:3 inp=", JSON.stringify(inpObj, null, 4));


                console.log("cbf start ------------------------------")
                await cbf(inpObj)

                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(inpObj))
                res.end();
                console.log("finished post req------------------------------")
            });
        } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end();
            console.log("end of req")
        }
    },
    Parse_GET_req_to_inp: function (req) {
        console.log("\n\n\n\n\n\n\n\n-----req.method (GET?)", req.method)
        console.log("-GET: req.url=", req.url);
        console.log("-req.query", req.query)
        var remoteAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);
        console.log("-remoteAddr", remoteAddr)
        console.log("-req.headers", req.headers)
        console.log(req.connection.remoteAddress);


        if (req.method !== "GET") {
            return null
        }
        //console.log("\n\n\n\n---->GET: req.query=", req.query);
        //var q = url.parse(req.url, true).query;
        //console.log("q=", q);
        if ("undefined" === typeof req.query.inp) {
            console.log("req.query.inp: undefined. Maybe initial loading or page transition");
            return null;
        }

        var inpObj = {}
        console.log("req.query.inp=", req.query.inp)
        if (req.query.inp.match(/^CUID\d+\.\d+$/)) { //SignPageLoaded
            inpObj.CUID = req.query.inp
            return inpObj
        } else {
            var d64 = Buffer.from(req.query.inp, 'base64').toString()
            //d64 = Buffer.from(d64, 'base64').toString()
            var sin = decodeURIComponent(d64);//must for client's encodeURIComponent

            var out = BibleUti.default_inp_out_obj()
            try {
                var inpObj = JSON.parse(sin);
                inpObj.out = out
                console.log("GET: inp =", JSON.stringify(inpObj, null, 4));
                //cbf(inpObj, res)
                return inpObj
            } catch (err) {
                out.err = err
                console.log(err)
                return out
            }
        }

    },
    Update_SvrIP_in_HomeSitePage: function () {
        var inp = {}
        inp.usr = { repopath: "https://github.com/bsnp21/home.git", passcode: "3edcFDSA", repodesc: "" }
        inp.out = BibleUti.default_inp_out_obj()
        //inp.SSID = "github.com/bsnp21/home"; //SSID Not Used At all. "../../../../bist/usrs/github.com/bsnp21/home"
        var rootDir = BibleUti.WorkingRootDir();// + WorkingRootNodeName
        var userProject = new BibleObjGituser(rootDir)
        if (!userProject.parse_inp_usr2proj(inp)) {
            return
        }
        userProject.git_clone()
        userProject.run_proj_state()
        console.log(inp.out.state)
        if (1 === inp.out.state.bRepositable) {
            //
            var fidx = userProject.get_usr_git_dir("/index.html")//="../../../../bist/usrs/github.com/bsnp21/home/index.html"
            if (!fs.existsSync(fidx)) {
                return console.log("Error update HomeSiteSvrIP. Not exist", fidx)
            }
            BibleUti.execSync_Cmd(`echo 'lll'|  sudo -S chmod 777 ${fidx}`)
            var txt = fs.readFileSync(fidx, "utf8")
            var SvrIP = "0.0.0.0"
            SvrIP = BibleUti.execSync_Cmd("dig +short myip.opendns.com @resolver1.opendns.com").toString().trim()
            console.log("ret SvrIP=", SvrIP)
            txt = txt.replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g, SvrIP)
            fs.writeFileSync(fidx, txt, "utf8")
            console.log(txt)
            console.log("git dir exist. push before to delete it")
            var res2 = userProject.execSync_cmd_git("git add *")
            var res3 = userProject.execSync_cmd_git(`git commit -m "on del in Cache"`)
            var res4 = userProject.git_push()

            var res5 = userProject.run_proj_destroy()
        }

    },
    //// BibleUti /////
}



var SvrUsrsBCV = function (srcpath) {
    this.m_rootDir = srcpath
    this.output = {
        m_olis: [],
        m_totSize: 0,
        m_totFiles: 0,
        m_totPaths: 0
    }
}
SvrUsrsBCV.prototype.get_paths = function (srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        if ("." === file[0]) return false;
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}
SvrUsrsBCV.prototype.get_files = function (srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        if ("." === file[0]) return false;
        return fs.statSync(srcpath + '/' + file).isFile();
    });
}
SvrUsrsBCV.prototype.getFary = function (srcPath, cbf) {
    var fary = this.get_files(srcPath);
    var dary = this.get_paths(srcPath);
    this.output.m_totPaths += dary.length;
    this.output.m_totFiles += fary.length;

    for (var i = 0; i < dary.length; i++) {
        var spath = dary[i];
        //console.log(spath)
        this.getFary(path.join(srcPath, spath), cbf);
    }
    for (var k = 0; k < fary.length; k++) {
        var sfl = fary[k];
        //console.log("path file :", srcPath, sfl)
        //if (doc !== sfl) continue
        var pathfile = path.join(srcPath, sfl);
        var stats = fs.statSync(pathfile);
        this.output.m_totSize += stats.size;

        if (cbf) cbf(srcPath, sfl)
    }
}
SvrUsrsBCV.prototype.decompose = function (docpathfilname) {
    var ret = path.parse(docpathfilname)
    //console.log(ret)
    var ary = ret.dir.split("/")
    var owner = `_${ary[6]}_${ary[7]}_${ary[8]}`
    var compound = { owner: owner, base: ret.base }
    //console.log("compound", compound)
    return compound
}
SvrUsrsBCV.prototype.gen_crossnet_files_of = function (docpathfilname, cbf) {
    //console.log("spec=", spec)
    this.m_compound = this.decompose(docpathfilname)
    var _This = this
    this.getFary(this.m_rootDir, function (spath, sfile) {
        var pathfile = path.join(spath, sfile);
        var cmpd = _This.decompose(pathfile)
        if (cmpd.base === _This.m_compound.base) {
            _This.output.m_olis.push(pathfile);
            console.log("fnd:", pathfile)
            if (cbf) cbf(spath, sfile)
        }

    })
    return this.output
}









var NCache = {}
NCache.m_checkperiod = 60 //s.
NCache.m_TTL = NCache.m_checkperiod * 6 //seconds (default)
NCache.m_MFT = 300  //MaxForgivenTimesToKeepCache== ttl * 300.
NCache.m_MAX = 3600 * 200  //about a week

NCache.myCache = new NodeCache({ checkperiod: NCache.m_checkperiod }); //checkperiod default is 600s.
NCache.Init = function () {
    NCache.myCache.set("test", { publicKey: 1, privateKey: 1, CUID: 1 }, 30)
    //myCache.ttl( "tuid", 3 )
    console.log("ttl=", NCache.myCache.getTtl("test"))

    NCache.myCache.set("test", { publicKey: 1, privateKey: 1, CUID: 1 }, 10)
    //myCache.ttl( "tuid", 6 )
    console.log("ttl=", NCache.myCache.getTtl("test"))
    var obj = NCache.myCache.get("test")
    console.log(obj)



    function _destroy_git_proj(key, val) {
        console.log(`\n\n\n\n\n\n\n\n\n\non del, NCache.m_checkperiod=${NCache.m_checkperiod},m_TTL=${NCache.m_TTL}, m_MFT=${NCache.m_MFT}`)
        // ... do something ...
        var rootDir = BibleUti.WorkingRootDir();// + WorkingRootNodeName
        console.log(`on del:key=${key}, \n-val=${JSON.stringify(val)}, \n-rootDir=${rootDir}`)

        if (!val) return console.log("on del: !val")
        if ("object" !== typeof (val)) return console.log("on del: val not valid inp.usr obj")
        if (!val.repopath) return console.log("on del: val invalid. inp.usr.repopath null")

        if (!fs.existsSync(rootDir)) return console.log(`not existsSync(${rootDir}).`)
        //if (!fs.existsSync(key)) return console.log(`not existsSync(${key}).`)

        var gitdir = Buffer.from(key, 'base64').toString('utf8')
        console.log("on del:* start to del proj_destroy ssid=", key)
        console.log("on del:* start to del proj_destroy ownr=", gitdir)
        var inp = {}
        inp.usr = val
        inp.out = BibleUti.default_inp_out_obj()
        inp.SSID = key
        var userProject = new BibleObjGituser(rootDir)
        if (userProject.parse_inp_usr2proj(inp)) {
            userProject.run_proj_state()
            console.log(inp.out.state)
            if (1 === inp.out.state.bRepositable) {
                //
                console.log("on del:git dir exist. push before to delete it")
                var res2 = userProject.execSync_cmd_git("git add *")
                var res3 = userProject.execSync_cmd_git(`git commit -m "on del in Cache"`)
                var res4 = userProject.git_push()

                var res5 = userProject.run_proj_destroy()
            }
        }
        console.log("on del:* End of del proj_destroy ssid=", key, gitdir)
    }


    function _MaxForgivenTimes(key, val) {
        if ("object" !== typeof val) {
            return console.log("on expired, must dies!~~~~~~~~~~~~", key)
        }

        if (key.match(/^CUID\d+\.\d+/)) {//key=CUID16129027802800.6753972926962513, 
            return console.log("on expired, must dies!~~~~~~~~~~~~", key)
        }

        var tms = val.tms, ttl = val.ttl
        if (!tms || !ttl) {
            return console.log("on expired, invalid must die.", ttl, tms, key)
        }

        var cur = (new Date()).getTime() //(ms)
        var dlt = (cur - tms) / 1000.0 //(s)
        var max = ttl * NCache.m_MFT
        if (max > NCache.m_MAX) {
            max = NCache.m_MAX
        }

        console.log(`on expired,MFT=${NCache.m_MFT}, ttl=${ttl}, dlt=${dlt}, key=${key}`)
        if (dlt < max) {
            console.log("on expired, keep alive!", key)
            NCache.myCache.set(key, val, ttl) //keep it.
        } else {
            console.log("on expired, ~~~~~~~~~ die ~~~~~~~", key)
        }
        console.log("on expired end!\n\n\n\n\n\n\n")
    }

    NCache.myCache.on("del", function (key, val) {
        _destroy_git_proj(key, val)
        _MaxForgivenTimes(key, val)
    });
    NCache.myCache.on("expired", function (key, val) {
        //console.log(`on expired:key=${key}, \n-val=${JSON.stringify(val)}`)
        _MaxForgivenTimes(key, val)
    })
}
NCache.Set = function (key, val, ttl) {
    if (undefined === ttl) ttl = NCache.m_TTL
    if ("object" === typeof val) {
        val.tms = (new Date()).getTime() //timestampe for last access.
        val.ttl = ttl
    }
    this.myCache.set(key, val, ttl) //restart ttl -- reborn again.
}
NCache.Get = function (key, ttl) {
    var val = this.myCache.get(key)
    if (undefined === val || null === val) { //0 and "" are allowed.
        return null
    }
    if (undefined === ttl) {
        if ("object" === typeof (val)) {
            ttl = val.ttl
            this.Set(key, val, ttl) //restart ttl -- reborn again.
        }
    }
    console.log("reset ttl w/", val)
    return val
}
NCache.Init()

















//../../../../bist/usrs/{hostname}/{Usrname}/{projname}/account/dat
//../../../../bist/usrs/{hostname}/{Usrname}/{projname}/account/myoj
var BibleObjGituser = function (rootDir) {
    if (!rootDir.match(/\/$/)) rootDir += "/"
    this.m_rootDir = rootDir


    this.m_sRootNode = WorkingRootNodeName //"bist"
    this.m_sBaseUsrs = `${this.m_sRootNode}/usrs`
    this.m_sBaseTemp = `${this.m_sRootNode}/temp`

    var pathrootdir = rootDir + this.m_sRootNode
    this.m_SvrUsrsBCV = new SvrUsrsBCV(pathrootdir)

}
BibleObjGituser.prototype.genKeyPair = function (cuid) {
    if (!cuid) return
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // Note:can encrypt txt len max 501 bytes. 
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        }
    });
    console.log("publicKey\n", publicKey)
    console.log("privateKey\n", privateKey)

    var pkb64 = Buffer.from(publicKey).toString("base64")
    console.log("pkb64\n", pkb64)
    console.log("pkb64.len", pkb64.length)

    //var tuid = this.m_inp.CUID
    var val = { publicKey: publicKey, privateKey: privateKey, pkb64: pkb64, CUID: cuid }

    NCache.Set(cuid, val, 60) //set 10min for sign-in page..
    return val
}




BibleObjGituser.prototype.proj_get_usr_fr_cache_ssid = function (inp) {
    inp.out.state.ssid_cur = inp.SSID
    if (!inp.SSID || inp.SSID.length === 0) {
        return null
    }
    if (!NCache.myCache.has(inp.SSID)) {
        console.log("proj_get_usr_fr_cache_ssid: has no key: NCache.myCache.has(inp.SSID)", inp.SSID)
        //return null
    }

    var ttl = (inp.aux && inp.aux.cacheTTL) ? inp.aux.cacheTTL : null

    inp.usr = NCache.Get(inp.SSID, ttl)
    console.log("proj_get_usr_fr_cache_ssid inp.SSID:", inp.SSID)
    console.log("proj_get_usr_fr_cache_ssid:inp.aux.cacheTTL=", ttl)
    console.log("proj_get_usr_fr_cache_ssid:inp=", inp)
    if (!inp.usr) {
        inp.out.state.ssid_cur = "SSID-Timeout"
        console.log("proj_get_usr_fr_cache_ssid:inp.out.state.ssid_cur=", inp.out.state.ssid_cur)
        return null
    }

    return inp.usr
}
BibleObjGituser.prototype.proj_update_cache_ssid_by_inp_aux = function (inp) {

    if (!inp.SSID || inp.SSID.length === 0 || !inp.usr || !inp.aux) {
        return null
    }

    //extra work: update repodesc
    if ("string" === typeof inp.aux.Update_repodesc) {
        inp.usr.repodesc = inp.aux.Update_repodesc
    }
    if (inp.aux.cacheTTL) {

    }
    NCache.Set(inp.SSID, inp.usr, inp.aux.cacheTTL)
    console.log(`Update_repodesc ************* inp.aux= ${JSON.stringify(inp.aux)}`)

    return inp.usr
}
BibleObjGituser.prototype.proj_parse_usr_signed = function (inp) {
    this.m_inp = inp
    if (!inp || !inp.out) {
        return null
    }

    if (null === this.proj_get_usr_fr_cache_ssid(inp)) {
        return null
    }
    this.proj_update_cache_ssid_by_inp_aux(inp)
    return this.parse_inp_usr2proj(inp)
}
BibleObjGituser.prototype.proj_get_usr_fr_decipher_cuid = function (inp) {
    console.log("inp.CUID", inp.CUID)
    if (!inp.CUID || inp.CUID.length === 0) return console.log(inp.CUID)

    var robj = NCache.myCache.take(inp.CUID) //take: for safety delete immediately after use.
    if (!robj) return console.log("cache null=" + inp.CUID)
    console.log(robj)

    console.log(inp.cipherusrs)

    var str = BibleUti.decrypt_txt(inp.cipherusrs, robj.privateKey)
    var usrObj = JSON.parse(str)
    console.log("session_decipher_usrs usrObj=")
    console.log(usrObj)
    inp.usr = usrObj
    return inp

}
BibleObjGituser.prototype.proj_parse_usr_signin = function (inp) {
    this.m_inp = inp
    if (!inp || !inp.out) {
        console.log("!inp || !inp.out")
        return null
    }

    if (null === this.proj_get_usr_fr_decipher_cuid(inp)) {
        return null
    }
    return this.parse_inp_usr2proj(inp)
}
BibleObjGituser.prototype.parse_inp_usr2proj = function (inp) {
    if ("object" !== typeof inp.usr || !inp.usr) {
        inp.usr_proj = null
        console.log("inp.usr is null")
        return null
    }
    if (!this.m_inp) this.m_inp = inp
    console.log(inp)

    inp.usr_proj = BibleUti._interpret_repo_url(inp.usr.repopath)
    if (!inp.usr_proj) {
        inp.out.desc = "invalid repospath."
        console.log(inp.out.desc)
        return null;
    }
    BibleUti._deplore_usr_proj_dirs(inp.usr_proj, this.m_sBaseUsrs)


    if (null === BibleUti._check_pub_testing(inp)) {
        inp.out.desc = "failed pub test."
        inp.usr_proj = null
        console.log(inp.out.desc)
        return null
    }
    this.parse_inp_usr2proj_final()
    return inp
}
BibleObjGituser.prototype.parse_inp_usr2proj_final = function () {
    var inp = this.m_inp;
    inp.usr_proj.git_Usr_Pwd_Url = ""
    if (inp.usr.passcode.trim().length > 0) {
        inp.usr_proj.git_Usr_Pwd_Url = `https://${inp.usr_proj.username}:${inp.usr.passcode}@${inp.usr_proj.hostname}/${inp.usr_proj.username}/${inp.usr_proj.projname}.git`
    }

    inp.usr.repodesc = inp.usr.repodesc.trim().replace(/[\r|\n]/g, ",")//:may distroy cmdline.
}

BibleObjGituser.prototype.session_get_github_owner = function (docfile) {
    //jspfn: ../../../../bist/usrs/github.com/bsnp21/pub_test01/account/myoj/myNote_json.js
    var ary = docfile.split("/")
    var idx = ary.indexOf("usrs")
    var hostname = ary[idx + 1]
    var username = ary[idx + 2]
    var reponame = ary[idx + 3]
    var owner = username + "/" + reponame
    return owner
}
BibleObjGituser.prototype.session_git_repodesc_load = function (docfile) {
    //jspfn: ../../../../bist/usrs/github.com/bsnp21/pub_test01/account/myoj/myNote_json.js
    var pos = docfile.indexOf("/account/")
    var gitpath = docfile.substr(0, pos)
    console.log("gitpath", gitpath)
    var usrObj = NCache.Get(gitpath)
    if (!usrObj) return null
    console.log("usrObj", usrObj)
    return { repodesc: usrObj.repodesc, pathfile: gitpath }
}

BibleObjGituser.prototype.session_create = function () {
    var gitdir = this.get_usr_git_dir()

    if (!this.m_inp.usr_proj) return null
    var ssid = this.m_inp.usr_proj.ownerId
    var ssid_b64 = Buffer.from(ssid).toString("base64")
    NCache.Set(ssid_b64, this.m_inp.usr)
    console.log("session_create:", ssid, ssid_b64, this.m_inp.usr)

    return ssid_b64
}

BibleObjGituser.prototype.get_proj_tmp_dir = function (subpath) {
    var dir = `${this.m_rootDir}${this.m_sBaseTemp}`
    // if (!fs.existsSync(dir)) {
    //     //fs.mkdirSync(dir, 0777, { recursive: true });
    //     var password = "lll"
    //     var command = `
    //         echo ${password} | sudo -S mkdir -p ${dir}
    //         echo ${password} | sudo -S chmod 777 ${dir}
    //         `
    //     var ret = BibleUti.execSync_Cmd(command)
    //     console.log(ret)
    // }
    return `${dir}${subpath}`
}
BibleObjGituser.prototype.get_usr_acct_dir = function (subpath) {
    if (!this.m_inp.usr_proj) return ""
    if (!subpath) {
        return `${this.m_rootDir}${this.m_inp.usr_proj.acct_dir}`
    }
    return `${this.m_rootDir}${this.m_inp.usr_proj.acct_dir}${subpath}`
}
BibleObjGituser.prototype.get_usr_myoj_dir = function (subpath) {
    if (!this.m_inp.usr_proj) return ""
    if (!subpath) {
        return `${this.m_rootDir}${this.m_inp.usr_proj.dest_myo}`
    }
    return `${this.m_rootDir}${this.m_inp.usr_proj.dest_myo}${subpath}`
}
BibleObjGituser.prototype.get_usr_dat_dir = function (subpath) {
    if (!this.m_inp.usr_proj) return ""
    if (!subpath) {
        return `${this.m_rootDir}${this.m_inp.usr_proj.dest_dat}`
    }
    return `${this.m_rootDir}${this.m_inp.usr_proj.dest_dat}${subpath}`
}
BibleObjGituser.prototype.get_usrdir = function (subpath) {
    if (!this.m_inp.usr_proj) return ""
    if (!subpath) {
        return `${this.m_rootDir}${this.m_inp.usr_proj.dest_dat}`
    }
    return `${this.m_rootDir}${this.m_inp.usr_proj.dest_dat}${subpath}`
}

BibleObjGituser.prototype.get_usr_git_dir = function (subpath) {
    if (!this.m_inp.usr_proj) return ""
    if (undefined === subpath || null === subpath) {
        return `${this.m_rootDir}${this.m_inp.usr_proj.git_root}`
    }
    //if (subpath[0] !== "/") subpath = "/" + subpath
    return `${this.m_rootDir}${this.m_inp.usr_proj.git_root}${subpath}`
}

BibleObjGituser.prototype.get_DocCode_Fname = function (DocCode) {
    if (!DocCode.match(/^e_/)) return "" //:like, e_Note
    //var fnam = DocCode.replace(/^e_/, "my")  //:myNode_json.js
    return `${DocCode}_json.js`
}
BibleObjGituser.prototype.get_pfxname = function (DocCode) {
    var inp = this.m_inp
    //var DocCode = inp.par.fnames[0]
    if (!DocCode) return ""
    var dest_pfname = ""
    switch (DocCode[0]) {
        case "_": //: _myNode,
        case "e": //: e_Node,
            {
                var fnam = this.get_DocCode_Fname(DocCode)
                dest_pfname = this.get_usr_myoj_dir(`/${fnam}`)
            }
            break
        case ".": //-: ./dat/localStorage
            {
                var fnam = DocCode.substr(1)
                dest_pfname = this.get_usr_acct_dir(`${fnam}_json.js`)
            }
            break;
        default: //: NIV, CUVS,  
            dest_pfname = `${this.m_rootDir}bible_obj_lib/jsdb/jsBibleObj/${DocCode}.json.js`;
            break;
    }
    return dest_pfname
}
BibleObjGituser.prototype.get_userpathfile_from_tempathfile = function (tmpathfile) {
    //var src = `${this.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate/myoj/${fnam}`
    var mat = tmpathfile.match(/[\/]myoj[\/]([\w]+)_json\.js$/) //::/myoj/myNode_json.js
    if (mat) {
        var doc = mat[1];//.replace(/^my/, "e_")  //docname: 
        var gitpfx = this.get_pfxname(doc)
        return gitpfx
    }
    //var src_dat = `${this.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate${fnam}_json.js`
    var mat = tmpathfile.match(/[\/]dat[\/]([\w]+)_json\.js$/)
    if (mat) {
        var doc = mat[1]
        var gitpfx = this.get_pfxname("./dat/" + doc)
        return gitpfx
    }
}
BibleObjGituser.prototype.get_dir_lib_template = function (subpf) {
    var pathfile = `${this.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate`
    if (undefined === subpf) {
        return pathfile
    }
    return pathfile + subpf
}



BibleObjGituser.prototype.run_makingup_missing_files = function (bCpy) {

    var _THIS = this
    var srcdir = this.get_dir_lib_template()
    var nMissed = 0
    BibleUti.GetFilesAryFromDir(srcdir, true, function (srcfname) {
        var ret = path.parse(srcfname);
        var ext = ret.ext
        var bas = ret.base

        var gitpfx = _THIS.get_userpathfile_from_tempathfile(srcfname)
        if (!fs.existsSync(gitpfx)) {
            nMissed++
            console.log("-src:", srcfname)
            console.log("-des:", gitpfx)
            const { COPYFILE_EXCL } = fs.constants;
            if (bCpy) {
                var pet = path.parse(gitpfx);
                if (!fs.existsSync(pet.dir)) {
                    var ret = BibleUti.execSync_Cmd(`echo 'lll' | sudo -S mkdir -p  ${pet.dir}`)
                }
                BibleUti.execSync_Cmd(`echo 'lll' | sudo -S chmod 777 ${pet.dir}`)
                fs.copyFileSync(srcfname, gitpfx, COPYFILE_EXCL) //failed if des exists.
            }
        }
    });
    return nMissed
}

BibleObjGituser.prototype.run_proj_setup = function () {
    console.log("********************************************* run setup 1")
    var inp = this.m_inp
    if (!inp.usr_proj || !inp.out.state) {
        inp.out.desc += ", failed inp.usr parse"
        console.log("failed git setup", inp.out.desc)
        return null
    }

    var dir = this.get_usr_git_dir("/.git/config")
    if (!fs.existsSync(dir)) {
        this.git_clone() //always sucess even passwd is wrong.
    } else {
        this.git_pull()
    }

    if (!fs.existsSync(dir)) {
        return null
    }


    if (fs.existsSync(dir)) {
        this.run_makingup_missing_files(true)
    }

    var dir = this.get_usr_acct_dir()
    if (fs.existsSync(dir)) {
        BibleUti.execSync_Cmd(`echo 'lll' |sudo -S chmod -R 777 ${dir}`)
    }

    this.run_proj_state()
    return inp
}
BibleObjGituser.prototype.run_proj_destroy = function () {
    var inp = this.m_inp
    var proj = inp.usr_proj;
    if (!proj) {
        console.log("failed git setup", inp)
        return inp
    }

    //console.log("proj", proj)
    var gitdir = this.get_usr_git_dir()
    //var password = "lll" //dev mac
    var proj_destroy = `
      sudo -S rm -rf ${gitdir}
    `

    if (fs.existsSync(`${gitdir}`)) {
        inp.out.exec_git_cmd_result = BibleUti.execSync_Cmd(proj_destroy).toString()
        inp.out.desc += "destroyed git dir: " + gitdir
    }

    //this.session_destroy()

    this.run_proj_state()
    return inp
}
BibleObjGituser.prototype.run_proj_state = function (cbf) {
    if (!this.m_inp.out || !this.m_inp.out.state) return console.log("******Fatal Error.")
    var stat = this.m_inp.out.state
    //inp.out.state = { bGitDir: -1, bMyojDir: -1, bEditable: -1, bRepositable: -1 }


    var dir = this.get_usr_myoj_dir()
    stat.bMyojDir = (fs.existsSync(dir)) ? 1 : 0

    var dir = this.get_usr_dat_dir()
    stat.bDatDir = (fs.existsSync(dir)) ? 1 : 0

    var dir = this.get_usr_git_dir("/.git/config")
    stat.bGitDir = (fs.existsSync(dir)) ? 1 : 0

    stat.bEditable = (1 === stat.bMyojDir && 1 === stat.bDatDir && 1 === stat.bGitDir) ? 1 : 0
    //stat.bRepositable = stat.bGitDir

    stat.missedFiles = this.run_makingup_missing_files(false)
    stat.config = this.load_git_config()

    /////// git status
    //stat.bEditable = stat.bGitDir * stat.bMyojDir * stat.bDatDir
    this.m_inp.out.state.bRepositable = 0
    if (stat.config.length > 0) {
        //if clone with password ok, it would ok for pull/push 
        stat.bRepositable = 1
    }

    var accdir = this.get_usr_acct_dir()
    var fstat = {}
    var totalsize = 0
    var iAlertLevel = 0
    BibleUti.GetFilesAryFromDir(accdir, true, function (fname) {
        var ret = path.parse(fname);
        var ext = ret.ext
        var nam = ret.base.replace(/_json\.js$/, "")
        //console.log("ret:",ret)
        var sta = fs.statSync(fname)
        var fMB = (sta.size / 1000000).toFixed(2)
        totalsize += sta.size
        var str = "" + fMB + "/100(MB)"
        if (fMB >= 80.0) { ////** Github: 100 MB per file, 1 GB per repo, svr:10GB
            var str = nam + ":" + fMB + "/100(MB)"
            warnsAry.push(str)
            iAlertLevel = 1
            str += "*"
        }
        if (fMB >= 90.0) { ////** Github: 100 MB per file, 1 GB per repo, svr:10GB
            stat.bMyojDir = 0
            iAlertLevel = 2
            str += "*"
        }
        fstat[nam] = str
    });

    stat.fstat = fstat
    stat.repo_usage = (totalsize / 1000000).toFixed(2) + "/1000(MB)"
    stat.repo_alertLevel = iAlertLevel


    if (cbf) cbf()
    return stat
}

BibleObjGituser.prototype.cp_template_to_git = function () {
    var inp = this.m_inp
    var proj = inp.usr_proj;
    if (!proj) {
        inp.out.desc += ", failed inp.usr parse"
        console.log("failed git setup", inp.out.desc)
        return inp
    }
    inp.out.desc += ",clone."

    var gitdir = this.get_usr_myoj_dir()
    if (fs.existsSync(`${gitdir}`)) {
        inp.out.desc += ", usr acct already exist: "
        return inp
    }

    //console.log("proj", proj)
    //var password = "lll" //dev mac
    var acctDir = this.get_usr_acct_dir()
    var cp_template_cmd = `
    #!/bin/sh
    echo 'lll' | sudo -S mkdir -p ${acctDir}
    echo 'lll' | sudo -S chmod -R 777 ${acctDir}
    # sudo -S cp -aR  ${this.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate  ${acctDir}/
    echo 'lll' | sudo -S cp -aR  ${this.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate/*  ${acctDir}/.
    echo 'lll' | sudo -S chmod -R 777 ${acctDir}
    #cd -`

    inp.out.cp_template_cmd = cp_template_cmd
    console.log("cp_template_cmd", cp_template_cmd)
    inp.out.cp_template_cmd_result = BibleUti.execSync_Cmd(cp_template_cmd).toString()

    if (!fs.existsSync(`${gitdir}`)) {
        inp.out.desc += ", cp failed: "
    }
    return inp
}
BibleObjGituser.prototype.chmod_R_777_acct = function (spath) {
    // mode : "777" 
    var inp = this.m_inp
    var proj = inp.usr_proj;
    if (!proj) {
        inp.out.desc += ", failed inp.usr parse"
        console.log("failed git setup", inp.out.desc)
        return inp
    }
    var dir = this.get_usr_acct_dir(spath)
    console.log("perm:", dir)
    if (!fs.existsSync(dir)) {
        return inp
    }
    //var password = "lll"
    var change_perm_cmd = `echo 'lll'|  sudo -S chmod -R 777 ${dir}`

    inp.out.change_perm = BibleUti.execSync_Cmd(change_perm_cmd).toString()

    return inp.out.change_perm
}
BibleObjGituser.prototype.chmod_R_ = function (mode, dir) {
    // mode : "777" 
    var inp = this.m_inp
    var proj = inp.usr_proj;
    if (!proj) {
        inp.out.desc += ", failed inp.usr parse"
        console.log("failed git setup", inp.out.desc)
        return inp
    }
    console.log("perm:", dir)
    if (!fs.existsSync(dir)) {
        return inp
    }
    //var password = "lll"
    var change_perm_cmd = ` sudo -S chmod -R ${mode} ${dir}`

    inp.out.change_perm = BibleUti.execSync_Cmd(change_perm_cmd).toString()

    return inp.out.change_perm
}

BibleObjGituser.prototype.load_git_config = function () {
    var git_config_fname = this.get_usr_git_dir("/.git/config")
    if (!fs.existsSync(git_config_fname)) return ""
    //if (!this.m_git_config_old || !this.m_git_config_new) {
    var olds, news, txt = fs.readFileSync(git_config_fname, "utf8")
    var ipos1 = txt.indexOf(this.m_inp.usr.repopath)
    var ipos2 = txt.indexOf(this.m_inp.usr_proj.git_Usr_Pwd_Url)

    console.log("ipos1:", ipos1, this.m_inp.usr.repopath)
    console.log("ipos2:", ipos2, this.m_inp.usr_proj.git_Usr_Pwd_Url)

    if (ipos1 > 0) {
        olds = txt
        news = txt.replace(this.m_inp.usr.repopath, this.m_inp.usr_proj.git_Usr_Pwd_Url)
    }
    if (ipos2 > 0) {
        news = txt
        olds = txt.replace(this.m_inp.usr_proj.git_Usr_Pwd_Url, this.m_inp.usr.repopath)

        console.log("initial git_config_fname not normal:", txt)
    }
    if ((ipos1 * ipos2) < 0) {
        this.m_git_config_old = olds
        this.m_git_config_new = news

        //var txt = fs.readFileSync(git_config_fname, "utf8")
        var pos0 = txt.indexOf("[remote \"origin\"]")
        var pos1 = txt.indexOf("\n\tfetch = +refs");//("[branch \"master\"]")
        this.m_inp.out.state.config = txt.substring(pos0 + 19, pos1)
    }
    //}
    return this.m_inp.out.state.config
}


BibleObjGituser.prototype.git_config_allow_push = function (bAllowPush) {
    { /****.git/config
        [core]
                repositoryformatversion = 0
                filemode = true
                bare = false
                logallrefupdates = true
                ignorecase = true
                precomposeunicode = true
        [remote "origin"]
                url = https://github.com/wdingbox/bible_obj_weid.git
                fetch = +refs/heads/*:refs/remotes/origin/*
        [branch "master"]
                remote = origin
                merge = refs/heads/master
        ******/

        //https://github.com/wdingbox/bible_obj_weid.git
        //https://github.com/wdingbox:passcode@/bible_obj_weid.git
    } /////////

    if (!this.m_inp.usr.repopath) return
    if (!this.m_inp.usr_proj) return
    if (!this.m_inp.usr_proj.git_Usr_Pwd_Url) return

    var git_config_fname = this.get_usr_git_dir("/.git/config")
    if (!fs.existsSync(git_config_fname)) {
        console.log(".git/config not exist:", git_config_fname)
        return
    }



    if (!this.m_git_config_old || !this.m_git_config_new) {
        this.load_git_config()
    }

    if (bAllowPush) {
        fs.writeFileSync(git_config_fname, this.m_git_config_new, "utf8")
        console.log("bAllowPush=1:url =", this.m_inp.usr_proj.git_Usr_Pwd_Url)
    } else {
        fs.writeFileSync(git_config_fname, this.m_git_config_old, "utf8")
        console.log("bAllowPush=0:url =", this.m_inp.usr.repopath)
    }
}

BibleObjGituser.prototype.git_clone = function () {
    //var password = "lll" //dev mac
    var _THIS = this
    var inp = this.m_inp
    var proj = inp.usr_proj;
    if (!proj) {
        inp.out.desc += ", failed inp.usr parse"
        console.log("failed-git-parse", inp.out.desc)
        return inp
    }

    var dir = this.m_rootDir
    if (!fs.existsSync(dir)) {
        console.log("Fatal Error: not exist dir:", dir)
        return null
    }

    inp.out.git_clone_res = { desc: "git-clone", bExist: false }
    var gitdir = this.get_usr_git_dir("/.git")
    if (fs.existsSync(gitdir)) {
        inp.out.git_clone_res.desc += "|already done."
        inp.out.git_clone_res.bExist = true
        console.log("already exist:", gitdir)
        return inp
    }


    var clone_https = inp.usr_proj.git_Usr_Pwd_Url
    if (clone_https.length === 0) {
        clone_https = inp.usr.repopath
    }
    if (clone_https.length === 0) {
        inp.out.git_clone_res.desc += ",no url."
        console.log("clone_https null:", clone_https)
        return inp
    }
    console.log("to clone: ", clone_https)

    //console.log("proj", proj)
    var dir = inp.usr_proj.user_dir
    if (!fs.existsSync(dir)) {
        var ret = BibleUti.execSync_Cmd(`echo 'lll'| sudo -S mkdir -p ${dir}`).toString()
    }
    var ret = BibleUti.execSync_Cmd(`echo 'lll'|  sudo -S chmod -R 777 ${dir}`).toString()

    gitdir = this.get_usr_git_dir()
    if (fs.existsSync(gitdir)) {
        inp.out.git_clone_res.desc += "|git folder exit but no .git"
        inp.out.git_clone_res.bExist = true
        var ret = BibleUti.execSync_Cmd(`echo 'lll'|  sudo -S rm -rf ${gitdir}`).toString()
        console.log(ret)
    }


    var git_clone_cmd = `
    #!/bin/sh
    cd ${this.m_rootDir}
    echo 'lll'|  sudo -S GIT_TERMINAL_PROMPT=0 git clone  ${clone_https}  ${proj.git_root}
    if [ -f "${proj.git_root}/.git/config" ]; then
        echo "${proj.git_root}/.git/config exists."
        echo 'lll'| sudo -S chmod  777 ${proj.git_root}/.git/config
    else 
        echo "${proj.git_root}/.git/config does not exist."
    fi
    `
    console.log("git_clone_cmd...")
    inp.out.git_clone_res.git_clone_cmd = git_clone_cmd
    var ret = BibleUti.execSync_Cmd(git_clone_cmd).toString()
    console.log("ret", ret)
    return inp
}
BibleObjGituser.prototype.git_status = async function (_sb) {
    var inp = this.m_inp
    if (!inp.out.state) return console.log("*** Fatal Error: inp.out.state = null")

    if (undefined === _sb) _sb = ""
    var gitdir = this.get_usr_git_dir("/.git/config")
    if (fs.existsSync(gitdir)) {
        /////// git status
        var git_status_cmd = `
        cd ${this.get_usr_git_dir()}
        git status ${_sb}
        #git diff --ignore-space-at-eol -b -w --ignore-blank-lines --color-words=.`

        inp.out.git_status_res = BibleUti.exec_Cmd(git_status_cmd).toString()
    }
}

BibleObjGituser.prototype.git_add_commit_push_Sync = function (msg) {
    var _THIS = this
    var inp = this.m_inp
    var gitdir = this.get_usr_git_dir()
    if (!fs.existsSync(gitdir)) {
        return console.log("gitdir not exists.");
    }

    //password = "lll" //dev mac
    var command = `
    #!/bin/bash
    set -x #echo on
    echo '=>cd ${gitdir}'
    cd  ${gitdir}
    echo '=>git status'
    echo 'lll'|  sudo -S git status
    echo '=>git diff'
    echo 'lll'|  sudo -S git diff --ignore-space-at-eol -b -w --ignore-blank-lines --color-words=.
    echo '=>git add *'
    echo 'lll'|  sudo -S git add *
    echo '=>git commit'
    echo 'lll'|  sudo -S git commit -m "Sync:${msg}. repodesc:${inp.usr.repodesc}"
    echo '=>git push'
    echo 'lll'|  sudo -S GIT_TERMINAL_PROMPT=0 git push
    echo '=>git status'
    echo 'lll'| sudo -S git status
    echo '=>git status -sb'
    echo 'lll'|  sudo -S git status -sb
    `
    console.log('exec_command:', command)
    console.log('exec_command start:')

    try {
        //e.g. command = "ls"
        _THIS.git_config_allow_push(true)
        exec(command, (err, stdout, stderr) => {
            console.log('\n-exec_Cmd errorr:')
            console.log(err)
            console.log('\n-exec_Cmd stderr:',)
            console.log(stderr)
            console.log('\n-exec_Cmd stdout:')
            console.log(stdout)
            console.log('\n-exec_Cmd end.')
            _THIS.git_config_allow_push(false)
        });
    } catch (err) {
        console.log(err)
    }

    console.log('exec_command END.')
    setTimeout(function () {
        console.log('exec_command ENDED Mark.', gitdir)
    }, 10000)
}

BibleObjGituser.prototype.git_pull = function (cbf) {
    this.git_config_allow_push(true)
    this.m_inp.out.git_pull_res = this.execSync_cmd_git("GIT_TERMINAL_PROMPT=0 git pull")
    this.git_config_allow_push(false)
    //var mat = this.m_inp.out.git_pull_res.stderr.match(/(fatal)|(fail)|(error)/g)
    return this.m_inp.out.git_pull_res
}

BibleObjGituser.prototype.git_push = async function () {
    this.git_config_allow_push(true)
    var ret = this.m_inp.out.git_push_res = this.execSync_cmd_git("git push").toString()
    if (null !== ret) {
        console.log("\n*** test git push:", ret)
        if (ret.match(/failed/i)) {
            ret = null
        }
    }
    this.git_config_allow_push(false)
    return ret
}
BibleObjGituser.prototype.git_push_test = function () {
    var tm = (new Date()).toString()
    console.log("tm=", tm)

    var dir = this.get_usr_git_dir()

    this.git_config_allow_push(true)
    var logname = "test.log"
    var cmd = `
    cd ${dir}
    echo lll | sudo -S  echo '${tm}'> ${logname}
    echo lll | sudo -S  git add ${logname}
    echo lll | sudo -S  git commit -m 'test.log'
    echo lll | sudo -S  git push
    `
    var ret = this.m_inp.out.git_push_res = this.execSync_cmd_git(cmd).toString()
    if (null !== ret) {
        console.log("\n*** test git push:", ret)
        if (ret.match(/failed/i)) {
            ret = null
        }
    }
    this.git_config_allow_push(false)
    return ret
}
BibleObjGituser.prototype.execSync_cmd_git = function (gitcmd) {
    var _THIS = this
    var inp = this.m_inp


    if (!fs.existsSync(this.get_usr_git_dir())) {
        inp.out.desc = "no git dir"
        return null
    }


    //console.log("proj", proj)
    //var password = "lll" //dev mac
    var scmd = `
    #!/bin/sh
    cd ${this.get_usr_git_dir()}
     echo lll |sudo -S ${gitcmd}
    `
    console.log("\n----git_cmd start:>", scmd)
    var res = BibleUti.execSync_Cmd(scmd)
    console.log("\n----git_cmd end.")

    return res
}



module.exports = {
    BibleUti: BibleUti,
    BibleObjGituser: BibleObjGituser
}

