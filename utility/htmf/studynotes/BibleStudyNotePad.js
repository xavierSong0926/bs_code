



var MyStorage = {
    init: function (cbf) {
        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            localStorage.setItem("test", [1, 2])
            var ar = localStorage.getItem("test")
            console.log("Storage test: ", ar)
        } else {
            // Sorry! No Web Storage support..
            alert("Sorry, your browser does not support Web Storage...")
        }



        ////////////////////////////////
        //
        setTimeout(() => {
            Uti.Msg("start ...", "" + window.location.href);
            if ("undefined" === typeof Jsonpster) {
                alert("Jsonpster server down.");
            }
            Uti.Msg("RestApi=", RestApi);
            Uti.Msg(Jsonpster.Url());
            MyStorage.Repositories().repos_app_init()
            MyStorage.Repo_load(function (ret) {
                if (cbf) cbf(ret)
            })
        }, 3000)

    },
    Repo_save: function (cbf) {
        var txt = JSON.stringify(localStorage, null, 4)
        console.log(txt)
        Jsonpster.inp.usr = MyStorage.Repositories().repos_app_update()
        if (!Jsonpster.inp.usr) return alert("user is not set yet.")
        Jsonpster.inp.par = { fnames: ["./dat/localStorage"], data: txt }
        Jsonpster.api = RestApi.ApiUsrDat_save.str
        Uti.Msg("Repo_save:", Jsonpster)
        Jsonpster.RunAjaxPost(function (ret) {
            cbf(ret)
        })
    },
    Repo_load: function (cbf) {
        Jsonpster.inp.usr = MyStorage.Repositories().repos_app_update()
        if (!Jsonpster.inp.usr || !Jsonpster.inp.usr.repopath) return alert("inp.usr is not set yet.")
        var txt = JSON.stringify(localStorage, null, 4)
        console.log(txt)
        Jsonpster.inp.par = { fnames: ["./dat/localStorage"] }
        Jsonpster.api = RestApi.ApiUsrDat_load.str
        Jsonpster.Run(function (ret) {
            if (cbf) cbf(ret)
        })
    },

    Repositories: function () {
        function StoreRepositorie() {
            this.m_storeid = "repositories"
        }

        StoreRepositorie.prototype.repos_store_get = function () {
            var ar = localStorage.getItem(this.m_storeid);
            if (!ar || ar.length === 0) {
                ar = [{ repopath: "https://github.com/wdingbox/biblestudynote_pub_test.git", passcode: "" }]
            } else {
                ar = JSON.parse(ar)
            }
            return ar
        }
        StoreRepositorie.prototype.repos_store_set = function (obj) {
            var ar = this.repos_store_get()
            if (!obj.repopath) {
                return ar;
            }
            for (var i = 0; i < ar.length; i++) {
                if (obj.repopath === ar[i].repopath) {
                    ar.splice(i, 1) //:remove it.
                }
            }
            ar.unshift(obj) //addto head.
            //Uti.Msg("Repository:set=", ar)
            var str = JSON.stringify(ar)
            localStorage.setItem(this.m_storeid, str)
            return ar
        }
        StoreRepositorie.prototype.repos_store_del = function (obj) {
            var ar = this.repos_store_get()
            for (var i = 0; i < ar.length; i++) {
                if (ar[i].repopath === obj.repopath) {
                    ar.splice(i, 1)
                }
            }
            var str = JSON.stringify(ar)
            localStorage.setItem(this.m_storeid, str)
        }

        StoreRepositorie.prototype.repos_app_set = function (obj) {
            $("#repopath").val(obj.repopath)
            $("#passcode").val(obj.passcode)
            $("#repodesc").val(obj.repodesc)
            Object.assign(Jsonpster.inp.usr, obj)
            var ar = this.repos_store_set(obj)
            return ar
        }
        StoreRepositorie.prototype.repos_app_update = function () {
            var obj = { repopath: $("#repopath").val(), passcode: $("#passcode").val(), repodesc: $("#repodesc").val() }
            var ar = this.repos_app_set(obj)
            return ar[0]
        }
        StoreRepositorie.prototype.repos_app_init = function () {
            var ar = this.repos_store_get()
            this.repos_app_set(ar[0])
            return ar
        }


        var storeRepo = new StoreRepositorie()
        return storeRepo
    },



    MostRecentAryInStore: function (sid) {
        var MostRecentAry = function (sid) {
            this.m_sid = sid
        }
        MostRecentAry.prototype.get_ary = function () {
            var ar = localStorage.getItem(this.m_sid)
            if (!ar || ar.length === 0) {
                ar = []
            } else {
                ar = JSON.parse(ar)
            }
            return ar
        }
        MostRecentAry.prototype.cleanup = function () {
            var ar = localStorage.setItem(this.m_sid, "")
        }
        MostRecentAry.prototype.set_ary = function (ary) {
            var s = ""
            if (ary && ary.length > 0) {
                s = JSON.stringify(ary)
            }
            var ar = localStorage.setItem(this.m_sid, s)
        }
        MostRecentAry.prototype.addonTop = function (strn) {
            if (!strn) return
            var ar = this.get_ary()
            Uti.addonTopOfAry(ar, strn)
            if (!ar) {
            } else {
                localStorage.setItem(this.m_sid, JSON.stringify(ar))
            }
            return ar;
        }
        return new MostRecentAry(sid)
    },
    ////--------
    addMostRecentSearchStrn: function (strn) {
        var ret = MyStorage.MostRecentAryInStore("MostRecentSearchStrn")
        ret.addonTop(strn)
    },
    setMostRecentSearchStrn: function (ar) {
        var ret = MyStorage.MostRecentAryInStore("MostRecentSearchStrn")
        ret.set_ary(ar)
    },
    getMostRecentSearchStrn: function () {
        var ret = MyStorage.MostRecentAryInStore("MostRecentSearchStrn")
        return ret.get_ary()
    },





    clear: function () {
        localStorage.clear();
    },

    setSelectedDocsList: function (arr) {
        localStorage.setItem("SelectedDocsList", arr)
    },
    getSelectedDocsList: function () {
        var ar = localStorage.getItem("SelectedDocsList");
        if (!ar || ar.length === 0) {
            ar = ["NIV", "_myNote"]
        } else {
            ar = ar.split(",")
        }
        return ar
    },





    setMostRecentSearchFile: function (str) {
        if (!str) {
            localStorage.setItem("MostRecentSearchFile", "")
        } else {
            localStorage.setItem("MostRecentSearchFile", str)
            $("#Tab_regex_history_lst").find("caption").text(str)
        }
    },
    getMostRecentSearchFile: function () {
        var ar = localStorage.getItem("MostRecentSearchFile")
        if (!ar || ar.length === 0) {
            ar = "NIV"
        }
        return ar
    },
    ////-----


    setFontSize: function (v) {
        if (parseInt(v) < 6) v = 6
        localStorage.setItem("FontSize", v)
    },
    getFontSize: function () {
        var v = parseInt(localStorage.getItem("FontSize"));
        if (!v || !Number.isInteger(v) || v.length === 0) return 16
        return (v < 6) ? 6 : v
    },


    setCustomCatAry: function (obj) {
        if (!obj) {
            localStorage.setItem("CustomCatAry", "")
        } else {
            localStorage.setItem("CustomCatAry", JSON.stringify(obj))
        }
        CNST.Cat2VolArr.Custom = obj
    },
    getCustomCatAry: function () {
        var ar = localStorage.getItem("CustomCatAry")
        if (!ar || ar.length === 0) {
            ar = []
        } else {
            ar = JSON.parse(ar)
        }
        CNST.Cat2VolArr.Custom = ar
        return ar
    },

    onChange_BookNameLanguage: function () {
        var v = $("#LanguageSel").val()
        Uti.Msg(v)
        localStorage.setItem("BookNameLanguage", v)
    },
    getBookNameLanguage: function () {
        var v = localStorage.getItem("BookNameLanguage")
        $("#LanguageSel").val(v)
        return v
    },
}











function PopupMenu_BcvTag() {
    this.m_id = "#divPopupMenu_BcvTag"
}
PopupMenu_BcvTag.prototype.init_links = function () {
    var Ext_Link_Menu = {
        HiliEx: function (_this) {
            $(".hiliExt").removeClass("hiliExt")
            $(_this).parent().addClass("hiliExt")

            var sbcv = $(".bcvTag.bcvMark").text();
            var ret = Uti.parse_bcv(sbcv, "");
            if (!ret) return alert("ERR: bcvid=" + sbcv)
            var url = $(_this).attr("ref");
            ret.url = url;
            ret.set_href = function (str) {
                var file = this.url + str
                console.log(file);
                $(_this).attr("href", file);
            }
            ret.isNT = function () {
                return CNST.isNT(this.vol)
            }
            return ret
        },
    }

    $("#blb").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)

        var blbvol = CNST.BlueLetterBibleCode[ret.vol];
        ret.set_href(blbvol + "/" + ret.chp + "/" + ret.vrs);
    });
    $("#qbible_com").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)

        //greek-new-testament/1-Thessalonians/1.html#1

        var ont = "hebrew-old-testament"
        if (ret.isNT()) {
            ont = "greek-new-testament"
        }

        var bkc = ret.vol;
        var bkname = CNST.BiBookName[ret.vol][0];
        bkname = bkname.replace(/_/g, "-")
        ret.set_href(`${ont}/${bkname}/${ret.chp}.html#${ret.vrs}`);

    });
    $("#h_g").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)

        var volm = ret._vol;
        var bkidx = CNST.BookID2IdxCode[volm];
        ret.set_href(bkidx[0] + volm + "_" + ret.chp3 + ".htm#" + ret.vrs);

    });
    $("#gtw").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)

        var vol2 = CNST.BiBookName[ret.vol][0];
        ret.set_href(vol2 + ret.chp + ":" + ret.vrs + "&version=NIV;CUV;KJV;NKJV;ESV");
    });
    $("#studylight").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)

        //https://www.studylight.org/commentary/john/1-1.html
        var vol2 = CNST.BibVolName_Studylight([ret.vol]);
        ret.set_href(vol2 + "/" + ret.chp + "-" + ret.vrs + ".html");
    });

    $("#ccel_org").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)

        //http://www.ccel.org/study/1_Samuel%202:11-4:18 
        var bok = CNST.BibVolName_ccel([ret.vol]);
        ret.set_href(bok + " " + ret.chp + ":" + ret.vrs + ".html");
    });

    $("#crossReference").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)

        //http://www.ccel.org/study/1_Samuel%202:11-4:18 
        var bok = CNST.BlueLetterBibleCode[ret.vol];
        ret.set_href(bok + " " + ret.chp + ":" + ret.vrs + "");

    });

    $("#BibleInput").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)
        ret.set_href(ret.vol + ret.chp + ":" + ret.vrs);
    });

    var _THIS = this
    $("#Cluster_Documents").click(function () {
        var ret = Ext_Link_Menu.HiliEx(this)
        var trID = `tr_${ret.vol}_${ret.chp}_${ret.vrs}`

        var tags = []
        $(_THIS.m_par.m_clickedLabel).parent().parent().attr("id", trID)
        $(_THIS.m_par.m_clickedLabel).parentsUntil("tr").find("sup.popupclicklabel").each(function () {
            var tx = $(this).text()
            tags.push(tx)
        });
        Uti.Msg("trID=", trID, tags)
        _THIS.m_par.BCVtagClusterInfo = { tags: tags, trID: trID, bcvOj: ret.bcvObj }
        _THIS.m_par.m_tab_documentsClusterList.Gen_table_for_bcvTag(_THIS.m_par)
        _THIS.m_par.m_groupsMenuMgr.sel_default("Cluster")
    });
}
PopupMenu_BcvTag.prototype.init = function () {
    this.init_links()
}

PopupMenu_BcvTag.prototype.init_popup = function (bcr) {
    this.m_par = bcr
    //this.m_par.m_clickedLabel
    // if (bcr.m_alreadyHili) {
    //     $(this.m_id).slideToggle();
    // } else {
    $(this.m_id).show();
    // }

    //$(this.m_id).css('top', bcr.m_y);
    //$("#divPopupMenu_BcvTag").toggle("'slide', {direction: 'up' }, 1000");//()
    //$(this.m_id).find("caption").text(bcr.m_bcv).focus()
}


