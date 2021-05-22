


var ChinesePhraseStats = function (sTxt, PhraseLen, ChaFilter) {
    //this.purifyChars(sTxt);
    this.m_CharsSize = 0;
    for (var i = 0; i < sTxt.length; i++) {
        var chcod = sTxt.charCodeAt(i);
        if (chcod < 19968 || chcod > 65110) {//filted marks. NoneZi
            continue;
        }
        this.m_CharsSize++;
    }
    this.m_sTxt = sTxt.replace(/[\n|\r]{1,3}/g, "");

    if (!ChaFilter) ChaFilter = "";
    this.m_ChaFilter = ChaFilter;
    this.m_PhraseLen = PhraseLen;
    this.calcStats();
};

ChinesePhraseStats.prototype.calcStats = function () {
    var PhraseStats = {}, filterObj = {};
    var sTxt = this.m_sTxt;
    for (var i = 0; i < sTxt.length - this.m_PhraseLen; i++) {
        var phrase = "";
        for (var n = 0; n < this.m_PhraseLen; n++) {
            var cha = sTxt.charAt(i + n);
            phrase += cha;
            var chcod = sTxt.charCodeAt(i + n);
            if (chcod < 19968 || chcod > 65110) {//filted marks. NoneZi
                phrase = "";
                if (undefined === filterObj[cha]) filterObj[cha] = 0;
                filterObj[cha]++;
                break;
            }
        }
        if (0 === phrase.length) continue;
        if (this.m_ChaFilter.length > 0 && phrase.indexOf(this.m_ChaFilter) < 0) continue;
        if (!PhraseStats[phrase]) {
            PhraseStats[phrase] = 0;
        }
        PhraseStats[phrase]++;
    }
    console.log("filtered cn", filterObj);
    this.m_PhraseStats = PhraseStats;
}
ChinesePhraseStats.prototype.gen_table = function () {
    var jsn = JSON.stringify(this.m_PhraseStats, null, 4);
    var tot_distinct = Object.keys(this.m_PhraseStats).length;
    var txa = `<textarea>stat.size=${this.m_CharsSize}\nstat.dist=${tot_distinct}\n${this.m_ChaFilter}stat.freq=\n${jsn}</textarea>`;

    var stb = `<table border='1' align='left'><caption>${txa}</caption>`;
    stb += "<thead><tr><th>#</th><th>Phrase</th><th>reverse</th><th>frq</th></tr></thead>";
    stb += "<tbody>";
    var PhraseStats = this.m_PhraseStats;
    var idx = 0;
    $.each(PhraseStats, function (key, frq) {
        stb += "<tr><td>" + (idx++) + "</td><td class='mysel'>" + key + "</td><td>" + key.split("").reverse().join("") + "</td><td>" + frq + "</td></tr>";
    });
    stb += "</tbody></table>";
    var stat = {};
    stat.numOfZi = tot_distinct;
    stat.frqTot = this.m_CharsSize;
    //stat.freq=jsn;
    return { "stb": stb, "stat": stat };
}









var UniqObjFreq = function () {
    this.uniqWordArr = [];
    this.uniqObjFreqArr = [];

    this.TotWords = 0;
    this.TotCollections = 0;

    this.uniqWordFrq = {};
};
UniqObjFreq.prototype.js2txt = function () {
    return JSON.stringify(this.uniqWordFrq, null, 4);
}


