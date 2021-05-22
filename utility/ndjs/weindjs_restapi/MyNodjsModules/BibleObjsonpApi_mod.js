

const fs = require('fs');
const path = require('path');
const { nextTick } = require('process');
var url = require('url');
const fsPromises = require("fs").promises;
const crypto = require('crypto')

//var Uti = require("./Uti.module").Uti;
//var SvcUti = require("./SvcUti.module").SvcUti;
//const exec = require('child_process').exec;

const { BibleObjGituser, BibleUti } = require("./BibleObjGituser_mod")






var inp_struct_base = {
    usr: {
        repopath: "",
        passcode: "",
        repodesc: ""
    },
    par: {
        fnames: [],
        bibOj: { bkc: { chp: { vrs: "" } } }
    }
}
var inp_struct_search = JSON.parse(JSON.stringify(inp_struct_base))
inp_struct_search.par.Search = { File: "", Strn: "" }
var inp_struct_account_setup = JSON.parse(JSON.stringify(inp_struct_base))
inp_struct_account_setup.par = null
var inp_struct_all = JSON.parse(JSON.stringify(inp_struct_base))
inp_struct_all.par.Search = inp_struct_search.par.Search

var ApiJsonp_BibleObj = {
    Jsonpster: function (req, res) {
        ////////////////////////////////////////////
        //app.get("/Jsonpster", (req, res) => {
        console.log("res.req.headers.host=", res.req.headers.host);

        var inp = BibleUti.Parse_GET_req_to_inp(req)
        var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
        var pkb64 = ""
        if (inp && inp.CUID) {
            var kpf = userProject.genKeyPair(inp.CUID)
            if (kpf) {
                pkb64 = kpf.pkb64
            }
        }


        //////////////
        var RestApi = {}
        Object.keys(this).forEach(function (key) {
            RestApi[key] = key; //, inp: ApiJsonp_BibleObj[key]() };
        })
        var jstr_RestApi = `var RestApi = ${JSON.stringify(RestApi, null, 4)}`
        var structall = JSON.stringify(inp_struct_all)
        var SvrUrl = `http://${res.req.headers.host}/`
        console.log("SvrUrl=", SvrUrl)



        var s = `
var Jsonpster = {
    api: "",
    inp: { CUID:null, usr:null, SSID:null, par:null, aux:null},
    SvrUrl: "${SvrUrl}",
    pkb64:"${pkb64}",
getUrl : function(){
    return this.SvrUrl + this.api
},
onBeforeRun : function(){
},
onAfterRun : function(){
},

onSignin : function(){
    this.inp.SSID = null
    if (!this.inp.CUID) return alert("missing CUID.")
    if ('object' != typeof this.inp.usr)return alert("missing usr.")
    if (this.pkb64.length === 0)return alert("no pubkey. Please load page again.")
    
    var usrs = JSON.stringify(this.inp.usr)
    if (usrs.length > 500) {return alert("max 4096-bit rsa: 501B. len="+usrs.length)}

    //alert(this.inp.usr)
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(atob(this.pkb64));
    this.inp.cipherusrs = encrypt.encrypt(usrs);
    this.inp.usr = null

    console.log(this.inp.cipherusrs.length)
    console.log(this.inp)
    console.log("Jsonpster")
    console.log(Jsonpster)
},
onSigned : function(){
    if (this.inp.SSID === null) return alert("lost inp.SSID")
    //if (!this.inp.par) return alert("miissing inp.par="+this.inp.par)
    if (this.inp.usr !== null) return alert("forbidden inp.usr")
},

RunAjaxPost_Signed : function(cbf){
    this.onSigned()
    this.RunAjax_PostTxt (cbf)
},
RunAjaxPost_Signin : function (cbf) {
    this.onSignin()
    this.RunAjax_PostTxt (cbf)
},
RunAjax_PostTxt : function(cbf){
    this.onBeforeRun()
    if (!this.api) return alert("ErrApi="+this.api)
    var surl = this.getUrl()
    this.inp.api = this.api
    $.ajax({
        type: "POST",
        dataType: 'text',
        contentType: "application/json; charset=utf-8",
        url: surl,
        data: JSON.stringify(this.inp),
        username: 'user',
        password: 'pass',
        crossDomain : true,
        xhrFields: {
            withCredentials: false
        }
    })
        .success(function( data ) {
            //console.log("success",data);
            //cbf(JSON.parse(data))
        })
        .done(function( data ) {
            var ret = JSON.parse(data)
            Jsonpster.onAfterRun(ret)
            cbf (ret)
            Jsonpster.api = Jsonpster.inp.par = Jsonpster.inp.usr = null;
        })
        .fail( function(xhr, textStatus, errorThrown) {
            console.log("surl",surl)
            alert("xhr.responseText="+xhr.responseText+",textStatus="+textStatus);
            //alert("textStatus="+textStatus);
        });
},
};
${jstr_RestApi}
`;;;;;;;;;;;;;;

        console.log(s);
        res.send(s);
        res.end();
        //});
    },
    ApiBibleObj_search_txt: function (req, res) {
        //if (!req || !res) {
        //    return inp_struct_search
        //}
        //var inp = BibleUti.Parse_GET_req_to_inp(req)
        BibleUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
            //if (!inp.usr.f_path) inp.usr.f_path = ""
            var proj = userProject.proj_parse_usr_signed(inp)
            if (!proj) return console.log("proj_parse_usr_signed failed.")
            var stat = userProject.run_proj_setup()
            var TbcvObj = {};
            if (proj && "object" === typeof inp.par.fnames) {//['NIV','ESV']
                for (var i = 0; i < inp.par.fnames.length; i++) {
                    var trn = inp.par.fnames[i];
                    var jsfname = userProject.get_pfxname(trn)
                    console.log("jsfname:", jsfname)
                    var bib = BibleUti.loadObj_by_fname(jsfname);
                    if (!bib.obj) continue
                    var bcObj = BibleUti.copy_biobj(bib.obj, inp.par.bibOj);
                    TbcvObj[trn] = bcObj;
                    inp.out.desc += ":" + trn
                }
            }
            var bcvT = {}
            BibleUti.convert_Tbcv_2_bcvT(TbcvObj, bcvT)
            inp.out.data = BibleUti.search_str_in_bcvT(bcvT, inp.par.Search.File, inp.par.Search.Strn);

            inp.out.desc += ":success."
            userProject.run_proj_state()
        })
        // var sret = JSON.stringify(inp);
        // var sid = ""
        // 
        // res.writeHead(200, { 'Content-Type': 'text/javascript' });
        // res.write(`Jsonpster.Response(${sret},${sid});`);
        // res.end();
    },

    ApiBibleObj_load_by_bibOj: function (req, res) {

        BibleUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
            var proj = userProject.proj_parse_usr_signed(inp)
            if (!proj) return console.log("proj_parse_usr_signed failed.")
            var stat = userProject.run_proj_setup()
            if (!stat || stat.out.state.bEditable !== 1) {
                console.log("proj_setup failed.", stat)
                return inp;
            }


            if (!stat.out.state || stat.out.state.bMyojDir <= 0) {
                console.log("-----:bMyojDir<=0. dir not exist")
            } else {
                console.log("-----:bMyojDir>0", inp.par.fnames, typeof inp.par.fnames)
                console.log("-----:binp.par.bibOj", inp.par.bibOj)
                var TbcObj = {};
                if (proj && "object" === typeof inp.par.fnames && inp.par.bibOj) {//['NIV','ESV']
                    console.log("inp.par.fnames:", inp.par.fnames)
                    for (var i = 0; i < inp.par.fnames.length; i++) {
                        var trn = inp.par.fnames[i];
                        var jsfname = userProject.get_pfxname(trn)
                        console.log("load:", jsfname)
                        var bib = BibleUti.loadObj_by_fname(jsfname);
                        if (!bib.obj) {
                            inp.out.desc += ":noexist:" + trn
                            console.log("not exist..............", jsfname)
                            continue
                        }
                        var bcObj = BibleUti.copy_biobj(bib.obj, inp.par.bibOj);
                        TbcObj[trn] = bcObj;
                        inp.out.desc += ":" + trn
                    }
                    inp.out.desc += ":success"
                }
                //console.log(TbcObj)
                var bcvT = {}
                BibleUti.convert_Tbcv_2_bcvT(TbcObj, bcvT)
                inp.out.data = bcvT
                //console.log(bcvT)
            }
            userProject.run_proj_state()
        })
    },

    ApiBibleObj_write_Usr_BkcChpVrs_txt: async function (req, res) {
        if (!req || !res) {
            return inp_struct_base
        }
        BibleUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            //: unlimited write size. 
            var save_res = { desc: "to save" }
            var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
            var proj = userProject.proj_parse_usr_signed(inp)
            if (!proj) return console.log("proj_parse_usr_signed failed.")

            var stat = userProject.run_proj_setup()
            if (!stat || stat.out.state.bEditable !== 1) return console.log("proj_setup failed.", stat)



            //if ("object" === typeof inp.par.fnames) {//['NIV','ESV']
            var doc = inp.par.fnames[0]
            var jsfname = userProject.get_pfxname(doc)
            var bio = BibleUti.loadObj_by_fname(jsfname);
            if (!bio.obj) {
                save_res.desc = `load(${doc},${jsfname})=null`
                return;
            }

            var karyObj = BibleUti.inpObj_to_karyObj(inp.par.inpObj)
            if (karyObj.kary.length !== 4) {
                save_res.desc = `err inpObj: ${JSON.stringify(karyObj)}`
                return
            }
            console.log(karyObj)
            var pChp = bio.obj[karyObj.bkc][karyObj.chp];//[karyObj.vrs]
            if (!pChp[karyObj.vrs]) {
                pChp[karyObj.vrs] = ""
            }

            var dlt = karyObj.txt.length - pChp[karyObj.vrs].length
            if (pChp[karyObj.vrs] === karyObj.txt) {
                console.log("Not to save: the new txt is same as original txt-----.")
            } else {
                console.log("Save: new txt differs original txt-----.dlt=", dlt)
                pChp[karyObj.vrs] = karyObj.txt
                bio.writeback()
            }

            ////
            var tagName = `${doc}~${karyObj.bkc}${karyObj.chp}:${karyObj.vrs}`
            var save_res = {}
            save_res.saved_size = "" + karyObj.txt.length + ",dlt:" + dlt
            save_res.len = karyObj.txt.length
            save_res.dlt = dlt
            save_res.desc = `${tagName} saved.`
            inp.out.save_res = save_res

            userProject.git_add_commit_push_Sync(save_res.desc);//after saved
        })

        //res.writeHead(200, { 'Content-Type': 'text/javascript' });
        //res.write(`Jsonpster.Response(${sret},${sid});`);
        //res.end();
    },

    /////
    ApiBibleObj_read_crossnetwork_BkcChpVrs_txt: function (req, res) {
        // if (!req || !res) {
        //     return inp_struct_base
        // }
        // var inp = BibleUti.Parse_GET_req_to_inp(req)
        BibleUti.Parse_POST_req_to_inp(req, res, async function (inp) {

            var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
            var proj = userProject.proj_parse_usr_signed(inp)
            if (!proj) return console.log("proj_parse_usr_signed failed.")

            console.log(inp.aux)
            if (!inp.aux) {
                console.log("no inp.aux.")
            }
            if (!inp.aux.Search_repodesc) {
                console.log("no Search_repodesc.")
            }
            var shareID = inp.aux.Search_repodesc
            var inpObj = inp.par.inpObj

            var doc = inp.par.fnames[0]
            //var docname = userProject.get_DocCode_Fname(doc)
            var docpathfilname = userProject.get_pfxname(doc)
            var outfil = userProject.m_SvrUsrsBCV.gen_crossnet_files_of(docpathfilname)
            //var docpathfilname = userProject.get_usr_myoj_dir("/" + docname)

            //////----
            function __load_to_obj(outObj, jsfname, owner, shareID, inpObj,) {
                //'../../../../bible_study_notes/usrs/bsnp21/pub_wd01/account/myoj/myNote_json.js': 735213,
                var bio = BibleUti.loadObj_by_fname(jsfname);
                var karyObj = BibleUti.inpObj_to_karyObj(inpObj)
                if (karyObj.kary.length < 3) {
                    console.log("error",)
                }
                if (proj && bio.obj && karyObj.kary.length >= 3) {
                    var tms = (new Date(bio.stat.mtime)).toISOString().substr(0, 10)
                    var usr_repo = `${owner}#${shareID}@${tms}`
                    outObj[usr_repo] = bio.obj[karyObj.bkc][karyObj.chp][karyObj.vrs]
                } else {
                }
            }


            /////--------------
            var retObj = {}
            var owner = userProject.session_get_github_owner(docpathfilname)
            __load_to_obj(retObj, docpathfilname, owner, inp.usr.repodesc, inpObj)
            //console.log("jspfn:", jsfname)
            console.log("dcpfn:", docpathfilname)

            for (var i = 0; i < outfil.m_olis.length; i++) {
                var jspfn = outfil.m_olis[i]
                if (docpathfilname === jspfn) continue;
                console.log("*docfname=", jspfn)
                var others = userProject.session_git_repodesc_load(jspfn)
                if (!others) continue
                if ("*" === shareID) {//no restriction
                    var owner = userProject.session_get_github_owner(jspfn)
                    __load_to_obj(retObj, jspfn, owner, others.repodesc, inpObj)
                    continue
                }
                console.log("*repodesc=", others.repodesc, shareID)
                if (others.repodesc === shareID) {
                    var owner = userProject.session_get_github_owner(jspfn)
                    __load_to_obj(retObj, jspfn, owner, others.repodesc, inpObj)
                }
            }

            inp.out.repodesc = shareID
            inp.out.data = retObj
        })



        // var sret = JSON.stringify(inp)
        // var sid = ""
        // res.writeHead(200, { 'Content-Type': 'text/javascript' });
        // res.write(`Jsonpster.Response(${sret},${sid});`);
        // res.end();
    },


    ///////////////////////////////////
    ApiUsrDat_save: async function (req, res) {
        if (!req || !res) {
            return inp_struct_base
        }
        BibleUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            //: unlimited write size. 
            var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
            var proj = userProject.proj_parse_usr_signed(inp)
            if (!proj) return console.log("proj_parse_usr_signed failed.")

            var stat = userProject.run_proj_setup()
            if (!stat || stat.out.state.bEditable !== 1) return console.log("proj_setup failed.", stat)


            //if ("object" === typeof inp.par.fnames) {//['NIV','ESV']
            var doc = inp.par.fnames[0]
            var jsfname = userProject.get_pfxname(doc)
            console.log("jsfname=", jsfname)
            var ret = BibleUti.loadObj_by_fname(jsfname)
            if (!ret.obj) return console.log("failed:=", jsfname)
            try {
                ret.obj = JSON.parse(inp.par.data, null, 4)
                console.log("ret", ret)
                ret.writeback()
            } catch (err) {
                console.log("err", err)
                inp.out.state.err = err
            }

            //// 
            var save_res = {}
            save_res.desc = "len:" + inp.par.data.length + ",dlt:" + ret.dlt_size
            save_res.dlt = ret.dlt_size
            save_res.len = inp.par.data.length
            inp.par.data = ""
            //save_res.ret = ret
            inp.out.save_res = save_res
            var msg = jsfname + " saved."

            //
            userProject.git_add_commit_push_Sync(save_res.desc);//after saved
        })
    },
    ApiUsrDat_load: async function (req, res) {
        //var inp = BibleUti.Parse_GET_req_to_inp(req)
        BibleUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
            var proj = userProject.proj_parse_usr_signed(inp)
            if (!proj) return console.log("proj_parse_usr_signed failed.")

            if (proj) {

                userProject.run_proj_setup()

                var retp = userProject.run_proj_state()
                if (0) {
                    await userProject.git_pull(function (bSuccess) {

                    })
                }

                //inp = BibleUti.Write2vrs_txt(inp, false)
                var doc = inp.par.fnames[0]
                var jsfname = userProject.get_pfxname(doc)
                var ret = BibleUti.loadObj_by_fname(jsfname)
                inp.out.data = ret.obj
                if (!inp.out.state) inp.out.state.bEditable = 1
            }
        })

        //var sret = JSON.stringify(inp)
        //var sid = ""
        //res.writeHead(200, { 'Content-Type': 'text/javascript' });
        //res.write(`Jsonpster.Response(${sret},${sid});`);
        //res.end();
    },







    ///////////////////////////////////


    ________ApiUsrReposData_create___test_only: async function (req, res) {
        console.log("ApiUsrReposData_create")
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = BibleUti.Parse_GET_req_to_inp(req)
        var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
        var ret = userProject.proj_parse_usr_signin(inp)
        if (ret) {
            userProject.run_proj_setup()

            if (inp.out.state.bEditable === 1) {
                inp.out.state.SSID = userProject.session_create()
            }
        }

        var sret = JSON.stringify(inp, null, 4)
        var sid = ""

        console.log("oup is ", inp.out)

        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(`Jsonpster.Response(${sret},${sid});`);
        res.end();
    },
    UsrReposPost_Signin: function (req, res) {
        console.log("UsrReposPost_Signin")
        if (!req || !res) {
            return inp_struct_account_setup
        }
        BibleUti.Parse_POST_req_to_inp(req, res, function (inp) {
            //: unlimited write size. 
            var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
            var proj = userProject.proj_parse_usr_signin(inp)
            if (!proj) return console.log("proj_parse_usr_signin failed.")

            userProject.run_proj_setup()
            if (inp.out.state.bEditable === 1) {
                if (null === userProject.git_push_test()) {
                    //inp.out.state.bEditable =  inp.out.state.bRepositable = 0
                    userProject.run_proj_destroy()
                }else{
                    inp.out.state.SSID = userProject.session_create()
                }
            }
        })
    },

    ApiUsrReposData_destroy: async function (req, res) {
        // if (!req || !res) {
        //     return inp_struct_account_setup
        // }
        // var inp = BibleUti.Parse_GET_req_to_inp(req)
        BibleUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
            var proj = userProject.proj_parse_usr_signed(inp)
            if (!proj) return console.log("proj_parse_usr_signed failed.")

            userProject.run_proj_state()
            if (0 === inp.out.state.bRepositable) {
                //case push failed. Don't delete
                console.log("git dir not exit.")

            } else {
                var res2 = userProject.execSync_cmd_git("git add *")
                var res3 = userProject.execSync_cmd_git(`git commit -m "before del. repodesc:${inp.usr.repodesc}"`)
                var res4 = userProject.git_push()

                var res5 = userProject.run_proj_destroy()
            }

            userProject.run_proj_state()
        })

        // var sret = JSON.stringify(inp, null, 4)
        // var sid = ""
        // 
        // console.log("oup is ", inp.out)
        // res.writeHead(200, { 'Content-Type': 'text/javascript' });
        // res.write(`Jsonpster.Response(${sret},${sid});`);
        // res.end();
    },

    ApiUsrReposData_status: function (req, res) {
        //if (!req || !res) {
        //    return inp_struct_account_setup
        //}
        //var inp = BibleUti.Parse_GET_req_to_inp(req)
        BibleUti.Parse_POST_req_to_inp(req, res, function (inp) {

            var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
            var proj = userProject.proj_parse_usr_signed(inp)
            if (!proj) return console.log("proj_parse_usr_signed failed.")

            var ret = userProject.run_proj_state()
            var res2 = userProject.execSync_cmd_git("git status -sb")
            if (res2 && res2.stdout) {
                inp.out.state.git_status_sb = res2.stdout
                inp.out.state.is_git_behind = res2.stdout.indexOf("behind")
            }
            userProject.run_proj_state()
        })

        // var sret = JSON.stringify(inp, null, 4)
        // var sid = ""
        // 
        // console.log("oup is ", inp.out)
        // res.writeHead(200, { 'Content-Type': 'text/javascript' });
        // res.write(`Jsonpster.Response(${sret},${sid});`);
        // res.end();
    },


    ApiUsrReposData_git_push: async function (req, res) {
        // if (!req || !res) {
        //     return inp_struct_account_setup
        // }
        // var inp = BibleUti.Parse_GET_req_to_inp(req)
        BibleUti.Parse_POST_req_to_inp(req, res, async function (inp) {

            var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
            var proj = userProject.proj_parse_usr_signed(inp)
            if (!proj) return console.log("proj_parse_usr_signed failed.")

            userProject.run_proj_setup()
            //await userProject.git_add_commit_push("push hard.", "");//real push hard.

            var res2 = userProject.execSync_cmd_git("git add *")
            var res3 = userProject.execSync_cmd_git(`git commit -m "svr-push. repodesc:${inp.usr.repodesc}"`)
            var res4 = userProject.git_push()

            userProject.run_proj_state()
        })
        //var sret = JSON.stringify(inp, null, 4)
        //var sid = ""

        //console.log("oup is ", inp.out)
        //res.writeHead(200, { 'Content-Type': 'text/javascript' });
        //res.write(`Jsonpster.Response(${sret},${sid});`);
        //res.end();
    },

    ApiUsrReposData_git_pull: async function (req, res) {
        // if (!req || !res) {
        //     return inp_struct_account_setup
        // }
        // var inp = BibleUti.Parse_GET_req_to_inp(req)
        BibleUti.Parse_POST_req_to_inp(req, res, async function (inp) {

            var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
            var proj = userProject.proj_parse_usr_signed(inp)
            if (!proj) return console.log("proj_parse_usr_signed failed.")

            userProject.run_proj_setup()
            userProject.git_pull();
            userProject.run_proj_state()

        })
        //var sret = JSON.stringify(inp, null, 4)
        //var sid = ""
        //
        //console.log("oup is ", inp.out)
        //res.writeHead(200, { 'Content-Type': 'text/javascript' });
        //res.write(`Jsonpster.Response(${sret},${sid});`);
        //res.end();
    },

    ApiUsr_Cmdline_Exec: async function (req, res) {
        // if (!req || !res) {
        //     return inp_struct_account_setup
        // }
        // var inp = BibleUti.Parse_GET_req_to_inp(req)
        BibleUti.Parse_POST_req_to_inp(req, res, async function (inp) {
            var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
            var proj = userProject.proj_parse_usr_signed(inp)
            if (!proj) return console.log("proj_parse_usr_signed failed.")

            var ret = userProject.run_proj_state()
            var rso = userProject.execSync_cmd_git()
            console.log("\n\n*cmd-res", rso)
            userProject.run_proj_state()
        })

        // var sret = JSON.stringify(inp, null, 4)
        // var sid = ""
        // console.log("oup is ", inp.out)
        // res.writeHead(200, { 'Content-Type': 'text/javascript' });
        // res.write(`Jsonpster.Response(${sret},${sid});`);
        // res.end();
    },


}//// BibleRestApi ////

var BibleObjJsonpApi = {
    set_postHeader: function (res) {
        // for cross domain post.

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
    },
    init: function (app, rootDir) {
        BibleObjJsonpApi.m_rootDir = rootDir
        BibleUti.WorkingRootDir(rootDir)
        BibleUti.Update_SvrIP_in_HomeSitePage()
        //
        Object.keys(ApiJsonp_BibleObj).forEach(function (sapi) {
            console.log("api:", sapi)
            app.use("/" + sapi, function (req, res) {
                BibleObjJsonpApi.set_postHeader(res)

                ApiJsonp_BibleObj[sapi](req, res);
            })
        });
        return;
    }
}




module.exports = {
    BibleObjJsonpApi: BibleObjJsonpApi
}