function PopupMenu_EdiTag() {
    this.m_id = "#divPopupMenu_EdiTag"
    this.m_par = null
}
PopupMenu_EdiTag.prototype.init_popup = function (par) {
    this.m_par = par

    $("#RevTag_Info").text(Jsonpster.inp.usr["repopath"])

    this.m_ediDiv.setId_Txt(par.m_txuid, par.m_rev, par.m_outxtObj)
    this.m_ediBtn.init_associate(this.m_ediDiv)
    var bEdit = this.m_ediDiv.isEditable()



    this.m_ediBtn.enable_edit(bEdit, false)


    var ids = "#RevTag_Save, #RevTag_Load, #RevTag_Edit_External, #RevTag_Edit_Local"
    par.m_showHideVTxt.set_vtxID(this.m_par.m_txuid, function (bHide, sLab) {
        if (bHide) {
            $(ids).parent().hide()
        } else {
            $(ids).parent().show()
            if (bEdit) {
                $("#RevTag_Save").parent().show()
                $("#RevTag_Load").parent().hide()
            } else {
                $("#RevTag_Save").parent().hide()
                $("#RevTag_Load").parent().show()
            }
        }
    })

    $(this.m_id).show()
}
PopupMenu_EdiTag.prototype.toggle_ShowHideTxt = function (txID) {
    // _THIS.m_par.m_txuid 
    var bshowTxt = $("#" + txID)[0].classList.contains("showTxt")

    if (bshowTxt) {
        return "Show"
    } else {
        return "Hide";
    }
}
PopupMenu_EdiTag.prototype.init = function () {
    var _THIS = this



    function DivEditTxt() {
        this.m_id = null
        this.m_edi_enabled = false
    }
    DivEditTxt.prototype.setId_Txt = function (id, rev, ouTxtObj) {
        this.m_id = "#" + id
        this.m_rev = rev
        this.m_otxObj = ouTxtObj
    }
    DivEditTxt.prototype.html = function (htm) {
        if (undefined === htm) {
            return $(this.m_id).html()
        }
        return $(this.m_id).html(htm)
    }
    DivEditTxt.prototype.getEditHtm = function () {
        var edx = ""
        if (this.isEditable()) {
            edx = this.html()
        } else {
            //Uti.Msg("uneditable text")
            edx = this.m_otxObj[this.m_rev]
        }
        edx = Uti.htmlDecode(edx.trim())
        edx = edx.replace(/[\n\r\t]/g, '')
        return edx
    }
    DivEditTxt.prototype.setEditHtm = function (txt) {
        var edx = Uti.htmlDecode(txt.trim())
        edx = edx.replace(/[\n\r\t]/g, '')
        this.m_otxObj[this.m_rev] = edx
        return edx
    }
    DivEditTxt.prototype.enableEdit = function (bEnable) {
        if (!this.m_id) return alert("enableEdit er")

        if (bEnable) {
            $(this.m_id).attr("contenteditable", "true")
            var showTxt = this.m_otxObj[this.m_rev]
            if (!showTxt) {
                showTxt = "<ol><li>a</li></ol>"
            }
            showTxt = Uti.convert_std_bcv_in_text_To_unlinked(showTxt)
            $(this.m_id).html(showTxt)
        } else {
            $(this.m_id).attr("contenteditable", null)
            var showTxt = $(this.m_id).html() //storeIt
            var showTxt = Uti.convert_std_bcv_in_text_To_unlinked(showTxt)
            showTxt = Uti.htmlDecode(showTxt.trim())
            showTxt = showTxt.replace(/[\n\r\t]/g, '')
            this.m_otxObj[this.m_rev] = showTxt;//$(this.m_id).html() //storeIt

            var htmShow = Uti.convert_std_bcv_in_text_To_linked(showTxt)
            if (!htmShow) {
                htmShow = "<ol><li>z</li></ol>"
            }
            $(this.m_id).html(htmShow)
        }
    }

    DivEditTxt.prototype.isEditable = function () {
        return !!$(this.m_id).attr("contenteditable")
    }


    function EditBtn(id) {
        this.m_elm = $(id)
        this.m_edi_enabled = false

    }
    EditBtn.prototype.init_associate = function (edidiv) {
        this.m_ediDiv = edidiv
    }

    EditBtn.prototype.enable_edit = function (bEnable, bBubleEvt) {
        this.m_edi_enabled = bEnable
        if (bEnable) {
            $(this.m_elm).text("Disable Edit")
        } else {
            $(this.m_elm).text("Enable Edit")
        }
        if (!bBubleEvt) return
        this.m_ediDiv.enableEdit(bEnable)
    }
    EditBtn.prototype.toggle_enableEdit = function () {
        this.m_edi_enabled = !this.m_edi_enabled
        this.enable_edit(this.m_edi_enabled, true)
    }
    this.m_ediBtn = new EditBtn("#RevTag_Edit_Local")
    this.m_ediDiv = new DivEditTxt()

    function _set_par_ediTxt() {
        var htmEdit = _THIS.m_ediDiv.getEditHtm()
        //if (htmEdit.length >= 2000) alert(`lengh=${htmEdit.length} > max 2000.`)
        var ret = Uti.parse_bcv(_THIS.m_par.m_bcv, htmEdit)

        var pster = JSON.parse(JSON.stringify(Jsonpster))
        pster.inp.par = { fnames: [_THIS.m_par.m_rev], inpObj: ret.bcvObj }
        pster.api = RestApi.ApiBibleObj_write_Usr_BkcChpVrs_txt.str
        localStorage.setItem("myNote", JSON.stringify(pster))
        return pster.inp.par
    }

    $("#RevTag_Edit_Local").bind("click", function () {
        _THIS.m_ediBtn.toggle_enableEdit()
        //_THIS.hide()
    })

    $("#RevTag_Edit_External").bind("click", function () {
        if (_set_par_ediTxt()) {
            return true;// enable href open.
        }
        return false;// diable href open
    })

    $("#RevTag_Save").bind("click", function () {
        var par = _set_par_ediTxt()
        if (!par) {
            Uti.Msg("No save")
            return
        }
        Jsonpster.api = RestApi.ApiBibleObj_write_Usr_BkcChpVrs_txt.str
        Jsonpster.inp.par = par
        console.log("inp:", Jsonpster)
        Uti.Msg(Jsonpster)
        Jsonpster.RunAjaxPost(function (ret) {
            console.log("ret", ret)
            Uti.Msg(ret.out)
            _THIS.m_ediBtn.enable_edit(false, true)

        })
    })


    $("#RevTag_Load").bind("click", function () {
        var ret = Uti.parse_bcv(_THIS.m_par.m_bcv, "")
        Jsonpster.inp.par = { fnames: [_THIS.m_par.m_rev], inpObj: ret.bcvObj }
        Jsonpster.api = RestApi.ApiBibleObj_read_Usr_BkcChpVrs_txt.str
        console.log("Jsonpster:", Jsonpster)
        Uti.Msg(Jsonpster)
    
        Jsonpster.Run(function (ret) {
            console.log("ret", ret.out.data)
            Uti.Msg(ret.out)
            if (ret.out.desc.indexOf("success") >= 0) {
                var edx = _THIS.m_ediDiv.getEditHtm()
                if (ret.out.data != edx) {
                    var dlt = edx.length - ret.out.data.length
                    if (!confirm(`difference:${dlt}(b): continue?`)) return
                }
                var showtxt = Uti.convert_std_bcv_in_text_To_linked(ret.out.data)
                _THIS.m_ediDiv.html(showtxt)
                _THIS.m_ediDiv.setEditHtm(ret.out.data)
                _THIS.m_ediBtn.enable_edit(true, true)
                $(_THIS.m_ediDiv.m_id).toggleClass("txt_loaded")
            } else {
                alert("load failed. ")
            }
        })
    })

}

function PopupMenu_RevTag() {
    this.m_id = "#divPopupMenu_RevTag"
    this.m_par = null
}
PopupMenu_RevTag.prototype.init_popup = function (par) {
    this.m_par = par

    $(this.m_id).show()

    par.m_showHideVTxt.set_vtxID(this.m_par.m_txuid, function (bHide, sLab) {

    })

}

PopupMenu_RevTag.prototype.init = function () {
    var _THIS = this
    $("#Copy2clipboard").bind("click", function () {
        var txt = $("#" + _THIS.m_par.m_txuid).text()
        var bcv = _THIS.m_par.m_bcv
        var rev = _THIS.m_par.m_strTag
        txt = `"${txt}" (${bcv} ${rev})`;
        Uti.copy2clipboard(txt, this)
        Uti.Msg(txt);
    })
}



function PopupMenu() {
    this.m_id = "#divPopupMenu"
    this.m_par = null
}

PopupMenu.prototype.init = function (cbf) {
    var _THIS = this
    $(this.m_id).draggable().hide()
    $(this.m_id).find("a").bind("click", function () {
        $(_THIS.m_id).hide()
    })
    $(this.m_id).find("caption").bind("click", function () {
        var bcv = $(this).text().trim()
        if (bcv.length > 0) {
            Uti.copy2clipboard(`(${bcv})`, this)
        }
        if (cbf) cbf(bcv)
        _THIS.hide()
    })

    this.popupMenu_BcvTag = new PopupMenu_BcvTag()
    this.popupMenu_EdiTag = new PopupMenu_EdiTag()
    this.popupMenu_RevTag = new PopupMenu_RevTag()

    this.popupMenu_BcvTag.init()
    this.popupMenu_EdiTag.init()
    this.popupMenu_RevTag.init()


    var ShowHideVTxt = function () {
        var _THIS = this
        $(".EdiTag_ToggleHideShow").bind("click", function () {
            $(_THIS.m_vtxID).slideToggle().toggleClass("showTxt")
            _THIS.update_label()
        })
    }
    ShowHideVTxt.prototype.set_vtxID = function (vtxID, cbf) {
        this.m_vtxID = "#" + vtxID
        this.m_cbf = cbf
        this.update_label()
    }
    ShowHideVTxt.prototype.update_label = function () {
        // _THIS.m_par.m_txuid 
        var bshowTxt = $(this.m_vtxID)[0].classList.contains("showTxt")

        var sLab = "Hide"
        if (bshowTxt) {
            sLab = "Show"
        }
        $(".EdiTag_ToggleHideShow").text(sLab)
        if (this.m_cbf) this.m_cbf(bshowTxt, sLab)
    }
    this.showHideVTxt = new ShowHideVTxt()
}
PopupMenu.prototype.popup = function (par) {


    par.m_showHideVTxt = this.showHideVTxt
    this.m_par = par

    $(this.m_id).css('top', par.m_y);

    $(this.m_id).find("tbody").hide()


    var ret = Uti.parse_bcv(par.m_strTag)
    //var txuid = par.m_txuid
    if (ret) {
        this.popupMenu_BcvTag.init_popup(par)
    } else {
        if ("_" === par.m_strTag[0]) {
            this.popupMenu_EdiTag.init_popup(par)
        } else {
            this.popupMenu_RevTag.init_popup(par)
        }
    }
    $(this.m_id).find("caption").text(par.m_bcv)

    if (par.m_alreadyHili) {
        $(this.m_id).toggle();
    } else {
        $(this.m_id).show()
    }

}
PopupMenu.prototype.hide = function () {
    $(this.m_id).hide()
}









//Showup Bookcode - Chapter:Verses
function ShowupBCV() {
    this.m_MainMenuToggler = "#MainMenuToggler"
    this.m_showupBknID = "#bk_name"
    this.m_showupChpId = "#chp_num"
    this.m_showupVrsId = "#vrs_num"
    this.m_minus_ChpId = "#minus_ChpVal"//:--
    this.m_plus_ChpId = "#plus_ChpVal"

    this.init()
}
ShowupBCV.prototype.init = function () {
    ////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function Showup_CV(val_id) {
        this.m_showupValID = val_id
    }
    Showup_CV.prototype.init = function (val_id) {
        this.m_showupValID = val_id
    }
    Showup_CV.prototype.get_showupVal = function () {
        var str = $(this.m_showupValID).text()
        var ival = parseInt(str)
        if (!Number.isInteger(ival)) {
            ival = 0;
        }
        return ival
    }
    Showup_CV.prototype.set_showupVal = function (i) {
        $(this.m_showupValID).text(i)
    }
    Showup_CV.prototype.append_showupVal = function (i) {
        var _THIS = this
        var icap = _THIS.get_showupVal()
        var iupdateCap = icap * 10 + parseInt(i);
        _THIS.set_showupVal(iupdateCap);
    }
    Showup_CV.prototype.detchback = function () {
        var sval = "" + this.get_showupVal()
        var s = sval.substr(0, sval.length - 1)
        this.set_showupVal(s);
        return s
    }
    ////--------------------------------------------
    ////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function Showup_Bk(val_id) {
        this.m_showupBkiID = val_id
    }
    Showup_Bk.prototype.init = function (val_id) {
        this.m_showupBkiID = val_id
    }
    Showup_Bk.prototype.onclick_bkc = function (cbf) {
        $(this.m_showupBkiID).bind("click", function () {
            cbf()
        })
    }
    Showup_Bk.prototype.set_showupBkc = function (bkc) {
        var Bkname = ""
        if (CNST.Cat2VolArr[bkc]) {
            Bkname = bkc
        } else if (bkc) {
            Bkname = CNST.BibVolNameEngChn(bkc)
        }
        $(this.m_showupBkiID).text(Bkname).attr("volcode", bkc);
    }
    Showup_Bk.prototype.get_showupBkc = function () {
        return $(this.m_showupBkiID).attr("volcode");
    }
    Showup_Bk.prototype.get_showup_bkn_info = function (b) {
        var booknamecode = this.get_showupBkc()
        var iMaxChap = -1
        if (booknamecode && booknamecode.length > 0 && _Max_struct[booknamecode]) {
            iMaxChap = Object.keys(_Max_struct[booknamecode]).length;
        }
        return { bkn: booknamecode, maxChp: iMaxChap }
    }
    ////--------------------------------------------

    this.m_Bki = new Showup_Bk(this.m_showupBknID)
    this.m_Chp = new Showup_CV(this.m_showupChpId)
    this.m_Vrs = new Showup_CV(this.m_showupVrsId)
}

ShowupBCV.prototype.update_showup = function (bcv) {
    var par = Uti.parse_bcv(bcv)
    if (par) {
        this.m_Bki.set_showupBkc(par.vol)
        this.m_Chp.set_showupVal(par.chp)
        this.m_Vrs.set_showupVal(par.vrs)
    } else {
        this.m_Bki.set_showupBkc(bcv)
        this.m_Chp.set_showupVal('')
        this.m_Vrs.set_showupVal('')
    }

}
ShowupBCV.prototype.get_selected_bcv_parm = function () {
    var vol = this.m_Bki.get_showupBkc()
    var chp = this.m_Chp.get_showupVal()
    var vrs = this.m_Vrs.get_showupVal()

    var ret = { oj_search: {} }

    if (!vol || vol.length === 0) {
        return ret
    }

    if (CNST.Cat2VolArr[vol]) { //for category: OT
        CNST.Cat2VolArr[vol].forEach(function (bkc) {
            ret.oj_search[bkc] = {}
        })
        return ret;
    }

    ret.oj_search = {}
    ret.oj_search[vol] = {}

    ret.oj_bc = {}
    ret.oj_bc[vol] = {}
    if (chp === 0) {
        return ret
    }

    ret.oj_bc[vol][chp] = {}
    ret.oj_search[vol][chp] = {}

    if (vrs > 0) {
        ret.m_bcv = vol + chp + ":" + vrs
    }
    return ret;
};



ShowupBCV.prototype.goNextChp = function (i) {
    var maxChp = this.m_Bki.get_showup_bkn_info().maxChp
    if (maxChp < 1) return

    var chp = i + this.m_Chp.get_showupVal() //showup chp

    if (chp > maxChp) chp = 1
    if (chp <= 0) chp = maxChp

    this.m_Chp.set_showupVal(chp) //showup chp
}


ShowupBCV.prototype.onclick_Vrs = function (cbfLoadBible) {
    var _This = this

    $(this.m_Vrs.m_showupValID).bind("click", function (evt) {
        evt.stopImmediatePropagation();

        var maxChp = _This.m_Bki.get_showup_bkn_info().maxChp
        //if (maxChp < 1) return

        var vrs = _This.m_Vrs.get_showupVal()

        _This.m_Vrs.detchback()
        cbfLoadBible(0)
    });
}
ShowupBCV.prototype.onclick_Chp = function (cbfLoadBible) {
    var _This = this
    $(this.m_Chp.m_showupValID).bind("click", function (evt) {
        evt.stopImmediatePropagation();

        var vrs = "" + _This.m_Chp.get_showupVal()
        if (vrs.length > 0) {
            _This.m_Chp.detchback()
            _This.m_Vrs.set_showupVal("")
            cbfLoadBible(1)
        } else {
            _This.m_Vrs.set_showupVal("")
            cbfLoadBible(0)
        }
    });

    $(this.m_minus_ChpId).bind("click", function (evt) {
        evt.stopImmediatePropagation();

        var maxChp = _This.m_Bki.get_showup_bkn_info().maxChp
        if (maxChp < 1) return

        _This.m_Vrs.set_showupVal("")
        _This.goNextChp(-1)
        cbfLoadBible(1)
    });

    $(this.m_plus_ChpId).bind("click", function (evt) {
        evt.stopImmediatePropagation();

        var maxChp = _This.m_Bki.get_showup_bkn_info().maxChp
        if (maxChp < 1) return

        _This.m_Vrs.set_showupVal("")
        _This.goNextChp(+1)
        cbfLoadBible(1)
    });
}
ShowupBCV.prototype.onclick_face = function (cbfLoadBible) {
    var _This = this

    $(this.m_MainMenuToggler).bind("click", function () {
        cbfLoadBible()
    })
}
ShowupBCV.prototype.setAsChildren = function () {
    var _This = this

    $(this.m_MainMenuToggler).css("background-color", "#00aaaa")
    $("body").attr("onbeforeunload", null)
}
////////////////-------------------////////////////////////////////