UniqObjFreq.prototype.collect_Chinese_Chars = function (sTxt, sZiOrMark) {
    this.TotCollections++;
    var iZiOrMark = ["Zi", "Mark"].indexOf(sZiOrMark);
    if (iZiOrMark < 0) {
        alert("Input type 'Zi' or 'Mark'. Error for " + sZiOrMark);
        return;
    }
    for (var i = 0; i < sTxt.length; i += 1) {
        var cc = sTxt[i];
        var chcod = cc.charCodeAt(0);

        //if(chcod<10000) continue;
        if (chcod < 19968 || chcod > 65110) {//filted marks. NoneZi
            if (0 === iZiOrMark) {
                continue;
            }
        } else {
            if (1 === iZiOrMark) {
                continue;
            }
        }

        ////////////
        var idx = this.uniqWordArr.indexOf(chcod);
        if (idx < 0) {
            idx = this.uniqWordArr.length;//get last index for the size of array.
            this.uniqWordArr[idx] = chcod;
            this.uniqObjFreqArr[idx] = { Freq: 0, key: chcod, zi: cc, };
        }
        this.uniqObjFreqArr[idx].Freq += 1;
        this.TotWords++;

        //alert( cc + "=" + chcod );
    }
};


UniqObjFreq.prototype.getTHs = function () {
    var ths = '';
    if (this.uniqObjFreqArr.length > 0) {
        var obj = this.uniqObjFreqArr[0];
        for (var key in obj) {
            ths += "<th>" + key + "</th>";
        }
    }
    return ths;
};



var ObjArrSorter = function (objArr) {
    this.objArr = objArr;
    this.sortedStrnArr = [];
    this.sout = "";
};
ObjArrSorter.prototype.sort_key = function (sortKey) {
    var len = this.objArr.length;
    if (undefined == len || len == 0) {
        return alert("obj arr empty");
    };
    var obj = this.objArr[0];
    if (undefined == obj[sortKey]) {
        return alert("undefined key:" + sortKey);
    };

    if (sortKey === "Freq") {
        for (var idx in this.objArr) {
            var obj = this.objArr[idx];
            var sortk = "" + obj[sortKey];
            while (sortk.length < 50) {
                sortk = " " + sortk;
            }
            for (var key in obj) {
                sortk += "_" + obj[key];
            }
            this.sortedStrnArr.push(sortk);
        }
        this.sortedStrnArr.sort();//
        this.sortedStrnArr.reverse();
    }
    if (sortKey === "key") { //// natrual sort
        for (var idx in this.objArr) {
            var obj = this.objArr[idx];
            var sortk = "" + obj[sortKey];
            while (sortk.length < 50) {
                sortk = sortk + " ";//for natrual sort
            }
            for (var key in obj) {
                sortk += "_" + obj[key];
            }
            this.sortedStrnArr.push(sortk);
        }
        this.sortedStrnArr.sort();//
        //this.sortedStrnArr.reverse(); 
    }

};



var ObjArr2Table = function (sortedStrnArr) {
    this.sortedStrnArr = sortedStrnArr;
    this.sout = "";
};

