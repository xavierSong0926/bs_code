var WdFrqUti = {

    wordFreqObj: function (inputxt) {
        var txt = inputxt.toLowerCase()
        var warr = txt.match(/([a-zA-Z]+)/g)
        console.log("tot words count=", warr.length)

        var WdFrqObj = {}
        for (var i = 0; i < warr.length; i++) {
            var word = warr[i].trim();
            //if (!!IgnoreWords[word]) continue
            if (word.length <= 2) word = ".."
            if (!WdFrqObj[word]) {
                WdFrqObj[word] = 0
            }
            WdFrqObj[word]++
            //if (word.indexOf("construct") >= 0) console.log(word, WdFrqObj[word])
        }
        var outObj = { info: { word_count: warr.length, word_distinct: Object.keys(WdFrqObj).length } }
        outObj.wdfrqobj = WdFrqObj
        return outObj
    },
    sort_val_of_obj: function (wdfrobj) {
        var sortable = [];
        for (var wd in wdfrobj) {
            sortable.push([wd, wdfrobj[wd]]);
        }

        sortable.sort(function (a, b) {
            return b[1] - a[1];
        });

        var WordFrq = {}
        for (var i = 0; i < sortable.length; i++) {
            WordFrq[sortable[i][0]] = sortable[i][1]
        }
        return WordFrq
    },
    genTable: function (oWordsFrq, oMerger) {
        var mergeNodesArr = []
        if(oMerger) mergeNodesArr = Object.keys(oMerger);


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
    },
    get_WordGrpFrqObj: function (wdfrobj, wdsynOb) {
        ////////////
        var wdgrpObj = {}
        for (var wd in wdsynOb) {
            var ar = wdsynOb[wd]
            if (typeof (ar) === 'number') continue

            ar.unshift(wd)
            //console.log(wd, ar, ar.length, typeof (ar))
            if (!wdgrpObj[wd]) {
                wdgrpObj[wd] = { "tot": 0 }
            }

            for (var i = 0; i < ar.length; i++) {
                var kwd = ar[i]
                //console.log(wdfrobj, wdfrobj[kwd])
                wdgrpObj[wd]["tot"] += wdfrobj[kwd]
                wdgrpObj[wd][kwd] = wdfrobj[kwd]
            }
        }
        return wdgrpObj
    },
    merge_regular_word_to_root: function (WdFrObj) {
        ////////////
        function restore_by(wdfrobj, suffix) {
            function wsufx_ar(wd) {
                var wsfxary = [], lacha = wd.substr(wd.length - 1), firstpart = wd.substr(0, wd.length - 1)

                wsfxary.push(`${wd}${suffix}`)
                wsfxary.push(`${wd}${lacha}${suffix}`) //getting
                switch (lacha) {
                    case "y": wsfxary.push(`${wd}i${suffix}`) //studies
                    case "e": wsfxary.push(`${firstpart}${suffix}`) //taking
                }
                //console.log(wd, wsfxary)
                return wsfxary
            }
            for (var word in wdfrobj) {
                wsufx_ar(word).forEach(function (wchn) {
                    if (wdfrobj.hasOwnProperty(wchn)) {
                        wdfrobj[word] += wdfrobj[wchn]
                        if (word.indexOf("construct") >= 0) console.log(word, wchn, wdfrobj[word])
                        delete wdfrobj[wchn]
                    }
                })
            }
        }
        ["s", "es", "ing", "d", "ed", "er", "r", "or", "ers", "ors", "rs", "ly", "y", "ity", "est", "ion", "ions", "able", "ous", "ously", "ic", "ation", "ations", "cation", "cations", "ant", "ent", "ary", "ence", "ences", "ive", "iveness", , "itive"].forEach(function (sufix) {
            restore_by(WdFrObj, sufix)
        })
        return WdFrObj
    }
}





var EnglishText2WordsFreq = function () {

}
EnglishText2WordsFreq.prototype.genTable = function (inputxt) {
  
    var WdFrqObj = WdFrqUti.wordFreqObj(inputxt)

    WdFrqObj.wdfrqsrt = WdFrqUti.sort_val_of_obj(WdFrqObj.wdfrqobj)

    var stable = WdFrqUti.genTable(WdFrqObj.wdfrqsrt)
    return stable
};

var engwdfrq = new EnglishText2WordsFreq()