function SingleKeyInputPanel(tbody) {
    if (!tbody) {
        tbody = "#SingleKeywordsBody"
    }
    this.m_tbody = tbody

}
SingleKeyInputPanel.prototype.rm_hili = function () {
    $(".vin").removeClass("hili");
}
SingleKeyInputPanel.prototype.gen_panel = function (par) {
    var ks = this.get_cha_arr_after_str("", _Max_struct);

    var s = "<tr id='vitr'>";
    var _This = this;
    $.each(ks, function (i, c) {
        var volarr = _This.Get_Vol_Arr_from_KeyChar(c, _Max_struct);
        var vintype = (["1", "2", "3"].indexOf(c) >= 0) ? "vinNum" : "vinCap"
        var ssb = "<sub>" + volarr.length + "</sub>";
        if (volarr.length === 1) ssb = "";
        c = c + ssb;
        s += `<th><div class='vin ${vintype}'>${c}</div></th>`;
        if (9 == i) s += "</tr><tr>";
    });
    s += "</tr>";

    $(this.m_tbody).html(s).find(".vin").bind("click", function () {
        var alreadyHili = $(this)[0].classList.contains('hili')
        console.log("alreadyHili", alreadyHili)

        $(".vin").removeClass("hili");
        $(this).addClass("hili");
        //

        var ch = $(this).text();
        var volarr = _This.Get_Vol_Arr_from_KeyChar(ch[0], _Max_struct);

        if (!par) return console.error("par is null")
        setTimeout(function () {
            if (par && par.onClickItm) par.onClickItm(ch, volarr, alreadyHili)
        }, 100)
    });
    return ks;
}
SingleKeyInputPanel.prototype.get_cha_arr_after_str = function (str, BibleObjStruct) {
    if (!BibleObjStruct) return [];
    var ret = {};
    Object.keys(BibleObjStruct).forEach(function (v) {
        if (v.indexOf(str) == 0) {
            var idx = str.length;
            if (v.length > idx) {
                var ch = v[idx];
                if (!ret[ch]) ret[ch] = 0;
                ret[ch]++;
            }
        }
    });
    var ks = Object.keys(ret).sort();

    //put numbers at tail.
    for (var i = 0; i < 3; i++) {
        var num = ks.shift()
        ks.push(num)
    }

    return ks;
}
SingleKeyInputPanel.prototype.Get_Vol_Arr_from_KeyChar = function (ch) {
    var arr = [];
    var BkAry = Object.keys(_Max_struct)
    if (ch.length != 1) return BkAry
    BkAry.forEach(function (vol) {
        var keycod = vol[0]
        if (!Number.isInteger(parseInt(ch)) && Number.isInteger(parseInt(keycod))) {
            keycod = vol[1] //:J, 1Jn
        }

        if (ch === keycod) {
            arr.push(vol);
        }
    });
    return arr;
}





function SingleKeyOutputBooksTable(tid) {
    this.m_id = tid; //"#Tab_OutputBooksList"
    this.cbf_onClickItm = null
}
SingleKeyOutputBooksTable.prototype.init = function (par) {
    var _THIS = this
    $(this.m_id).bind("click", function () {
        //$(_THIS.m_id).hide()
    }).hide().draggable();
    this.cbf_onClickItm = par.onClickItm
}
SingleKeyOutputBooksTable.prototype.get_selary = function () {
    var vol_arr = []
    $(".v3.hili").each(function () {
        var svol = $(this).text();
        vol_arr.push(svol);
    });
    return vol_arr
}
SingleKeyOutputBooksTable.prototype.ary_To_trs = function (vol_arr) {
    var trarr = [];
    var custom_cat_ary = MyStorage.getCustomCatAry()
    vol_arr.forEach(function (vol, i) {
        var hili = "";//(0 === i) ? "hili" : ""
        var cls = `class='v3 ${hili} ${CNST.BibVol_OTorNT(vol)}' vol='${vol}'`;
        //<td align='right'>"+BiBookName[vol][0]+"</td>
        var iMaxChap = Object.keys(_Max_struct[vol]).length;

        var cls_custom = 'custom_cat'
        if (custom_cat_ary.indexOf(vol) >= 0) {
            cls_custom += ' Custom_Selected_Book_Category'
        }

        trarr.push(`<tr ${cls}><td class='${cls_custom}'>${vol}</td><td>${CNST.BibVolNameEngChn(vol)}</td><td>${iMaxChap}</td></tr>`);
    });
    return trarr.join("");
}
SingleKeyOutputBooksTable.prototype.show = function (bShow) {
    if (bShow) {
        $(this.m_id).show()
    } else {
        $(this.m_id).hide()
    }
}

SingleKeyOutputBooksTable.prototype.Popup_BookList_Table = function (scat, vol_arr, alreadyhili, Yoffset) {

    if (!scat || vol_arr.length === 0) {
        $(this.m_id).hide()
        return
    }
    var _THIS = this
    var tid = this.m_id + " tbody"
    var bcr = $("#menuContainer")[0].getBoundingClientRect();
    var h2 = parseInt(Yoffset);

    var trs = this.ary_To_trs(vol_arr);

    $(tid).html(trs).find(".v3").bind("click", function () {

        if ("Custom" === scat) {
            //$(".v3.hili").removeClass("hili");
            $(this).find("td.custom_cat").toggleClass("Custom_Selected_Book_Category");
            var custom_cat_ary = []
            $(".custom_cat.Custom_Selected_Book_Category").each(function () {
                var tx = $(this).text()
                custom_cat_ary.push(tx)
            })
            Uti.Msg(custom_cat_ary)
            MyStorage.setCustomCatAry(custom_cat_ary)
        } else if (scat.length > 0) {
            var vol = $(this).attr("vol");
            _THIS.cbf_onClickItm(vol)
            $(_THIS.m_id).hide()
        }
    });

    if (alreadyhili) {
        $(this.m_id).css('top', bcr.y + h2).css('left', bcr.x).toggle();//.slideToggle()
    } else {
        $(this.m_id).css('top', bcr.y + h2).css('left', bcr.x).show()
    }

    if (vol_arr.length === -1) {//auto setup problematic
        setTimeout(() => {
            $(tid).find(".v3").each(function () {
                $(this).find("td").addClass("hili");
                $(this).trigger("click")
            })
        }, 2000)
        return
    }
};





















///var d1 = new DigitNumberInputPanel("digiChp", "#DigitOfChapt", "chp_num", showup);
function DigitNumberInputZone() {
    this.m_showup = null
}
DigitNumberInputZone.prototype.init_digi = function (shwup) {
    this.m_showup = shwup
    ///////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function DigitNumberSet(parent) {
        this.m_tbody = null
        this.m_parent = parent
    }
    DigitNumberSet.prototype.Gen_Digits = function (tbody, clsname) {
        if (!tbody) {
            tbody = "#DigitOfChapt"
        }
        this.m_tbody = tbody
        this.m_classname = clsname

        function _td(num, clsname) {
            var s = `<th><button class='digit  ${clsname}' title='${clsname}'>${num}</button></th>`;
            return s;
        }
        function gen_trs(clsname) {
            var s = "", num = 1;
            s += `<tr>`;
            for (var i = 1; i < 10; i++) {
                s += _td(num++, clsname);
            };
            s += _td(0, clsname) + `</tr>`;
            return s;
        };

        var s = gen_trs(this.m_classname);
        $(this.m_tbody).html(s)
        this.disable_all_digiKey(true);
        return
    }
    DigitNumberSet.prototype.disable_all_digiKey = function (b) {
        $(this.m_tbody).find(".digit").attr("disabled", b);
    }
    DigitNumberSet.prototype.disable_zero_only = function () {
        this.disable_all_digiKey(false)
        $(this.m_tbody).find(".digit:contains('0')").attr("disabled", true);
    }
    ///////====================================================================

    this.m_Chp = new DigitNumberSet(this)
    this.m_Vrs = new DigitNumberSet(this)

    this.m_Chp.on_Click_Digit = function (cbfLoadBible) {
        this.m_cbfLoadBible = cbfLoadBible
        var _THIS = this

        $(this.m_tbody).find("." + _THIS.m_classname).bind("click", function () {
            var dici = $(this).text();
            _THIS.m_parent.m_showup.m_Chp.append_showupVal(dici)

            _THIS.m_parent.init_Chp_digiKeys_by_vol()
            _THIS.m_parent.init_Vrs_digiKeys_by_vol()

            $(".hili_digi_key").removeClass("hili_digi_key")
            $(this).addClass("hili_digi_key")

            cbfLoadBible()
        });
    }
    this.m_Chp._enable_key = function (vol, chp) {
        $(this.m_tbody).find(".digit").each(function () {
            var dici = parseInt($(this).text());
            var schp = (chp * 10 + dici)
            if (undefined === _Max_struct[vol][schp]) {
                $(this).attr("disabled", true);
            } else {
                $(this).attr("disabled", false);
            }
        });
    }
    this.m_Vrs.on_Click_Digit = function (cbfLoadBible) {
        this.m_cbfLoadBible = cbfLoadBible
        var _THIS = this

        $(this.m_tbody).find("." + _THIS.m_classname).bind("click", function () {
            var dici = $(this).text();
            _THIS.m_parent.m_showup.m_Vrs.append_showupVal(dici)

            _THIS.m_parent.init_Vrs_digiKeys_by_vol()

            $(".hili_digi_key").removeClass("hili_digi_key")
            $(this).addClass("hili_digi_key")

            cbfLoadBible()
        });
    }
    this.m_Vrs._enable_key = function (vol, chp, vrs) {
        function _enable_key(vol, chp, vrs, dici) {
            var vrs = (vrs * 10 + dici)
            return (undefined === _Max_struct[vol][chp][vrs])
        }
        $(this.m_tbody).find(".digit").each(function () {
            var dici = parseInt($(this).text());
            var bret = _enable_key(vol, chp, vrs, dici)
            $(this).attr("disabled", bret);
        });
    }
}
DigitNumberInputZone.prototype.init_Chp_digiKeys_by_vol = function () {
    var vol = this.m_showup.m_Bki.get_showupBkc();// $(this.m_volID).attr("volcode")
    var chp = this.m_showup.m_Chp.get_showupVal();  //()
    var _THIS = this

    if (!vol || CNST.Cat2VolArr[vol]) {
        this.m_Chp.disable_all_digiKey(true)
        return
    }
    var iMaxChap = Object.keys(_Max_struct[vol]).length;
    if (0 === chp) {
        if (1 === iMaxChap) {
            this.m_showup.m_Chp.append_showupVal(1)
            if (this.m_Chp.m_cbfLoadBible) this.m_Chp.m_cbfLoadBible()
        } else if (iMaxChap >= 9) {
            this.m_Chp.disable_zero_only()
        } else {
            this.m_Chp._enable_key(vol, chp)
        }
    } else {
        this.m_Chp._enable_key(vol, chp)
    }
    return iMaxChap
}
DigitNumberInputZone.prototype.init_Vrs_digiKeys_by_vol = function () {
    var vol = this.m_showup.m_Bki.get_showupBkc(); // $(this.m_volID).attr("volcode")
    var chp = this.m_showup.m_Chp.get_showupVal(); //
    var vrs = this.m_showup.m_Vrs.get_showupVal();//


    if (!vol || !chp) {
        this.m_Vrs.disable_all_digiKey(true)
        return
    }
    var iMaxVrs = Object.keys(_Max_struct[vol][chp]).length;
    if (0 === vrs) {
        if (iMaxVrs >= 9) {
            this.m_Vrs.disable_zero_only()
        } else {
            this.m_Vrs._enable_key(vol, chp, vrs)
        }
    } else {
        this.m_Vrs._enable_key(vol, chp, vrs)
    }
}
////////////////




























function Tab_Category() {
    this.m_tabid = "#Tab_CatagryOfBooks"
}
Tab_Category.prototype.rm_hili = function () {
    $(".cat").removeClass("hili");
}
Tab_Category.prototype.Gen_Cat_Table = function (par) {

    $(this.m_tabid + " caption").click(function () {
        $(".cat").removeClass("hili");
        $(".v3").remove();

        if (par && par.onClickItm) par.onClickItm("", [], true)
    });

    var _This = this;
    var s = "";
    $.each(Object.keys(CNST.Cat2VolArr), function (i, v) {
        s += "<tr><td class='cat'>" + v + "</td></tr>";
    });
    $(this.m_tabid + " tbody").html(s).find(".cat").bind("click", function () {
        var alreadyHili = $(this)[0].classList.contains('hili')

        $(".cat").removeClass("hili");
        var scat = $(this).addClass("hili").text();

        var vol_arr = CNST.Cat2VolArr[scat];
        if ("Custom" === scat) {
            vol_arr = Object.keys(_Max_struct)
        }

        if (par && par.onClickItm) par.onClickItm(scat, vol_arr, alreadyHili)
    });
}














function Tab_DocumentsClusterList(tid) {
    this.m_tbid = tid // "#Tab_NamesOfBibleDocuments"
    this.m_onClickItm2Select = null
    this.m_selectedItems_ary = MyStorage.getSelectedDocsList();//["CUVS"] //default
}
Tab_DocumentsClusterList.prototype.Init_Docs_Table = function (parm) {
    this.m_onClickItm2Select = parm.onClickItm
    this.Gen_table_for_Documents()
}

Tab_DocumentsClusterList.prototype.Gen_table_for_bcvTag = function (par) {
    //BCVtagClusterInfo = { tags: tags, trID: trID }
    var clusterinfo = par.BCVtagClusterInfo;
    var AllDocsArr = Object.keys(CNST.FnameOfBibleObj);
    var selary = clusterinfo.tags

    var _THIS = this
    var sFile = MyStorage.getMostRecentSearchFile()
    var trs = ""
    $.each(AllDocsArr, function (i, v) {
        var hil = "";
        if (selary.indexOf(v) >= 0) hil = "hili";
        trs += `<tr><td class='cbkn ${hil}'>${v}</td></tr>`;
    });

    function get_selectedDocs() {
        var ar = []
        $(".cbkn.hili").each(function () {
            var tx = $(this).text().trim()
            ar.push(tx)
        })
        return ar
    }
    $(this.m_tbid + " caption button").text(par.m_bcv).css("background-color", "red").bind("click", function () {
        $(this).unbind()
        setTimeout(function () {
            _THIS.Gen_table_for_Documents()
        }, 10)
    })
    $(this.m_tbid + " tbody").html(trs).find(".cbkn").bind("click", function () {
        $(this).toggleClass("hili")
        par.BCVtagClusterInfo.newselary = get_selectedDocs()
        _THIS.m_onClickItm2Select(par)
    });
}
Tab_DocumentsClusterList.prototype.Gen_table_for_Documents = function () {
    var str = "";
    var _THIS = this
    var bknArr = Object.keys(CNST.FnameOfBibleObj);

    var sFile = MyStorage.getMostRecentSearchFile()
    $.each(bknArr, function (i, v) {
        var hil = "";
        if (_THIS.m_selectedItems_ary.indexOf(v) >= 0) hil = "hili";
        str += "<tr><td class='cbkn " + hil + "'>" + v + "</td></tr>";
    });


    function update_seletedItems(_this) {
        var alreadyHili = $(_this)[0].classList.contains('hili')
        var name = $(_this).text();
        if (alreadyHili) {//will be removed
            var idx = _THIS.m_selectedItems_ary.indexOf(name)
            if (_THIS.m_selectedItems_ary.length > 1) {
                _THIS.m_selectedItems_ary.splice(idx, 1) //remove 1.
            }
        } else {//will be added back
            _THIS.m_selectedItems_ary.push(name)
        }
        MyStorage.setSelectedDocsList(_THIS.m_selectedItems_ary)
        Uti.Msg(name + " : " + CNST.FnameOfBibleObj[name]);
    }
    function update_hili(_this) {
        $(_this).toggleClass("hili");
        var nsel = $(".cbkn.hili").size()
        if (nsel === 0) {//keep at least one.
            $(_this).addClass("hili")
        }
    }

    $(this.m_tbid + " caption button").text("Documents").css("background-color", "lightgrey").bind("click", function () {
        $(this).unbind()
        setTimeout(function () {
            _THIS.Gen_table_for_Sequencer()
        }, 10)
    })
    $(this.m_tbid + " tbody").html(str).find(".cbkn").bind("click", function () {
        update_seletedItems(this)
        update_hili(this)
        _THIS.m_onClickItm2Select("reloadtable")
    });
}
Tab_DocumentsClusterList.prototype.Gen_table_for_Sequencer = function () {
    var _THIS = this
    var bknArr = Object.keys(CNST.FnameOfBibleObj);

    var sFile = MyStorage.getMostRecentSearchFile()
    var str = "";
    $.each(_THIS.m_selectedItems_ary, function (i, v) {
        var hil = "hili";
        str += `<tr><td class='cbkn ${hil}'>${v}</td></tr>`;
    });

    function moveup_selitm(_this, i) {
        var name = $(_this).text();
        var idx = _THIS.m_selectedItems_ary.indexOf(name)
        if (1 === i) {//move up
            if (idx === 0) {
                var tmp = _THIS.m_selectedItems_ary.shift()
                _THIS.m_selectedItems_ary.push(tmp)
            } else {
                var tmp = _THIS.m_selectedItems_ary[idx - 1]
                _THIS.m_selectedItems_ary.splice(idx + 1, 0, tmp) //insert after idx
                _THIS.m_selectedItems_ary.splice(idx - 1, 1) //rm prev
            }
        }
        if (-1 === i) {//move down
            if (idx === _THIS.m_selectedItems_ary.length - 1) {
                var tmp = _THIS.m_selectedItems_ary.pop()
                _THIS.m_selectedItems_ary.unshift(tmp)
            } else {
                var tmp = _THIS.m_selectedItems_ary[idx]
                _THIS.m_selectedItems_ary.splice(idx + 2, 0, tmp) //insert after idx
                _THIS.m_selectedItems_ary.splice(idx, 1) //rm prev
            }
        }
        MyStorage.setSelectedDocsList(_THIS.m_selectedItems_ary)
    }

    $(this.m_tbid + " caption button").text("Seqence").css("background-color", "red").bind("click", function () {
        $(this).unbind()
        setTimeout(function () {
            _THIS.Gen_table_for_Searchin()
        }, 10)
    })
    $(this.m_tbid + " tbody").html(str).find(".cbkn").bind("click", function () {
        $(this).unbind()
        moveup_selitm(this, +1)
        _THIS.Gen_table_for_Sequencer()
        _THIS.m_onClickItm2Select("reloadtable")
    });
}