ObjArr2Table.prototype.show_table = function (keyTHs) {
    var ths = "<th>#</th>" + keyTHs;
    this.sout = "<thead><tr>" + ths + "</tr></thead>";
    this.sout += "<tbody>";
    for (var idx in this.sortedStrnArr) {

        this.sout += "<tr>";
        this.sout += this.toTDs2(idx, this.sortedStrnArr[idx]);
        this.sout += "</tr>";
    }
    this.sout += "</tbody>";
    this.sout = "<table border='1' class='versTxt'><caption><button onclick='index_table_by_click_caption(this)'>!</button><button>WordsFreq</button></caption>" + this.sout + "</table>";

    //get frq list for graphic d3. 
    //var sFrqDat=this.get_text_frq_list_for_d3();
    this.sout;
};
ObjArr2Table.prototype.get_text_frq_list_for_d3 = function (varname) {
    //get frq list for graphic d3. 
    var sFrqDat = "\"" + varname + "\":[";
    for (var idx in this.sortedStrnArr) {
        var sortedstrn = this.sortedStrnArr[idx];
        var arr = sortedstrn.split(/[_]/g);
        var frq = $.trim(arr[0]);
        var wrd = arr[2];
        sFrqDat += "<br>[" + frq + ",\"" + wrd + "\"],";
    }
    return sFrqDat + "<br>],<br>";
};
ObjArr2Table.prototype.get_text_frq_list_for_py = function (varname) {
    //get frq list for graphic d3. 
    var sFrqDat = "\"" + varname + "\":[";
    for (var idx in this.sortedStrnArr) {
        var sortedstrn = this.sortedStrnArr[idx];
        var arr = sortedstrn.split(/[_]/g);
        var frq = $.trim(arr[0]);
        var wrd = $.trim(arr[2]);
        //console.log(wrd);
        sFrqDat += "<br>" + frq + "   " + wrd;
    }
    return sFrqDat + "<br>],<br>";
};
ObjArr2Table.prototype.get_regular_word_changes_for_js = function () {
    /////////////////////////////////////////////////////
    //// test only: to get regular words changes for js.
    //// Find: unchanged word by ending ["s","es","ed","ing"];
    var regwordDic = {};
    for (var idx in this.sortedStrnArr) {
        var sortedstrn = this.sortedStrnArr[idx];
        var ar = sortedstrn.split(/[_]/g);
        var frq = ar[0];
        var word = ar[1];
        var mat = word.match(/(.*)((s)|(es)|(ed)|(ing))$/i);
        if (mat) {
            console.log(mat);
            //continue;
            if (mat.length < 2) continue;
            var wd = mat[1];
            var postfix = mat[2];
            if (!regwordDic[wd]) {
                regwordDic[wd] = [];
            }
            regwordDic[wd].push(postfix);
        };
    };
    var jstr = "var WordsReguarChanges={";
    $.each(regwordDic, function (word, ar) {
        if (ar.length > 1) {
            jstr += "\"" + word + "\":[\n";
            for (var i = 0; i < ar.length; i++) {
                jstr += "\"" + word + ar[i] + "\",\n";
            }
            jstr += "],\n\n";
        }
    });
    jstr += "};\n"
    return jstr;
    //////
    ///////////////////////////////////////////////////////
};
ObjArr2Table.prototype.toTDs2 = function (idx, sortedstrn) {
    var arr = sortedstrn.split(/[_]/g);
    var sout = "<td>" + idx + "</td>";
    for (var i = 1; i < arr.length; i++) {
        sout += "<td>" + arr[i] + "</td>";
    }
    return sout;
};







var WordsFreq = function () {
    this.uniqObjFreq = new UniqObjFreq();
    this.objArrSorter = new ObjArrSorter(this.uniqObjFreq.uniqObjFreqArr);
    this.objArr2Table = new ObjArr2Table(this.objArrSorter.sortedStrnArr);
}
WordsFreq.prototype.getSortTable = function (key) {
    this.objArrSorter.sort_key(key);
    this.objArr2Table.show_table(this.uniqObjFreq.getTHs());

    var nn = "<hr/>TotWords=" + this.uniqObjFreq.TotWords;
    nn += "<br/>TotCollections=" + this.uniqObjFreq.TotCollections;
    return this.objArr2Table.sout + nn;
};

WordsFreq.prototype.getSortData = function (key) {
    this.objArrSorter.sort_key(key);
    this.objArr2Table.show_table(this.uniqObjFreq.getTHs());

    var nn = "<hr/>TotWords=" + this.uniqObjFreq.TotWords;
    nn += "<br/>TotCollections=" + this.uniqObjFreq.TotCollections;
    return this.objArr2Table.sout + nn;
};