Tab_DocumentsClusterList.prototype.Gen_table_for_Searchin = function () {
    var str = "";
    var _THIS = this
    var bknArr = Object.keys(CNST.FnameOfBibleObj);

    var sFile = MyStorage.getMostRecentSearchFile()
    $.each(_THIS.m_selectedItems_ary, function (i, v) {
        var hil = "hili";
        if (v === sFile) hil += " searchFile"
        str += `<tr><td class='cbkn ${hil}'>${v}</td></tr>`;
    });

    function update_Searchin(_this) {
        $(".searchFile").removeClass("searchFile");
        $(_this).addClass("searchFile");
        var txt = $(_this).text().trim()
        MyStorage.setMostRecentSearchFile(txt)
    }

    $(this.m_tbid + " caption button").text("Searchin").css("background-color", "lightblue").bind("click", function () {
        $(this).unbind()
        setTimeout(function () {
            _THIS.Gen_table_for_Documents()
        }, 10)
    })
    $(this.m_tbid + " tbody").html(str).find(".cbkn").bind("click", function () {
        update_Searchin(this)
        _THIS.m_onClickItm2Select()
    });
}

Tab_DocumentsClusterList.prototype.get_selected_seq_fnamesArr = function () {
    return this.m_selectedItems_ary
};///










function Tab_MostRecentBody(bSingpleSel) {
    this.m_tbodyID = null; //"#Tab_MostRecent_BCV"
    this.m_bSingleSel = bSingpleSel
}
Tab_MostRecentBody.prototype.init = function (tbodyID) {
    this.m_tbodyID = tbodyID
    this.m_MostRecentInStore = MyStorage.MostRecentAryInStore(tbodyID)
    this.m_bcvHistory = this.m_MostRecentInStore.get_ary()
}
Tab_MostRecentBody.prototype.show = function (bShow) {
    if (bShow) $(this.m_tbodyID).show()
    else {
        $(this.m_tbodyID).hide()
    }
    return bShow
}
Tab_MostRecentBody.prototype.onClickHistoryItem = function (onClickHistoryItm) {
    this.m_onClickHistoryItm = onClickHistoryItm
    this.update_tab()
}
Tab_MostRecentBody.prototype.addnew2table = function (bcv) {
    var ret = Uti.parse_bcv(bcv)
    if (!ret) return Uti.Msg("addnew is not valid: " + bcv)

    this.m_MostRecentInStore.addonTop(bcv)
    this.m_bcvHistory = this.m_MostRecentInStore.get_ary()
    this.m_bcvHistory = this.m_bcvHistory.slice(0, 100) //:max in size. fetch idx range [0, 100].
    this.update_tab()
}

Tab_MostRecentBody.prototype.update_tab = function () {
    var _THIS = this
    var trs = ""
    this.m_bcvHistory.forEach(function (vcv, i) {
        trs += (`<tr><td>${vcv}</td></tr>`)
    });

    $(this.m_tbodyID).html(trs).find("td").bind("click", function (evt) {
        evt.stopImmediatePropagation()

        if (_THIS.m_bSingleSel) {
            $(_THIS.m_tbodyID).find(".hili").removeClass("hili")
        }

        $(this).toggleClass("hili")
        var hiliary = []
        $(this).parentsUntil("table").find(".hili").each(function () {
            hiliary.push($(this).text())
        })

        if (_THIS.m_onClickHistoryItm) _THIS.m_onClickHistoryItm(hiliary)
    })
}
Tab_MostRecentBody.prototype.clearHistory = function (idtxtout) {
    var _THIS = this

    _THIS.m_MostRecentInStore.cleanup()
    $(this.m_tbodyID).find("td").each(function () {
        var tx = $(this).text().trim()
        if ($(this)[0].classList.contains("hili")) {
            $(this).parent().hide()
        } else {
            _THIS.m_MostRecentInStore.addonTop(tx)
        }
    })
    this.m_bcvHistory = _THIS.m_MostRecentInStore.get_ary()

    this.MyStorage_add2HistoryMostRecentBook(this.m_bcvHistory)

    var std_bcv_strn = this.m_bcvHistory.join(", ")
    Uti.Msg(std_bcv_strn)
    var ret = Uti.convert_std_bcv_str_To_uniq_biblicalseq_splitted_ary(std_bcv_strn)
    Uti.Msg(ret)
    var stdbcv = Uti.convert_std_uniq_biblicalseq_splitted_ary_To_dashed_strn(ret.biblical_order_splitted_ary)
    Uti.Msg(stdbcv)
}
Tab_MostRecentBody.prototype.toggleSelAll = function () {
    $(this.m_tbodyID).find("td").toggleClass("hili")
}




function Tab_MostRecent_BCV() {
    this.m_tableID = "#Tab_MostRecent_BCV"

}

Tab_MostRecent_BCV.prototype.init = function () {
    var _THIS = this
    this.m_tbodies = {
        MemoryVerse: new Tab_MostRecentBody(false),
        RecentBooks: new Tab_MostRecentBody(true),
        RecentMarks: new Tab_MostRecentBody(false),
    }
    //this.m_Tab_HistoryMostRecentBodyMarks = new Tab_MostRecentBody()
    this.m_tbodies.RecentMarks.init("#RecentMarks")
    this.m_tbodies.RecentBooks.init("#RecentBooks")
    this.m_tbodies.MemoryVerse.init("#MemoryVerse")

    var cap = _THIS.getCap()
    _THIS.show_all(false)
    _THIS.m_tbodies[cap].show(true)

    var clry = ["ColorMemoryVerse", "ColorRecentBooks", "ColorRecentMarks"]

    $(this.m_tableID).find("caption:eq(0)").find("button").bind("click", function () {
        _THIS.show_all(false)
        var cap = $(this).text()
        var ary = Object.keys(_THIS.m_tbodies)

        var idx = 1 + ary.indexOf(cap)
        if (idx >= ary.length) idx = 0
        _THIS.m_tbodies[ary[idx]].show(true)
        var classname = clry[idx]
        for (var i = 0; i < clry.length; i++) {
            $(this).text(ary[idx]).removeClass(clry[i])
        }
        $(this).text(ary[idx]).addClass(classname)
    });

    $("#clearUnse").bind("click", function () {
        var cap = _THIS.getCap()
        _THIS.m_tbodies[cap].clearHistory()
    })
    $("#toggleSel").bind("click", function () {
        var cap = _THIS.getCap()
        _THIS.m_tbodies[cap].toggleSelAll()
    })
}
Tab_MostRecent_BCV.prototype.getCap = function () {
    var cap = $(this.m_tableID).find("caption:eq(0)").find("button").text().trim()
    return cap
}

Tab_MostRecent_BCV.prototype.onClickHistoryItem = function (onClickHistoryItm) {
    this.m_tbodies.RecentMarks.onClickHistoryItem(onClickHistoryItm)
    this.m_tbodies.RecentBooks.onClickHistoryItem(onClickHistoryItm)
    this.m_tbodies.MemoryVerse.onClickHistoryItem(onClickHistoryItm)
}
Tab_MostRecent_BCV.prototype.addnew2table = function (itm, bcv) {
    this.m_tbodies[itm].addnew2table(bcv)
}
Tab_MostRecent_BCV.prototype.clearHistory = function (idtxtout) {
    var cap = this.getCap()
    this.m_tbodies[cap].clearHistory(idtxtout)
}
Tab_MostRecent_BCV.prototype.show_all = function (bShow) {
    var _THIS = this
    Object.keys(_THIS.m_tbodies).forEach(function (id) {
        _THIS.m_tbodies[id].show(bShow)
    })
}
Tab_MostRecent_BCV.prototype.toggleSelAll = function () {
    var cap = this.getCap()
    this.m_tbodies[cap].toggleSelAll()
    this.m_tbodies[cap]
}









function GroupsMenuMgr() {
    this.m_grpContainerID = "#GroupsContainer"
}
GroupsMenuMgr.prototype.close_others_of = function (sid) {
    var _THIS = this
    //close others
    $(`.GrpMenuItemHili[sid!='${sid}']`).removeClass("GrpMenuItemHili").each(function () {
        var sid = $(this).attr("sid")
        $(sid).hide()
    })
    _THIS.m_popupBookList.show(false)
}
GroupsMenuMgr.prototype.gen_grp_bar = function (popupBookList, hist) {
    this.m_popupBookList = popupBookList

    var _THIS = this

    var eBar = document.createElement("div")
    $(this.m_grpContainerID).find(".GrpMenu").each(function () {
        var sid = $(this).attr("id")
        var name = " " + sid.substr(4) //:grp_Keyboard
        var eac = document.createElement("a")
        $(eac).text(name).attr("sid", "#" + sid).css("padding-bottom", "2px")
        $(eBar).append(eac).append(" | ")
    });

    $(this.m_grpContainerID).prepend(eBar).find("a[sid]").bind("click", function () {
        var sid = $(this).attr("sid");
        $(sid).slideToggle()
        _THIS.close_others_of(sid)

        $(this).toggleClass("GrpMenuItemHili")
    })

    /////

    $("#Check_bcv").click(function () {
        var str = $("#txtarea").val()
        var ret = Uti.convert_std_bcv_str_To_uniq_biblicalseq_splitted_ary(str)
        Uti.Msg(ret)
        Uti.Msg(ret.biblical_order_splitted_ary.join(", "))

        ////
        //const urlParams = new URLSearchParams(window.location.search);
        //const ip = urlParams.get('ip');
        var htm = ""
        ret.biblical_order_splitted_ary.forEach(function (v, i) {
            hist.m_tbodies.RecentMarks.addnew2table(v)
            var sln = `<a href='#${v}'>${v}</a>`
            htm += `${sln} | `
        })
        $("#txtdiv").html(htm)
        Uti.Msg(htm)

        str = Uti.convert_std_bcv_in_text_To_linked(str)
        Uti.Msg(str)
    });


    $("#NewPage").attr("href", window.location.href)



    $("#Storage_local_repos_exchange").bind("click", function () {
        Uti.open_child_window("./myStorageRepos.htm", function (data) {
            Uti.Msg("fr child win:", data)
        })
    })

    $("#account_default").bind("click", function () {
        $("#repopath").val("https://github.com/wdingbox/biblestudynote_pub_test.git")
        $("#passcode").val("")
    })
    $("#account_date").bind("click", function () {
        var tx = $("#repodesc").val()
        var d = new Date()
        $("#repodesc").val(d.toISOString().substr(0, 10) + "," + d.toLocaleTimeString() + ". " + tx)
    })
    $("#account_helper").bind("click", function () {
        Uti.open_child_window("./myAccount.htm", function (data) {
            MyStorage.Repositories().repos_app_set(data)
        })
    })
    $("#account_set").bind("click", function () {
        $("#outConfig").text($(this).text() + "...").show()
        Jsonpster.inp.usr = MyStorage.Repositories().repos_app_update()
        Jsonpster.api = RestApi.ApiUsrReposData_create.str
        Uti.Msg("repository", Jsonpster)
        Jsonpster.Run(function (ret) {
            Uti.set_menuContainer_color(ret)
            Uti.Msg(ret.out)
            var sta = ret.out.state
            var msg = "<font color='red'>Invalid Repository</font>"
            if (sta) {
                var colr = (sta && 1 === sta.bEditable) ? "lightgreen" : "red"
                var msg = `<font color='${colr}'>bEditable=${sta.bEditable}</font>`

                var colr = (sta && 1 === sta.bRepositable) ? "lightgreen" : "yellow"
                msg += `,<font color='${colr}'>bRepositable=${sta.bRepositable}</font>`
            }

            $("#outConfig").html(msg).show()
        })
    })
    $("#account_destroy").bind("click", function () {
        $("#account_set_info").text($(this).text())
        Jsonpster.inp.usr = MyStorage.Repositories().repos_app_update()
        Jsonpster.api = RestApi.ApiUsrReposData_destroy.str
        Uti.Msg("repository", Jsonpster)
        Jsonpster.Run(function (ret) {
            Uti.Msg(ret.out)
            $("#account_set_info").text("ok")
        })
    })
    $("#account_history").bind("click", function () {
        var ar = MyStorage.Repositories().repos_app_init()
        var stb = "<table id='account_history_table' border='1'>"
        for (var i = 0; i < ar.length; i++) {
            var str = ar[i].repopath.replace(/[\.]git$/, "").replace("https://github.com/", "")
            stb += `<tr><td class='repo_delete'>${i}</td>`
            stb += `<td class='repohistory' repopath='${ar[i].repopath}' repodesc='${ar[i].repodesc}' passcode='${ar[i].passcode}'>${str}</td></td>`
            stb += "</tr>"
        }
        stb += "</table>"

        $("#outConfig").html(stb).find(".repohistory").bind("click", function () {
            $("#outConfig").find(".hili").removeClass('hili')
            $(this).addClass("hili")
            var repopath = $(this).attr("repopath")
            var repodesc = $(this).attr("repodesc")
            var passcode = $(this).attr("passcode")
            MyStorage.Repositories().repos_app_set({ repopath: repopath, repodesc: !repodesc ? "" : repodesc, passcode: passcode })
        });

        $("#outConfig").slideToggle()
    })
    $("#passcode_toggler").bind("click", function () {
        var tx = $("#passcode").attr("type")
        console.log(tx, btoa(tx), atob(btoa(tx)))
        if (tx === "password") tx = "text"
        else tx = "password"
        $("#passcode").attr("type", tx)
    })

    $("#StorageRepo_save").bind("click", function () {
        if ($("#passcode").val().trim().length === 0) return !!alert("passcode is required for saving.")
        $("#outConfig").text($(this).text() + $(this).val() + " ...").show()
        MyStorage.Repo_save(function (ret) {
            Uti.show_save_results(ret)
            $("#StorageRepo_save").prop("checked",false)
        })
    })
    $("#StorageRepo_load").bind("click", function () {
        $("#outConfig").text($(this).text() + " ...").show()
        MyStorage.Repo_load(function (ret) {
            if (ret.out.state.bEditable) {
                $("#outConfig").html("<font color='lightgreen'>bEditable=true</font>")
            } else {
                $("#outConfig").html("<font color='red'>bEditable=false</font>")
            }
        })
    })
}
GroupsMenuMgr.prototype.sel_default = function (sid) {
    if (!sid) sid = "Keyboard"
    var sid = "#grp_" + sid
    $(this.m_grpContainerID).find(`a[sid='${sid}']`).addClass("GrpMenuItemHili")
    $(sid).show();
    this.close_others_of(sid)
    $("#menuContainer").show()
}
GroupsMenuMgr.prototype.collapse = function () {
    $(".GrpMenu").hide()
    $(".GrpMenuItemHili").removeClass("GrpMenuItemHili")
}



var groupsMenuMgr = new GroupsMenuMgr()





var showup = new ShowupBCV() // ShowupBknChpVrsPanel()
var skinp = new SingleKeyInputPanel()
var digi = new DigitNumberInputZone()
var skout = new SingleKeyOutputBooksTable("#Tab_OutputBooksList")

var tab_category = new Tab_Category()
var markHistory = new Tab_MostRecent_BCV()

var tab_documentsClusterList = new Tab_DocumentsClusterList("#Tab_NamesOfBibleDocuments")

var popupMenu = new PopupMenu()



var AppInstancesManager = function () {
}
AppInstancesManager.prototype.init = function () {
    var _This = this



    $("body").prepend(BibleInputMenuContainer);
    $("#menuContainer").draggable();
    $('*').on('click', function (e) {
        e.stopPropagation();
    });
    $("body").bind("click", function (evt) {
        evt.stopImmediatePropagation();
        //$("#menuContainer").hide()
        $("#divPopupMenu").hide()
        groupsMenuMgr.collapse()
        //popupMenu.hide()
    })

    groupsMenuMgr.gen_grp_bar(skout, markHistory)




    digi.init_digi(showup)

    showup.onclick_Vrs(function (bload) {
        if (bload) {
            digi.init_Chp_digiKeys_by_vol()
            digi.init_Vrs_digiKeys_by_vol()
            _This.loadBible_chapter_by_bibOj();
        } else {
            digi.init_Vrs_digiKeys_by_vol()
        }
        $("#menuContainer").show()
        groupsMenuMgr.sel_default()
        _This.scrollToView_Vrs() //before clearup.
    })
    showup.m_Bki.onclick_bkc(function () {
        _This.scrollToView_Vrs() //before clearup.

        //store before clear
        var ret = showup.get_selected_bcv_parm()
        if (ret && ret.m_bcv) markHistory.m_tbodies.RecentMarks.addnew2table(ret.m_bcv)

        //clear
        showup.m_Chp.set_showupVal("")
        showup.m_Vrs.set_showupVal("")
        digi.init_Chp_digiKeys_by_vol()
        digi.init_Vrs_digiKeys_by_vol()

        $("#menuContainer").show()
        groupsMenuMgr.sel_default()

    })
    showup.onclick_Chp(function (bload) {
        digi.init_Chp_digiKeys_by_vol()
        digi.init_Vrs_digiKeys_by_vol()
        if (bload) {
            _This.loadBible_chapter_by_bibOj();
        }
        $("#menuContainer").show()
        groupsMenuMgr.sel_default()
    })
    showup.onclick_face(function () {
        skout.show(false)
        //$('#menuContainer').slideToggle();
        _This.scrollToView_Vrs() //before clearup.
    })


    digi.m_Chp.Gen_Digits("#DigitOfChapt", "chp_num")
    digi.m_Vrs.Gen_Digits("#DigitOfVerse", "vrs_num")

    digi.m_Chp.on_Click_Digit(function () {
        _This.loadBible_chapter_by_bibOj();
    })
    digi.m_Vrs.on_Click_Digit(function () {
        _This.scrollToView_Vrs();
    })


    skout.init({
        onClickItm: function (vol) {
            showup.m_Bki.set_showupBkc(vol);
            showup.m_Chp.set_showupVal("")
            showup.m_Vrs.set_showupVal("")

            digi.init_Chp_digiKeys_by_vol()
            digi.init_Vrs_digiKeys_by_vol()

            var bcv = `${vol}1:1`
            markHistory.m_tbodies.RecentBooks.addnew2table(bcv)
            //d1.init_Chp_digiKeys_by_vol()
            //d2.disable_all_digiKey(true)

            Uti.Msg(vol + " : maxChap = " + Object.keys(_Max_struct[vol]).length + "\n\n\n");
        }
    })

    if (window.m_bcv) {//frm url. 
        var ret = Uti.parse_bcv(window.m_bcv)
        if (ret) {
            showup.setAsChildren()
            showup.update_showup(window.m_bcv)
            setTimeout(function () {
                _This.loadBible_chapter_by_bibOj()
            }, 3000)
        }
    }

    skinp.gen_panel({
        onClickItm: function (ch, volary, alreadyhili) {
            skout.Popup_BookList_Table(ch, volary, alreadyhili, 78)

            tab_category.rm_hili()
        }
    })

    tab_category.Gen_Cat_Table({
        onClickItm: function (scat, volary, alreadyHili) {
            skout.Popup_BookList_Table(scat, volary, alreadyHili, 2);
            skinp.rm_hili()

            //showup.m_Bki.set_showupBkc(scat);
            showup.update_showup(scat)
        }
    })



    tab_documentsClusterList.Init_Docs_Table({
        onClickItm: function (par) {
            if (par) {
                if ("string" === typeof (par) && "reloadtable" === par) {
                    _This.loadBible_chapter_by_bibOj();
                } else if ("object" === typeof (par)) {
                    _This.loadBible_verse_by_bibOj(par);
                }
            }

        }
    });


    markHistory.init()
    markHistory.onClickHistoryItem(function (bcvAry) {
        if (bcvAry.length === 0) {
            return
        } else if (bcvAry.length === 1) {
            showup.update_showup(bcvAry[0])
            //showup.m_Vrs.set_showupVal("")
            digi.init_Chp_digiKeys_by_vol()
            digi.init_Vrs_digiKeys_by_vol()
            _This.loadBible_chapter_by_bibOj()
        } else {
            var str = bcvAry.join(",")
            Uti.Msg(str)
            var oj = {}
            bcvAry.forEach(function (bcv) {
                var ret = Uti.parse_bcv(bcv, "", oj)
            })
            _This.loadBible_chapter_by_bibOj(oj)
        }

    })

    popupMenu.init(function (bcv) {
        markHistory.addnew2table("MemoryVerse", bcv)
    })
    g_obt.onclick_ob_table(function () {
        //$("#menuContainer").hide()
        $("#divPopupMenu").hide()
        //popupMenu.hide()
        groupsMenuMgr.collapse()
    })

    MyStorage.init(function (ret) {
        Uti.set_menuContainer_color(ret)
        Uti.Msg("Ready ret.out", ret.out)

        var memo = (ret.out.data) ? ret.out.data["#MemoryVerse"] : ""
        if (memo) {
            var ar = JSON.parse(ret.out.data["#MemoryVerse"])
            for (var i = 0; i < ar.length; i++) {
                var bcv = ar[i]
                markHistory.addnew2table("MemoryVerse", bcv)
            }
        }
    })


    g_obt.onclick_popupLabel(function (par) {
        par.m_tab_documentsClusterList = tab_documentsClusterList
        par.m_groupsMenuMgr = groupsMenuMgr
        popupMenu.popup(par)
        markHistory.m_tbodies.RecentMarks.addnew2table(par.m_bcv)
        $("title").text(par.m_bcv)

        showup.update_showup(par.m_bcv)
        digi.init_Chp_digiKeys_by_vol()
        digi.init_Vrs_digiKeys_by_vol()
        //_This.scrollToView_Vrs()
    })

    this.onclicks_btns_in_grpMenu_search()
    MyStorage.getBookNameLanguage()
};
AppInstancesManager.prototype.scrollToView_Vrs = function () {
    var ret = showup.get_selected_bcv_parm()
    if (!ret.m_bcv) return
    $(".bcvTag").each(function () {
        var txt = $(this).text()
        if (txt === ret.m_bcv) {
            $(this)[0].scrollIntoViewIfNeeded()
            $(this).addClass("hiliScroll2View");
        }
    })
};///





AppInstancesManager.prototype.loadBible_verse_by_bibOj_output = function (ret, par) {
    //popupMenu_BcvTag.hide()
    popupMenu.hide()
    g_obt.update_table_tr(ret, par)
}
AppInstancesManager.prototype.loadBible_verse_by_bibOj = function (par) {
    var _THIS = this
    var oj = par.BCVtagClusterInfo.bcvOj
    if (!oj) {
        Uti.Msg("loadBible_verse_by_bibOj", oj)
        return alert("null oj")
    }


    var fnamesArr = par.BCVtagClusterInfo.newselary; //tab_documentsClusterList.get_selected_seq_fnamesArr();
    Jsonpster.inp.par = { fnames: fnamesArr, bibOj: oj, Search: null };
    Jsonpster.api = RestApi.ApiBibleObj_load_by_bibOj.str;
    Uti.Msg(Jsonpster);
    Jsonpster.Run(function (ret) {
        _THIS.loadBible_verse_by_bibOj_output(ret, par)
        setTimeout(function () {
            _THIS.scrollToView_Vrs()
        }, 2100)
    })

};///
AppInstancesManager.prototype.apiCallback_Gen_output_table = function (ret, cbf) {
    //popupMenu_BcvTag.hide()
    popupMenu.hide()
    g_obt.set_data(ret)
    g_obt.Gen_output_table(cbf)
}
AppInstancesManager.prototype.loadBible_chapter_by_bibOj = function (oj) {
    var _THIS = this
    if (!oj) {
        var res = showup.get_selected_bcv_parm();
        console.log("res=", res);
        if (!res || !res.oj_bc) return null
        oj = res.oj_bc
    }
    if (!oj || Object.keys(oj) === 0) return alert("oj is null")

    var fnamesArr = tab_documentsClusterList.get_selected_seq_fnamesArr();
    Jsonpster.inp.par = { fnames: fnamesArr, bibOj: oj, Search: null };
    Jsonpster.api = RestApi.ApiBibleObj_load_by_bibOj.str;
    Uti.Msg(Jsonpster);
    Jsonpster.Run(function (ret) {
        _THIS.apiCallback_Gen_output_table(ret)
        setTimeout(function () {
            _THIS.scrollToView_Vrs()
        }, 2100)
    })

    return res;
};///
AppInstancesManager.prototype.get_search_inp = function () {
    //
    var fnamesArr = tab_documentsClusterList.get_selected_seq_fnamesArr();
    var searchFileName = MyStorage.getMostRecentSearchFile();// nambib.get_search_fname();
    var searchStrn = $("#sinput").val();
    if (searchStrn.length === 0) {
        return alert("no search str.")
    }

    var inp = { fnames: fnamesArr, bibOj: null, Search: { File: searchFileName, Strn: searchStrn } };
    var res = showup.get_selected_bcv_parm();
    if (res) {
        inp.bibOj = res.oj_search
    }
    return inp;
};
AppInstancesManager.prototype.onclicks_btns_in_grpMenu_search = function () {
    var _THIS = this
    function onclick_inpage_find_next(incrs, _this) {
        if (undefined === document.g_NextIndex) document.g_NextIndex = 0
        document.g_NextIndex += incrs
        var matSize = $(".matInPage").length;
        if (document.g_NextIndex < 0) document.g_NextIndex = matSize - 1
        if (document.g_NextIndex >= matSize) document.g_NextIndex = 0
        $(".matNextIdx").removeClass("matNextIdx");
        $(".matInPage").each(function (i, v) {
            if (document.g_NextIndex === i) {
                $(this).addClass("matNextIdx")
                $(this)[0].scrollIntoViewIfNeeded(true)
            }
        });

        var disp = `${document.g_NextIndex}/${matSize}`
        $("#searchNextresult").text(disp).css("color", "black")
        Uti.Msg("tot:" + document.g_NextIndex);
    };

    function onclick_inSvr_BibleObj_search_str() {
        $("#Btn_Prev, #Btn_Next").hide()

        var s = $("#sinput").val().trim();
        if (s.length === 0) return alert("empty input")

        MyStorage.addMostRecentSearchStrn(s)
        gen_search_strn_history()
        document.g_NextIndex = -1


        Jsonpster.inp.par = g_aim.get_search_inp();
        Jsonpster.api = RestApi.ApiBibleObj_search_txt.str;
        Uti.Msg(Jsonpster)
        if (!Jsonpster.inp.par) return
        Jsonpster.Run(function (ret) {
            _THIS.apiCallback_Gen_output_table(ret, function (size) {
                $("#searchNextresult").text("0/" + size)
            });
            Uti.Msg(ret.out.result);
        })

        //test
        var unicds = "";
        for (var i = 0; i < s.length; i++) {
            var ch = s.charCodeAt(i);
            if (ch > 512) {
                unicds += "\\u" + ch.toString(16);
            }
        }
        Uti.Msg(s, "unicode:", unicds);
    }

    function gen_search_strn_history() {
        if (undefined === document.m_SearchStrnInPage) document.m_SearchStrnInPage = ""
        var s = document.m_SearchStrnInPage

        var trs = ""
        var ar = MyStorage.getMostRecentSearchStrn()
        ar.forEach(function (strn) {
            var matcls = (s === strn.trim()) ? "SearchStrnInPage" : ""
            if (strn.trim().length > 0) {
                trs += (`<tr><td class='option ${matcls}'>${strn}</td></tr>`);
            }
        })

        //history
        //console.log(ret);
        $("#Tab_regex_history_lst tbody").html(trs).find(".option").bind("click", function () {
            $(this).toggleClass("hili");
            var s = $(this).text().trim();
            $("#sinput").val(s);
        });

        var str = MyStorage.getMostRecentSearchFile()
        $("#Tab_regex_history_lst").find("caption").text(str)
        $("#Tab_regex_history_lst").find("caption").bind("click", function () {
            //goto Cluster tab.
            groupsMenuMgr.sel_default("Cluster")
        })
    }

    $("#Btn_Prev, #Btn_Next").hide()
    $("#Btn_Prev").bind("click", function () {
        onclick_inpage_find_next(-1, this)
    })
    $("#Btn_Next").bind("click", function () {
        onclick_inpage_find_next(+1, this)
    })
    $("#Btn_InPage").bind("click", function () {
        $("#Btn_Prev, #Btn_Next").hide()
        var s = $("#sinput").val();
        var err = g_obt.set_inpage_findstrn(s)
        if (err) return alert(err)
        g_obt.Gen_output_table()

        document.m_SearchStrnInPage = s
        gen_search_strn_history()
        if (s.length === 0) return alert("reset ok.")
        MyStorage.addMostRecentSearchStrn(s)
        document.g_NextIndex = -1

        var nFound = $(".matInPage").length;
        if (nFound > 0) {
            $("#Btn_Prev, #Btn_Next").show()
        }
        $("#searchNextresult").text("0/" + nFound)
    })
    $("#Btn_InSvr").bind("click", function () {
        onclick_inSvr_BibleObj_search_str()
    })
    $("#searchNextresult").bind("click", function () {
        $(this).text("In:")
        $("#sinput").val("")
    })
    $("#RemoveSearchStrn").bind("click", function () {
        var ar = []
        $("#Tab_regex_history_lst").find(".option").each(function () {
            var tx = $(this).text().trim()
            if ($(this).hasClass("hili")) {
                $(this).parentsUntil("tbody").empty()
            } else {
                ar.push(tx)
            }
        })
        MyStorage.setMostRecentSearchStrn(ar)
    })
    gen_search_strn_history()
}





///////////
//////////
//////////
//////////
/////////
///////////
//////////
//////////
//////////
/////////