WordsFreq.prototype.getSortedFrqWord_js = function (key) {
    this.objArrSorter.sort_key(key);
    this.objArr2Table.show_table(this.uniqObjFreq.getTHs());

    var nn = "<hr/>TotWords=" + this.uniqObjFreq.TotWords;
    nn += "<br/>TotCollections=" + this.uniqObjFreq.TotCollections;
    return this.objArr2Table.sout + nn;
};
WordsFreq.prototype.htable = function (oSet) {////{Filter:x,Merger:y}

    function sumFrq(oWordFrq, KeyArr) {
        if (!KeyArr) {
            return 0;
        }
        var frq = 0;
        for (var i = 0; i < KeyArr.length; i++) {
            var key = KeyArr[i];
            frq += oWordFrq[key];
        }
        return frq;
    }
    function MergerChildren(oMerger) {
        var mergeChildren = [];
        var mergeNodesArr = Object.keys(oMerger);
        for (var i = 0; i < mergeNodesArr.length; i++) {
            var node = mergeNodesArr[i];
            for (var j = 0; j < oMerger[node].length; j++) {
                var child = oMerger[node][j];
                if (mergeChildren.indexOf(child) >= 0) {
                    console.log("duplicated for merge:" + child);
                }
                mergeChildren.push(child);
            }
        }
        return mergeChildren;
    }
    function GetMergerChild2Head(oMerger) {
        var mergeChildHead = {}, ierr = 0;
        var mergeHeadArr = Object.keys(oMerger);
        for (var i = 0; i < mergeHeadArr.length; i++) {
            var head = mergeHeadArr[i];
            for (var j = 0; j < oMerger[head].length; j++) {
                var child = oMerger[head][j];
                if (!mergeChildHead[child]) {
                    mergeChildHead[child] = head;
                }
                else {
                    console.log("duplicated child '" + child + "'' for head: '" + head + ",");
                    ierr++;
                }
            }
        }
        if (ierr > 0) {
            alert("See console.log for duplicated heads: " + ierr);
        }
        return mergeChildHead;
    }



    function genTable(oWordsFrq, oMerger) {
        var mergeNodesArr = Object.keys(oMerger);


        var tbl = "<table border='1' class='versTxt'><caption><button onclick='index_table_by_click_caption(this)'>!</button><button>WordsFreq</button></caption>";
        tbl += "<thead><tr><th>#</th><th>Key</th><th title='# of Variants for key word'>V</th><th>Frq</th></tr></thead>";
        tbl += "<tbody>";
        var keys = Object.keys(oWordsFrq);
        var idx = 0, itot = 0;
        for (var i = 0; i < keys.length; i++) {
            var word = keys[i];
            var numb = "";
            if (mergeNodesArr.indexOf(word) >= 0) {
                numb = "" + oMerger[word].length;
            }

            var freq = oWordsFrq[word];
            itot += freq;
            tbl += "<tr><td>" + (idx++) + "</td><td>" + word + "</td><td>" + numb + "</td><td>" + freq + "</td></tr>";
        }
        tbl += "</tbody></table>";
        var sum = "<hr/><a>Tot Uniq:" + idx + "</a><br/><a>Tot Freq: " + itot + "</a>";
        return sum + tbl;
    }



    var tmpWordsFrq = {};
    var keys = Object.keys(this.uniqObjFreq.uniqWordFrq);
    var mergeNodesArr = Object.keys(oSet.Merger);
    var mergeChildArr = MergerChildren(oSet.Merger);
    var mergeChild2head = GetMergerChild2Head(oSet.Merger);

    //// filter meaningless.
    for (var i = 0; i < keys.length; i++) {
        var word = keys[i];
        var freq = this.uniqObjFreq.uniqWordFrq[word];
        if (oSet.Filter.indexOf(word) >= 0) continue;//filter useless. 
        //check merge head for child. if no head, replace the first one to head.  
        if (mergeChildArr.indexOf(word) >= 0) {// is child.
            word = mergeChild2head[word];//get head of child. 
        }//// replace child with head. 

        if (!tmpWordsFrq[word]) {
            tmpWordsFrq[word] = 0; //head. 
        }
        tmpWordsFrq[word] += freq; //head.     
    }
    this.table2json = JSON.stringify(tmpWordsFrq, null, 4);
    //////////////////////////////////////
    return genTable(tmpWordsFrq, oSet.Merger);
};