function OutputBibleTable() {
    this.m_tbid = "#oBible"
}
OutputBibleTable.prototype.incFontSize = function (n) {
    var fsz = MyStorage.getFontSize()
    fsz += n;
    $(this.m_tbid + " table .tx").css("font-size", fsz);
    $("#fontsize").text(fsz)

    MyStorage.setFontSize(fsz)
    g_aim.scrollToView_Vrs()
}
OutputBibleTable.prototype.onclick_ob_table = function (cbf) {
    this.incFontSize(0);

    $(this.m_tbid).bind("click", function () {
        if (cbf) cbf()
    })
}

OutputBibleTable.prototype.onclick_popupLabel = function (cbf) {
    this.m_onclick_popupLabel = cbf
}
OutputBibleTable.prototype.set_data = function (ret) {
    this.m_data = ret
}
OutputBibleTable.prototype.set_inpage_findstrn = function (str) {
    var ret = ""
    var InSvrSerachStr = $(".matInSvr:eq(0)").text()
    this.m_inpage_findstrn = ""

    if (str.length === 0) return ret
    if (InSvrSerachStr === str) {
        ret = "already have for in Svr"
    } else {
        this.m_inpage_findstrn = str
    }
    return ret
}
OutputBibleTable.prototype.Set_Event_output_table = function (tbid) {
    var _THIS = this;

    $(tbid).find(".popupclicklabel").bind("click", function (evt) {
        evt.stopImmediatePropagation()

        //solve confliction between toggle and hili
        var alreadyHili = $(this)[0].classList.contains('bcvMark')
        $(".bcvMark").removeClass("bcvMark");
        $(this).addClass("bcvMark");

        var bcr = $(this)[0].getBoundingClientRect();
        console.log(bcr)

        bcr.m_alreadyHili = alreadyHili
        bcr.m_y = bcr.y + window.scrollY + $(this).height() + 5;
        bcr.m_bcv = $(this).attr("title")
        bcr.m_txuid = $(this).attr("txuid")
        bcr.m_strTag = $(this).text();

        var ret = Uti.parse_bcv(bcr.m_strTag)
        if (!ret) {
            bcr.m_rev = bcr.m_strTag
        }
        bcr.bcvParser = ret = Uti.parse_bcv(bcr.m_bcv)
        bcr.m_ouTxtStr = ret.getxt4outOj(_THIS.m_data.out.data, bcr.m_rev)
        bcr.m_outxtObj = ret.getxt4outOj(_THIS.m_data.out.data)
        bcr.m_clickedLabel = this

        _THIS.m_onclick_popupLabel(bcr)

    });


    $(tbid).find(".tx").bind("keydown", function () {
        $(this).addClass("edit_keydown");
    });


    $(tbid).find(".tx").bind("click", function (evt) {
        evt.stopImmediatePropagation();

        $(this).toggleClass("hiliVrsTxt");

        //CopyTextToClipboard
        var txt = $(this).text();
        var bcv = $(this).parentsUntil("tbody").find("a.bcvTag").text();
        var rev = $(this).prev().text()
        txt = `"${txt}" (${bcv} ${rev})`;


        Uti.Msg(txt);
        $("#divPopupMenu").hide()
    });
}
OutputBibleTable.prototype.Gen_output_table = function (cbf) {

    var _THIS = this;
    var tb = this.create_htm_table_str();
    Uti.Msg("tot_rows:", tb.size);
    if (cbf) cbf(tb.size)
    $(this.m_tbid).html(tb.htm);

    this.Set_Event_output_table(this.m_tbid)

    this.incFontSize(0)
}

OutputBibleTable.prototype.update_table_tr = function (ret, par) {
    var ret = this.create_trs(ret.out.data)
    var trID = "#" + par.BCVtagClusterInfo.trID

    $(trID).find("td").remove()
    $(trID).html($(ret.trs).find("td"));
    this.Set_Event_output_table(trID)
    return;
}
OutputBibleTable.prototype.get_matched_txt = function (txt) {
    //ret = this.convert_rbcv_2_bcvRobj(ret)
    if (!this.m_inpage_findstrn) return txt
    var findstrn = this.m_inpage_findstrn
    var reg = new RegExp(findstrn, "g")

    var mat = txt.match(reg)
    if (mat) {
        mat.forEach(function (val) {
            var rep = `<font class='matInPage'>${findstrn}</font>`
            txt = txt.replace(reg, rep)
        })
    }
    return txt

}
OutputBibleTable.prototype.create_htm_table_str = function () {
    //ret = this.convert_rbcv_2_bcvRobj(ret)
    var _THIS = this
    if (!this.m_data || !this.m_data.out || !this.m_data.out.data) {
        return { htm: "", size: 0 };
    }

    console.log("result:", this.m_data.out.result)
    var ret = this.create_trs(this.m_data.out.data)

    var s = "<table id='BibOut' border='1'>";
    s += `<caption><p/><p>TotRows=${ret.size}</p></caption>`;
    s += "<thead><th>#</th></thead>";
    s += "<tbody>";
    s += ret.trs;

    s += "</tbody></table>";
    ret.htm = s
    return ret
}
OutputBibleTable.prototype.create_trs = function (odat) {
    //ret = this.convert_rbcv_2_bcvRobj(ret)
    var _THIS = this
    if (!odat) {
        return { trs: "", size: 0 };
    }

    //console.log("result:", this.m_data.out.result)
    var idx = 0, trs = "", uuid = "";
    $.each(odat, function (vol, chpObj) {
        $.each(chpObj, function (chp, vrsObj) {
            $.each(vrsObj, function (vrs, val) {
                //console.log("typeof val=", typeof val);
                idx++;
                var sbcv = `${vol}${chp}:${vrs}`;
                var BcvTag = `<a class='popupclicklabel bcvTag' title='${sbcv}'>${sbcv}</a>`
                trs += `<tr><td>${BcvTag}`;
                switch (typeof val) {
                    case "object"://trn
                        $.each(val, function (revId, txt) {
                            txt = _THIS.get_matched_txt(txt)

                            var htmtag = 'a'
                            if (revId.match(/^_[a-zA-Z]/)) {//E.g. "NIV",  "_myNote"
                                htmtag = 'div'
                                txt = Uti.convert_std_bcv_in_text_To_linked(txt)
                            }

                            var clsname = `class='tx tx${revId}'`
                            if (CNST.OT_Bkc_Ary.indexOf(vol) >= 0 && revId === 'H_G') {
                                clsname = `dir='rtl' class='tx tx${revId} tx_OT'` //
                            }
                            uuid = `${revId}_${vol}_${chp}_${vrs}`;
                            var revTag = `<sup txuid='${uuid}' class='popupclicklabel revTag' title='${sbcv}'>${revId}</sup>`
                            var vrsTxt = `<${htmtag} id='${uuid}' ${clsname}>${txt}</${htmtag}>`
                            trs += `<div>${revTag}${vrsTxt}</div>`;
                        });
                        break;
                    case "string":
                        trs += "<div>" + val + "</div>";
                        break;
                }
                trs += "</td></tr>";
            });
        });
    });
    return { trs: trs, size: idx };
}
var g_aim = new AppInstancesManager();
var g_obt = new OutputBibleTable()


















var Uti = {
    Msg_Idx: 0,
    Msg: function (...args) {
        var str = ""
        args.forEach(function (dat) {
            if ("object" === typeof dat) {
                str += JSON.stringify(dat, null, 4);
            } else {
                str += dat
            }
            str += " "
        })


        var oldtxt = $("#txtarea").val().substr(0, 7000)
        var results = `[${Uti.Msg_Idx++}]\n${str}\n\n\n` + oldtxt

        $("#txtarea").val(results);
    },
    set_menuContainer_color: function (ret) {
        $("#menuContainer, #passcode, #repopath").removeClass("menuContainer_red").removeClass("menuContainer_yellow").removeClass("menuContainer_green")
        if (ret.out.state) {
            if (ret.out.state.bEditable <= 0) {
                $("#menuContainer, #repopath").addClass("menuContainer_red")
                alert("Config Repository Invalid. \n- Editing will not work.")
            } else {
                if (ret.out.state.bRepositable <= 0) {
                    $("#menuContainer, #passcode").addClass("menuContainer_yellow")
                } else {
                    $("#menuContainer").addClass("menuContainer_green")
                }
            }
        }else{
            $("#menuContainer, #repopath").addClass("menuContainer_red")
        }
    },
    show_save_results:function(ret){
        Uti.Msg("ret.out.save_res:", ret.out.save_res);//,null, 4))
        var msg = "failed to save.", clr = "red"
        if (ret.out.save_res && ret.out.save_res.saved_size) {
            clr = "lightgreen", msg = `wrote:${ret.out.save_res.saved_size}(B)`
        }
        var sta = ret.out.state
        if (sta) {
            var colr = (sta && 1 === sta.bRepositable) ? "lightgreen" : "yellow"
            var msg2 = `bRepositable:${sta.bRepositable}`
            var push_res = ret.out.git_push_res.desc
            var colr = (sta && 1 === sta.bRepositable) ? "lightgreen" : "yellow"
            var msg2 = `bRepositable:${sta.bRepositable}`

            $("#outConfig").html(`<font color='${clr}'>${msg}</font>, <font color='${colr}'>${push_res}</font>`)
        } else {
            $("#outConfig").html(`<font color='red'>Failed: Invalid Repository</font>`)
        }
    },


    addonTopOfAry: function (targetary, addon) {
        var ary = addon
        if ("string" === typeof addon) {
            ary = [addon]
        }
        for (var i = 0; i < ary.length; i++) {
            var idx = targetary.indexOf(ary[i])
            if (idx >= 0) targetary.splice(idx, 1) //remove at idx, size=1
            targetary.unshift(ary[i]);//on top
        }
        //targetary = targetary.slice(0, 100) //:max len 100. fetch idx range [0, 100].
    },


    parse_bcv: function (sbcv, txt, outOj) {
        if (!sbcv) return null

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
            console.log("not a std bcv:", sbcv)
            return null
        }
        ///////validation for std bcv.
        var err = ""
        if (undefined === _Max_struct[ret.vol]) {
            err = `bkc not exist: ${ret.vol}`
        } else if (undefined === _Max_struct[ret.vol][ret.chp]) {
            err = `chp not exist: ${ret.chp}`
        } else if (undefined === _Max_struct[ret.vol][ret.chp][ret.vrs]) {
            err = `vrs not exist: ${ret.vrs}`
        }
        if (err.length > 0) {
            Uti.Msg("bcv parse err=", err)
            return null
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
        if (outOj) {
            if (!outOj[ret.vol]) outOj[ret.vol] = {}
            if (!outOj[ret.vol][ret.chp]) outOj[ret.vol][ret.chp] = {}
            outOj[ret.vol][ret.chp][ret.vrs] = txt
        }

        ret.bcvObj = obj
        ret.getxt4outOj = function (outOj, trn) {
            if (!trn) {
                return outOj[this.vol][this.chp][this.vrs]
            } else {
                return outOj[this.vol][this.chp][this.vrs][trn]
            }
        }

        return ret;
    },
    htmlDecode: function (value) {
        return $("<textarea/>").html(value).text();
    },

    htmlEncode: function (value) {
        return $('<textarea/>').text(value).html();
    },
    BCV_RegPat: "([1-3A-Z][a-zA-Z][a-z][0-9]+[\:][0-9]+)",
    convert_std_bcv_in_text_To_linked: function (str) {
        //Uti.Msg(str)
        str = this.convert_std_bcv_in_text_To_unlinked(str)

        var reg = new RegExp(this.BCV_RegPat, "g")
        str = str.replace(reg, '<a href="#$1">$1</a>')
        //Uti.Msg(str)
        return str

        var ret = Uti.convert_std_bcv_str_To_uniq_biblicalseq_splitted_ary(str)
        ret.biblical_order_splitted_ary.forEach(function (v, i) {
            var sln = `$1<a href='#${v}'>${v}</a>`
            var reg = new RegExp(`[^\>\#\;]${v}`, "g") //issue: in <div>Gen1:1</div>
            reg = new RegExp(`(?:(?![v][\>]))${v}`, "g")  // negative lookahead =(?!regex here).
            reg = new RegExp(`(?:(?![v][\>]))${v}`, "g")  // (?: # begin non-capturing group
            reg = new RegExp(`(?:(?!([\"\'][\>])([\"\'][\#])))${v}`, "g")  // (?: # begin non-capturing group
            //reg = new RegExp(`(?:(?![\'][\#]))${v}`, "g")  // (?: # begin non-capturing group
            //reg = new RegExp(`(?:(?![\'][\#])(?![\'][\>]))${v}`, "g") 
            reg = new RegExp(`(?:([^\>\#\;]))(${v})`, "g")  //bug: div>Gen1:1 
            reg = new RegExp(`(?:((div[>])|(.[^\>\#\;])))(${v})`, "g")  //bug: div>Gen1:1 
            reg = new RegExp(`(([\"\']\s{0,}[\>]\s{0,}){0,}|([^\>\#]))(${v})`, "g")  //seems fix bug: div>Gen1:1 
            reg = new RegExp(`([^\>\#])${v}|^${v}`, "g")  //fixed for crossRef
            //reg = new RegExp(`${v}(?:((?!([\<][\/]a[\>])(?!([\"\'])))`, "g") 
            //reg = new RegExp(`(?:(?!(${sln}))`, "g")  
            str = str.replace(reg, sln)
        })
        Uti.Msg(str)
        return str
    },
    convert_std_bcv_in_text_To_unlinked: function (str) {
        //Uti.Msg(str)
        //<a href="#3Jn1:3">3Jn1:3</a> 
        //Note:  \\1  =>regex backreferences
        var reg = new RegExp("<a href=[\"\'][\#]" + this.BCV_RegPat + "[\"\']>\\1<[\/]a>", "g")
        str = str.replace(reg, "$1")

        //Uti.Msg(str)
        return str
    },
    convert_std_uniq_biblicalseq_splitted_ary_To_dashed_strn: function (ary) {
        var str = ary.join(", ")
        var ret = Uti.convert_std_bcv_str_To_uniq_biblicalseq_splitted_ary(str)
        var ary = ret.biblical_order_splitted_ary
        ary.push("")

        //biblical-sort
        //consectives are compressed to dash. Gen1:1,Gen1:2,Gen1:3 ==>> Gen1:1-Gen1:3
        var dashary = []
        for (var i = 0; i < ary.length; i++) {
            var bcv = ary[i]
            var ret = Uti.parse_bcv(bcv)

            var iStart = i, ilastConsective = -1
            for (++i; i <= ary.length - 1; i++) {
                var nextbcv = ary[i]
                var next = Uti.parse_bcv(nextbcv)
                if (!next) {
                    --i;
                    break
                }
                if (1 + parseInt(ret.vrs) === parseInt(next.vrs) && ret.chp === next.chp && ret.vol === next.vol) {
                    ilastConsective = i
                    ret = next
                } else {
                    --i;//restore back.
                    break
                }
            }
            if (ilastConsective > 0) {
                dashary.push(ary[iStart] + "-" + ary[ilastConsective])
                ilastConsective = -1
            } else {
                dashary.push(ary[iStart])
            }
        }

        return dashary.join(", ")
    },
    convert_std_bcv_str_To_uniq_biblicalseq_splitted_ary: function (str) {
        function _check_std_bcv(str) {
            var regexp = new RegExp(/(\w{3}\s{0,}\d+\:\d+)/g)
            var regexp = new RegExp(/(\w{3}\s{0,}\d+\:\d+)\-(\w{3}\s{0,}\d+\:\d+)|(\w{3}\s{0,}\d+\:\d+)/g)
            // Genesis 1:2
            var regexp = new RegExp(/((\w{3}\s*\d+\:\d+)\-(\w{3}\s*\d+\:\d+))|(\w{3}\s*\d+\:\d+)/g)
            var pad3 = []
            var mat = str.match(regexp)
            if (mat) {
                //console.log(mat)
                Uti.Msg(mat)
                for (var i = 0; i < mat.length; i++) {
                    var bcvStr = mat[i].trim()
                    var ar2 = bcvStr.split("-"); //case 'Gen1:1-Gen1:12'
                    var hdbcv = ar2[0].trim()
                    var ret = Uti.parse_bcv(hdbcv, "")
                    if (ret) {
                        var fixedbcv = ret.pad3.bcv
                        if (ar2.length >= 2) fixedbcv += "-" + ar2[1]
                        if (pad3.indexOf(fixedbcv) < 0) {
                            pad3.push(fixedbcv)
                        }
                    }
                }
            } else {
                Uti.Msg("not find")
            }
            return { std: mat, pad3: pad3 }
        }
        function _biblicalOrder(bcvList) {
            bcvList.sort()
            var ar = []
            Object.keys(_Max_struct).forEach(function (bkn) {
                bcvList.forEach(function (bcv) {
                    if (bcv.indexOf(bkn) === 0) {
                        var ar2 = bcv.split("-")
                        var hdbcv = ar2[0].trim()
                        var ret = Uti.parse_bcv(hdbcv, "")
                        var stdbcv = ret.std_bcv
                        if (ar2.length >= 2) stdbcv += "-" + ar2[1]
                        ar.push(stdbcv)
                    }
                })
            })
            return ar
        }
        function get_Max_struct_stdbcv_ary() {
            var ar = []
            for (const [bkc, chpObj] of Object.entries(_Max_struct)) {
                for (const [chp, vrsObj] of Object.entries(chpObj)) {
                    for (const [vrs, txt] of Object.entries(vrsObj)) {
                        var stdbcv = `${bkc}${chp}:${vrs}`
                        ar.push(stdbcv)
                    }
                }
            }
            return ar
        }
        function _dash2ary(stdbcv) {
            var retary = []
            var ar2 = stdbcv.split("-")
            var stdbcv = ar2[0].trim()
            if (ar2.length === 1) {
                retary.push(stdbcv)
            } else {
                var end_bcv = ar2[1].trim()


            }
            return retary
        }
        function _deplore_dash(stdbcvAry) {
            var ar = []
            stdbcvAry.forEach(function (stdbcv) {
                var ar2 = stdbcv.split("-")
                var stdbcv = ar2[0].trim()
                if (ar2.length === 1) {
                    ar.push(stdbcv)
                } else {
                    var endbcv = ar2[1].trim()
                    var maxary = get_Max_struct_stdbcv_ary()
                    var indx0 = maxary.indexOf(stdbcv)
                    var indx1 = maxary.indexOf(endbcv)
                    var ary = maxary.slice(indx0, indx1 + 1)
                    ary.forEach(function (bcv) {
                        ar.push(bcv)
                    })
                }
            })
            return ar
        }

        //_Max_struct
        //std case1: "Gen23:7, Gen23:5, 1Sa26:6, Gen25:10, Gen49:30, Gen27:46, Gen10:15, 2Sa23:39" (Gen23:3 _myCrossRef)
        //std case2: "Gen1:3-Gen23:9, Gen23:5"
        //var hdry = _get_list(str)
        var ret = _check_std_bcv(str)
        ret.biblical_order_dash_ary = _biblicalOrder(ret.pad3)
        ret.biblical_order_splitted_ary = _deplore_dash(ret.biblical_order_dash_ary)
        return ret
    },


    open_child_window: function (htm_fname, cbf) {
        const urlParams = new URLSearchParams(window.location.search);
        ip = urlParams.get('ip');
        var parm = (ip) ? `ip=${ip}` : ""
        window.open(`./${htm_fname}?${parm}`)

        window.addEventListener('message', function (e) {
            var key = e.message ? 'message' : 'data';
            var data = e[key];
            //run function//
            console.log("rev fr Child window.opener.", data)
            //MyStorage.Repositories().add(data)
            if (cbf) cbf(data)
        }, false);
    },

    Jsonpster_crossloader: function (ip) {
        if (!ip) {
            const urlParams = new URLSearchParams(window.location.search);
            ip = urlParams.get('ip');
            if (!ip) {
                ip = window.location.host
            }
            if (!ip) {
                ip = window.location.hostname
            }
            if (!ip) {
                return alert("[missed in url] ?ip=x.x.x.x")
            }
            var idx = window.location.href.indexOf("#") //case: ?ip=1.1.1.1#Gen1:1
            var bcv = ""
            if (idx >= 0) {
                //ip = window.location.href.substr(0, idx)
                bcv = window.location.href.substr(1 + idx)
                window.m_bcv = bcv
            }
            console.log("ip,pcv:", ip, bcv)
        }

        if ("undefined" != typeof RestApi) {
            return console.log("Jsonpster is already loaded. Ignore", ip)
        }

        var e = document.createElement("script");
        e.src = `http://${ip}:7778/Jsonpster/`;
        document.body.appendChild(e);
        console.log("crossload:", e.src)
    },

    copyTextToClipboard: function (text) {
        var textArea = document.createElement("textarea");

        //
        // *** This styling is an extra step which is likely not required. ***
        //
        // Why is it here? To ensure:
        // 1. the element is able to have focus and selection.
        // 2. if the element was to flash render it has minimal visual impact.
        // 3. less flakyness with selection and copying which **might** occur if
        //    the textarea element is not visible.
        //
        // The likelihood is the element won't even render, not even a
        // flash, so some of these are just precautions. However in
        // Internet Explorer the element is visible whilst the popup
        // box asking the user for permission for the web page to
        // copy to the clipboard.
        //

        // Place in the top-left corner of screen regardless of scroll position.
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = '2em';
        textArea.style.height = '2em';

        // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = 0;

        // Clean up any borders.
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';

        // Avoid flash of the white box if rendered for any reason.
        textArea.style.background = 'transparent';


        textArea.value = text;

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
            Uti.Msg('Copying text command was ' + msg)
        } catch (err) {
            console.log('Oops, unable to copy');
            Uti.Msg('Oops, unable to copy')
        }

        document.body.removeChild(textArea);

    },
    copy2clipboard: function (text, ele) {
        //return this.copyTextToClipboard(text)
        $("#txt_copy2clicpboard").val(text).select().focus();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
            Uti.Msg('Copying text command was ' + msg)
        } catch (err) {
            console.log('Oops, unable to copy');
            Uti.Msg('Oops, unable to copy')
        }
        $("#txt_copy2clicpboard").blur()
        $("body").focus()
        return
        const textarea = document.createElement('textarea')

        if (!ele) {
            //document.body.appendChild(textarea)
        } else {
            //$(ele).append(textarea)
        }
        document.body.appendChild(textarea);//.css("position:fixed;top:0;left:0")
        textarea.style.position = "fixed";
        textarea.style.top = "0px";
        textarea.style.left = "0px";
        //textarea.style.left = "0";
        textarea.value = text
        textarea.select()
        document.execCommand('copy')
        textarea.remove()
    },
    jq_post: function () {
        $.post(Jsonpster.Url(),
            {
                name: "Donald Duck",
                city: "Duckburg"
            },
            function (data, status) {
                alert("Data: " + data + "\nStatus: " + status);
            });
    }


};////  Uti
////////////////////////////////////
const CNST = {
}



var BibleInputMenuContainer = `
<style>
</style>
<!----------------------------->
<div id="divPopupMenu">
    <table id='xxrefslist' border="1" align="left">
    
    <tbody id="divPopupMenu_BcvTag">
        <tr>
            <td>
                <a id="blb" ref="https://www.blueletterbible.org/kjv/">blueletterbible.org</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="qbible_com" ref="http://www.qbible.com/" sample="hebrew-old-testament/genesis/50.html#1" title='http://www.qbible.com/hebrew-old-testament/genesis/50.html#1'>qbible.com</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="h_g" ref="../../../../bible_concordance/rel/hgsbible/hgb/" title='Hebrew_Greek'>h_g</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="gtw" ref="https://www.biblegateway.com/passage/?search=" title='biblegateway.com'>gateway</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="studylight" ref="https://www.studylight.org/commentary/" title='studylight.org'>studylight</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="ccel_org" ref="http://www.ccel.org/study/" title='ChristianClassicEtherealLib'>ccel</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="crossReference" ref="https://www.openbible.info/labs/cross-references/search?q=" title='cross-references'>cross-references</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="BibleInput" ref="#" title='self open'>OpenNewWindow</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="Cluster_Documents" title='add tags'>Re-Cluster</a>
            </td>
        </tr>
    </tbody>
    <tbody id="divPopupMenu_EdiTag">
        <tr>
            <td>
                <a class="EdiTag_ToggleHideShow">Hide</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="RevTag_Edit_Local" disableEdit="Disable Edit" enableEdit="Enable Edit">Enable Edit</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="RevTag_Edit_External" target="_blank" href="myNoteEditor.htm">External Editor</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="RevTag_Save">Save</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="RevTag_Load">Load</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="RevTag_Info">user</a>
            </td>
        </tr>
        
    </tbody>
    <tbody id="divPopupMenu_RevTag">
        <tr>
            <td>
                <a class="EdiTag_ToggleHideShow">Hide</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="Copy2clipboard">Copy2Clipboard</a>
            </td>
        </tr>
    </tbody>
    <caption>--</caption>
    </table>
</div>

<!--------------------------------------->


<div id="MainMenuToggler">
    <a id="bk_name">Select A Book</a>
    <a id="minus_ChpVal" op='—'>--</a>
    <div id='chp_num'>chap</div><a id="plus_ChpVal"> : </a><div id='vrs_num'>ver</div>
</div>

<!----------------------------->

<div id="menuContainer">
    <div id="BibInputMenuHolder">
        <div id="GroupsContainer" style="display:visual">


            <div class="GrpMenu" id="grp_Keyboard" style="float:left;display:none;">
                <table border="1">
                    <tbody id="SingleKeywordsBody">
                    </tbody>
                    <tbody id='DigitOfChapt'>
                    </tbody>
                    <tbody id='DigitOfVerse'>
                    </tbody>
                </table>
                
            </div>

            <!----------------------------->

            <div class="GrpMenu" id="grp_Cluster" style="float:left;display:none;">
                <table border="1" style="float:left;display:" id="Tab_CatagryOfBooks">
                    <caption class='' id='' title='Catagory of Books in Bible'>Category</caption>
                    <thead id=""></thead>
                    <tbody id=''>
                        <tr>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <table id="Tab_NamesOfBibleDocuments" border="1" style="float:left;">
                    <caption><button title='Names of Bible' Rev="select" Seq="moveUp" Dn="moveDn">Documents</button></caption>
                    <thead id=""></thead>
                    <tbody>
                        <tr>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <table id="Tab_MostRecent_BCV" border="1" style="float:left;">
                    <caption>
                       <button>RecentBooks</button>
                    </caption>
                    <thead></thead>
                    <tbody id='RecentBooks'>
                        <tr>
                            <td>
                                Pleas click H button <br>for History.<br>
                                <br>
                                Pleas click ^ button <br>sort by str.<br>
                            </td>
                        </tr>
                    </tbody>
                    <tbody id='RecentMarks'>
                        <tr>
                            <td>
                                Pleas click H button <br>for History.<br>
                                <br>
                                Pleas click ^ button <br>sort by str.<br>
                            </td>
                        </tr>
                    </tbody>
                    <tbody id='MemoryVerse'>
                    </tbody>
                    <caption>
                       <button id="clearUnse" title='clear unselected items'>x</button>
                       <button id="toggleSel" title='toggle selected and unselected'>~</button>
                    </caption>
                </table>
            </div>

            <!----------------------------->

            <div class="GrpMenu" id="grp_Search" style="float:left;display:none;">

                <input id="sinput" cols='50' onkeyup="" ></input><br>
                <div id="searchNextresult" style="width:50px;float:left;">In:</div>
                <button id="Btn_InSvr" title="search on servr">Svr</button>
                <button id="Btn_InPage" title="search on local table">Page</button>
                <button id="Btn_Prev"  title="hili prev in page">Prev</button>
                <button id="Btn_Next"  title="hili next in page">Next</button>
                
                <br>  
                <table id="Tab_regex_history_lst" border='1' style="float:left;">
                <caption>CUVS</caption>
                <tbody>
                    <tr>
                        <td>
                            click search results<br>
                            to show history serch<br>                           

                        </td>
                    </tr>
                </tbody>
            </table>
            <br>
            <button id="RemoveSearchStrn">Delete selected</button>
            </div>

            <!----------------------------->

            <div class="GrpMenu" id="grp_DevTool"  style="float:left;display:none;">
                <button id="Check_bcv">Check(bcv)</button>
                <a id="txtdiv"></a>
                
                <br>
                <button onclick="$('#txtarea').val('');" title='clearout txt'>x</button>
                <a target='_blank' href='../index.htm'>ref</a> | <a href='https://wdingbox.github.io/ham12/'>Home</a>
                | <a id='NewPage' target='_blank'>New</a><br>
                
                <textarea id="txtarea" cols='40' rows='20'  value='search results...' title='log.'>
                </textarea><br>

            </div>

            <!----------------------------->

            <div class="GrpMenu" id="grp_Config"  style="float:left;display:none;">
                
             
                <table id='' border="1" style="width:100%;">
                    <thead>
                        <tr>
                    
                            <td>desc</td>
                            <td>Setting</td>
                            
                        </tr>
                    </thead>
                    <tbody id="">
                        <tr>
                            <td id="account_history">User<br>Info</td>
                            <td>
                            <a>Repository</a>: 
                            <div id="repository_assitance">
                            <a id="account_default"> default</a> | 
                            <a id="account_helper">help</a>
                            </div>
                            <br>
                            <textarea id="repopath" value='https://github.com/wdingbox/biblestudynote_pub_test.git' placeholder='https://github.com/wdingbox/biblestudynote_pub_test.git' ></textarea>
                            <br>
                            <a>Description</a>: 
                            <span id="repository_description">
                            <a id="account_date">(optional)</a> 
                            </span>
                            <br>
                            <textarea id="repodesc" value='JourneyGroup' placeholder='2020-12-31, JourneyGroup' >JourneyGroup</textarea>
                            <br>
                            <a id="passcode_toggler">Passcode:</a> 
                            <span id="repository_description">
                            <a id="account_date">(optional)</a> 
                            </span><br>
                            <input id="passcode" type="password" value=''></input><br>
                            <button id="account_set">set</button>
                            <a id="account_set_info"></a>
                            </td>
                            
                        </tr>
                       
                        <tr>
                            <td>Font</td>
                            <td>Size:
                            <button onclick="g_obt.incFontSize(-2);" title='font-size minus'>-</button>
                            <a id='fontsize'></a>
                            <button onclick="g_obt.incFontSize(2);" title='font-size plus'>+</button>
                            </td>
                             
                        </tr>
                        <tr>
                         
                            <td>Lang</td>
                            <td><select id="LanguageSel" onchange="MyStorage.onChange_BookNameLanguage()"><option>English</option><option>Chinese</option><option>India</option></select></td>
                        </tr>
                        <tr>
                         
                            <td>Storage</td>
                            <td>
                            <input type="radio" onclick="MyStorage.clear(); $(this).prop("checked",false);" title='clear up storage'>Clear</input>
                            <input type="radio" id="StorageRepo_save" title='clear up storage'>SaveToRepos</input>  
                            <a type="radio" id="StorageRepo_load" title='clear up storage'></a>
                            <a type="radio" id="StorageRepo_Signout title='clear up storage'>SignOut</a>
                            <a id="Storage_local_repos_exchange"></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div id="outConfig" style="display:none"></div>
            

               
            
            </div> 
            <!--------- end of GroupsContainer ------>
        </div>
    </div>
</div>
<hr />





<!----------------------------->
<!----------------------------->
<table id="Tab_OutputBooksList" border="1">
    <caption></caption>
    <thead id="">
    </thead>
    <tbody>
    </tbody>
</table>
<!----------------------------->


<div id='oBible'>----</div>
<textarea id="txt_copy2clicpboard" style="position:fixed;width:180px;right:-175px;top:0px;padding:0;">
        `;//////backtick for multiple lines. 



CNST.FnameOfBibleObj =
{
    "BBE": "Basic Bible in English",
    "CUVS": "Chinese Union Version Simplified, 官話和合本, 1919",
    "CUVsen": "CUV Simplied with English Name",
    "CUVpy": "Chinese Union Version PinYing",
    "ESV": "English Standard Version",
    "H_G": "Hebrew and Greek",
    "KJV": "King James Version",
    "KJV_Jw": "King James Version Jesus' Words",
    "NIV": "New International Version",
    "NIV_Jw": "New International Version Jesus' Words",
    "STUS": "Studium Biblicum Version by Catholic,1968",
    "WLVS": "Wen Li Version. 文理和合本新約全書於1906年出版，新舊約全書於1919年出版.修訂新約後的新舊約全書，於1923年出版，至1934年印行最後一版, 原本分為官話、深文理、淺文理三種譯本，稱為「聖經唯一，譯本則三」。後來深淺文理合併為文理和合本 https://zh.wikisource.org/wiki/%E8%81%96%E7%B6%93_(%E5%92%8C%E5%90%88%E6%9C%AC) \n\nFor 1895 新約淺文理(包爾騰(John Shaw Burdon)、柏亨利(Henry Blodget)) https://bible.fhl.net/ob/nob.html?book=8 ",
    "cross_references": "cross-references",
    "_myCrossRef": "self modified cross-references",
    "_myNote": "personal biblical study notes",
    "_myTakeaway": "personal page, prayer, preach, prophect, paper, project,,,"
};

CNST.BiBookName = {
    "Gen": ['Genesis', 'genesis', '创世纪',],
    "Exo": ['Exodus', 'exodus', '出埃及记',],
    "Lev": ['Leviticus', 'leviticus', '利未记',],
    "Num": ['Numbers', 'numbers', '民数记',],
    "Deu": ['Deuteronomy', 'deuteronomy', '申命记',],
    "Jos": ['Joshua', 'joshua', '约书亚记',],
    "Jug": ['Judges', 'judges', '士师记',],
    "Rut": ['Ruth', 'ruth', '路得记',],
    "1Sa": ['1_Samuel', '1-samuel', '撒母耳记上',],
    "2Sa": ['2_Samuel', '2-samuel', '撒母耳记下',],
    "1Ki": ['1_Kings', '1-kings', '列王记上',],
    "2Ki": ['2_Kings', '2-kings', '列王记下',],
    "1Ch": ['1_Chronicles', '1-chronicles', '历代志上',],
    "2Ch": ['2_Chronicles', '2-chronicles', '历代志下',],
    "Ezr": ['Ezra', 'ezra', '以斯拉记',],
    "Neh": ['Nehemiah', 'nehemiah', '尼希米记',],
    "Est": ['Esther', 'esther', '以斯帖记',],
    "Job": ['Job', 'job', '约伯记',],
    "Psm": ['Psalm', 'psalm', '诗篇',],
    "Pro": ['Proverbs', 'proverbs', '箴言',],
    "Ecc": ['Ecclesiastes', 'ecclesiastes', '传道书',],
    "Son": ['SongOfSolomon', 'song-of-solomon', '雅歌',],
    "Isa": ['Isaiah', 'isaiah', '以赛亚书',],
    "Jer": ['Jeremiah', 'jeremiah', '耶利米书',],
    "Lam": ['Lamentations', 'lamentations', '耶利米哀歌',],
    "Eze": ['Ezekiel', 'ezekiel', '以西结书',],
    "Dan": ['Daniel', 'daniel', '但以理书',],
    "Hos": ['Hosea', 'hosea', '何西阿书',],
    "Joe": ['Joel', 'joel', '约珥书',],
    "Amo": ['Amos', 'amos', '阿摩司书',],
    "Oba": ['Obadiah', 'obadiah', '俄巴底亚书',],
    "Jon": ['Jonah', 'jonah', '约拿书',],
    "Mic": ['Micah', 'micah', '弥迦书',],
    "Nah": ['Nahum', 'nahum', '那鸿书',],
    "Hab": ['Habakkuk', 'habakkuk', '哈巴谷书',],
    "Zep": ['Zephaniah', 'zephaniah', '西番雅书',],
    "Hag": ['Haggai', 'haggai', '哈该书',],
    "Zec": ['Zechariah', 'zechariah', '撒迦利亚',],
    "Mal": ['Malachi', 'malachi', '玛拉基书',],
    "Mat": ['Matthew', 'matthew', '马太福音',],
    "Mak": ['Mark', 'mark', '马可福音',],
    "Luk": ['Luke', 'luke', '路加福音',],
    "Jhn": ['John', 'john', '约翰福音',],
    "Act": ['Acts', 'acts', '使徒行传',],
    "Rom": ['Romans', 'romans', '罗马书',],
    "1Co": ['1_Corinthians', '1-corinthians', '哥林多前书',],
    "2Co": ['2_Corinthians', '2-corinthians', '哥林多后书',],
    "Gal": ['Galatians', 'galatians', '加拉太书',],
    "Eph": ['Ephesians', 'ephesians', '以弗所书',],
    "Phl": ['Philippians', 'philippians', '腓立比书',],
    "Col": ['Colossians', 'colossians', '歌罗西书',],
    "1Ts": ['1_Thessalonians', '1-thessalonians', '帖撒罗尼迦前书',],
    "2Ts": ['2_Thessalonians', '2-thessalonians', '帖撒罗尼迦后书',],
    "1Ti": ['1_Timothy', '1-timothy', '提摩太前书',],
    "2Ti": ['2_Timothy', '2-timothy', '提摩太后书',],
    "Tit": ['Titus', 'titus', '提多书',],
    "Phm": ['Philemon', 'philemon', '腓利门书',],
    "Heb": ['Hebrews', 'hebrews', '希伯来书',],
    "Jas": ['James', 'james', '雅各书',],
    "1Pe": ['1_Peter', '1-peter', '彼得前书',],
    "2Pe": ['2_Peter', '2-peter', '彼得后书',],
    "1Jn": ['1_John', '1-john', '约翰一书',],
    "2Jn": ['2_John', '2-john', '约翰二书',],
    "3Jn": ['3_John', '3-john', '约翰三书',],
    "Jud": ['Jude', 'jude', '犹大书',],
    "Rev": ['Revelation', 'revelation', '启示录',],
};
CNST.BibVolNameEngChn = function (Vid) {
    var slan = MyStorage.getBookNameLanguage()
    switch (slan) {
        case "Chinese": return CNST.BiBookName[Vid][0] + " " + CNST.BiBookName[Vid][2];
    }
    return CNST.BiBookName[Vid][0]
};
CNST.isNT = function (Vid) {
    return (CNST.BibVol_OTorNT(Vid) === "t_NT")
};
CNST.BibVol_OTorNT = function (Vid) {
    if (CNST.OT_Bkc_Ary.indexOf(Vid) >= 0) {
        return "t_OT"
    }
    if (CNST.NT_Bkc_Ary.indexOf(Vid) >= 0) {
        return "t_NT"
    }
    return console.log("ERROR", Vid);
};
CNST.BibVolName_Studylight = function (Vid) {
    return CNST.BiBookName[Vid][1];
};
CNST.BibVolName_ccel = function (Vid) {
    return CNST.BiBookName[Vid][0];
};
CNST.BlueLetterBibleCode = {
    "Gen": "Gen",
    "Exo": "Exo",
    "Lev": "Lev",
    "Num": "Num",
    "Deu": "Deu",
    "Jos": "Jos",
    "Jug": "Jug",
    "Rut": "Rut",
    "1Sa": "1Sa",
    "2Sa": "2Sa",
    "1Ki": "1Ki",
    "2Ki": "2Ki",
    "1Ch": "1Ch",
    "2Ch": "2Ch",
    "Ezr": "Ezr",
    "Neh": "Neh",
    "Est": "Est",
    "Job": "Job",
    "Psm": "Psa",//
    "Pro": "Pro",
    "Ecc": "Ecc",
    "Son": "Son",
    "Isa": "Isa",
    "Jer": "Jer",
    "Lam": "Lam",
    "Eze": "Eze",
    "Dan": "Dan",
    "Hos": "Hos",
    "Joe": "Joe",
    "Amo": "Amo",
    "Oba": "Oba",
    "Jon": "Jon",
    "Mic": "Mic",
    "Nah": "Nah",
    "Hab": "Hab",
    "Zep": "Zep",
    "Hag": "Hag",
    "Zec": "Zec",
    "Mal": "Mal",
    "Mat": "Mat",
    "Mak": "Mak",
    "Luk": "Luk",
    "Jhn": "Jhn",
    "Act": "Act",
    "Rom": "Rom",
    "1Co": "1Co",
    "2Co": "2Co",
    "Gal": "Gal",
    "Eph": "Eph",
    "Phl": "Phl",
    "Col": "Col",
    "1Ts": "1Ts",
    "2Ts": "2Ts",
    "1Ti": "1Ti",
    "2Ti": "2Ti",
    "Tit": "Tit",
    "Phm": "Phm",
    "Heb": "Heb",
    "Jas": "Jas",
    "1Pe": "1Pe",
    "2Pe": "2Pe",
    "1Jn": "1Jn",
    "2Jn": "2Jn",
    "3Jn": "3Jn",
    "Jud": "Jud",
    "Rev": "Rev",
};//BookChapterVerseMax
CNST.BookID2IdxCode = {
    _Gen: ['01', 'h'],
    _Exo: ['02', 'h'],
    _Lev: ['03', 'h'],
    _Num: ['04', 'h'],
    _Deu: ['05', 'h'],
    _Jos: ['06', 'h'],
    _Jug: ['07', 'h'],
    _Rut: ['08', 'h'],
    _1Sa: ['09', 'h'],
    _2Sa: ['10', 'h'],
    _1Ki: ['11', 'h'],
    _2Ki: ['12', 'h'],
    _1Ch: ['13', 'h'],
    _2Ch: ['14', 'h'],
    _Ezr: ['15', 'h'],
    _Neh: ['16', 'h'],
    _Est: ['17', 'h'],
    _Job: ['18', 'h'],
    _Psm: ['19', 'h'],
    _Pro: ['20', 'h'],
    _Ecc: ['21', 'h'],
    _Son: ['22', 'h'],
    _Isa: ['23', 'h'],
    _Jer: ['24', 'h'],
    _Lam: ['25', 'h'],
    _Eze: ['26', 'h'],
    _Dan: ['27', 'h'],
    _Hos: ['28', 'h'],
    _Joe: ['29', 'h'],
    _Amo: ['30', 'h'],
    _Oba: ['31', 'h'],
    _Jon: ['32', 'h'],
    _Mic: ['33', 'h'],
    _Nah: ['34', 'h'],
    _Hab: ['35', 'h'],
    _Zep: ['36', 'h'],
    _Hag: ['37', 'h'],
    _Zec: ['38', 'h'],
    _Mal: ['39', 'h'],
    _Mat: ['40', 'b'],
    _Mak: ['41', 'b'],
    _Luk: ['42', 'b'],
    _Jhn: ['43', 'b'],
    _Act: ['44', 'b'],
    _Rom: ['45', 'b'],
    _1Co: ['46', 'b'],
    _2Co: ['47', 'b'],
    _Gal: ['48', 'b'],
    _Eph: ['49', 'b'],
    _Phl: ['50', 'b'],
    _Col: ['51', 'b'],
    _1Ts: ['52', 'b'],
    _2Ts: ['53', 'b'],
    _1Ti: ['54', 'b'],
    _2Ti: ['55', 'b'],
    _Tit: ['56', 'b'],
    _Phm: ['57', 'b'],
    _Heb: ['58', 'b'],
    _Jas: ['59', 'b'],
    _1Pe: ['60', 'b'],
    _2Pe: ['61', 'b'],
    _1Jn: ['62', 'b'],
    _2Jn: ['63', 'b'],
    _3Jn: ['64', 'b'],
    _Jud: ['65', 'b'],
    _Rev: ['66', 'b'],
};
CNST.OT_Bkc_Ary = [
    "Gen",
    "Exo",
    "Lev",
    "Num",
    "Deu",
    "Jos",
    "Jug",
    "Rut",
    "1Sa",
    "2Sa",
    "1Ki",
    "2Ki",
    "1Ch",
    "2Ch",
    "Ezr",
    "Neh",
    "Est",
    "Job",
    "Psm",
    "Pro",
    "Ecc",
    "Son",
    "Isa",
    "Jer",
    "Lam",
    "Eze",
    "Dan",
    "Hos",
    "Joe",
    "Amo",
    "Oba",
    "Jon",
    "Mic",
    "Nah",
    "Hab",
    "Zep",
    "Hag",
    "Zec",
    "Mal"
];
CNST.NT_Bkc_Ary = [
    "Mat",
    "Mak",
    "Luk",
    "Jhn",
    "Act",
    "Rom",
    "1Co",
    "2Co",
    "Gal",
    "Eph",
    "Phl",
    "Col",
    "1Ts",
    "2Ts",
    "1Ti",
    "2Ti",
    "Tit",
    "Phm",
    "Heb",
    "Jas",
    "1Pe",
    "2Pe",
    "1Jn",
    "2Jn",
    "3Jn",
    "Jud",
    "Rev"
];
CNST.Cat2VolArr = {
    "OT": CNST.OT_Bkc_Ary,
    "Moses": ["Gen", "Exo", "Lev", "Num", "Deu"],
    "History": ["Jos", "Jug", "Rut", "1Sa", "2Sa", "1Ki", "2Ki", "1Ch", "2Ch", "Ezr", "Neh", "Est"],
    "Literature": ["Job", "Psm", "Pro", "Ecc", "Son"],
    "MajProph": ["Isa", "Jer", "Lam", "Eze", "Dan"],
    "MinProph": ["Joe", "Amo", "Oba", "Jon", "Mic", "Nah", "Hab", "Zep", "Hag", "Zec", "Mal"],
    "NT": CNST.NT_Bkc_Ary,
    "Gospel": ["Mat", "Mak", "Luk", "Jhn"],
    "Paulines": ["Rom", "1Co", "2Co", "Gal", "Eph", "Phl", "Col", "1Ts", "2Ts", "1Ti", "2Ti", "Tit", "Phm"],
    "Epistles": ["Heb", "Jas", "1Pe", "2Pe", "1Jn", "2Jn", "3Jn", "Jud"],
    "Custom": []
};
var BookJsFlavor = {
    OTNT: ['#510000', 'wholistic Bible', '圣经全书'],
    OT: ['#001040', 'O.T.', '旧约全书'],
    Moses: ['#002E63', 'Moses', '摩西五经'],
    History: ['#002E63', 'History', '历史'],
    Literature: ['#002E63', 'Literature', '文学'],
    Major_Prophets: ['#002E63', 'Major_Prophets', '大先知'],
    Minor_Prophets: ['#002E63', 'Minor_Prophets', '小先知'],
    NT: ['#4053A9', 'N.T.', '新约全书'],
    Gospels: ['#003399', 'Gospels', '四福音书'],
    HisSayings: ['#003399', 'HisSayings', '耶稣话语'],
    Pauls: ['#003399', 'Pauls', '保罗书信'],
    Other_Epistles: ['#003399', 'OtherEpistles', '其他书信'],
};

