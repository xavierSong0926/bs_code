







function gen_table_nt___xxxx(Sons) {
    var arr = Object.keys(Sons);
    var st = "<table border='1'>";
    st += "<thead><tr><th>#</th><th>vrs</th><th>txt</th><th>usg</th><th></th></tr></thead><tbody>"
    for (var i = 0; i < arr.length; i++) {
        var key = arr[i];
        var vrs = Sons[key];
        var idx = vrs.indexOf("G5207 of");
        var patternOf = "";
        if (vrs.indexOf("Son") >= 0 || vrs.indexOf("G5207 of God") >= 0) {
            patternOf = "Son";
        } else {
            var idx = vrs.indexOf("G5207 of");
            if (idx >= 0) {
                patternOf = vrs.substr(idx, 25);
            } else {
                var mat = vrs.match(/father/ig);
                if (mat) {
                    patternOf = "father";
                }
            }
        }
        st += `<tr><td>${i}</td><td>${key}</td><td>${vrs}</td><td>${patternOf}</td><td></td></tr>`;
    }
    st += "</tbody></table>";
    $("#holder").html(st);

    table_sort();
}
function gen_table_nt(Sons) {
    var frqObj = [{}, {}, {}];
    var arr = Object.keys(Sons);
    var st = "<table border='1'>";
    st += "<thead><tr><th>#</th><th>vrs</th><th>txt</th><th>usg</th><th></th><th></th><th></th></tr></thead><tbody>"
    for (var i = 0; i < arr.length; i++) {
        var key = arr[i];
        var vrs = Sons[key];
        var num = [0];
        var pat1 = get_pattern_Upperxx(vrs, num, frqObj[0], "G5207");
        var pat2 = get_pattern_lowerxx(vrs, num, frqObj[1], "G5207");
        var pat3 = get_pattern3(vrs, num, frqObj[2], "G5207");
        st += `<tr><td>${i}</td><td>${key}</td><td>${vrs}</td><td>${num}</td><td>${pat1}</td><td>${pat2}</td><td>${pat3}</td></tr>`;
    }
    st += "</tbody></table>";
    $("#holder").html(st);


    for (var i = 0; i < frqObj.length; i++) {
        var sortedObj = sortObjVal(frqObj[i]);
        frqObj[i] = sortedObj;
    }
    $("#out").val(JSON.stringify(frqObj, null, 4));

    table_sort();
}
















///////////////////////////////////////////////////////////////
//
function sortObjVal(obj) {
    var valsortedObj = {};
    var keys = Object.keys(obj);
    var sarr = [];
    const MAXLEN = 10;
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var val = "" + obj[key];
        var str = val.padStart(MAXLEN, '0') + key;
        sarr.push(str);
    }
    sarr.sort().reverse();
    for (var i = 0; i < sarr.length; i++) {
        var str = sarr[i];
        var val = parseInt(str.substr(0, MAXLEN));
        var key = str.substr(MAXLEN);
        valsortedObj[key] = val;
    }
    return valsortedObj;
}
///////////////////////////////////////////////////////////////
//son-of-xxx = 1109
function gen_table_ot(Sons) {
    var frqObj = [{}, {}, {}];
    var arr = Object.keys(Sons);
    var st = "<table border='1'>";
    st += "<thead><tr><th>#</th><th>vrs</th><th>txt</th><th>usg</th><th></th><th></th><th></th></tr></thead><tbody>"
    for (var i = 0; i < arr.length; i++) {
        var key = arr[i];
        var vrs = Sons[key];
        var num = [0];
        var pat1 = get_pattern_Upperxx(vrs, num, frqObj[0], "H1121");
        var pat2 = get_pattern_lowerxx(vrs, num, frqObj[1], "H1121");
        var pat3 = get_pattern3(vrs, num, frqObj[2], "H1121");
        st += `<tr><td>${i}</td><td>${key}</td><td>${vrs}</td><td>${num}</td><td>${pat1}</td><td>${pat2}</td><td>${pat3}</td></tr>`;
    }
    st += "</tbody></table>";
    $("#holder").html(st);


    for (var i = 0; i < frqObj.length; i++) {
        var sortedObj = sortObjVal(frqObj[i]);
        frqObj[i] = sortedObj;
    }
    $("#out").val(JSON.stringify(frqObj, null, 4));

    table_sort();
}
function get_pattern3(vrs, num, frqObj, scod) {
    //H1121,  G5207. 
    var patternArr = [
        scod+" and daughters",
        "[Yy]oung H",
        "[Hh]is son",
        "[Hh]er son",
        "[Tt]heir son",
        "[Aa] son",
        "[Tt]he son",
        "[Tt]hy son",
        "[Oo]wn son",
        "[Yy]our son",
        "[Oo]ur son",
        "[Mm]y son",
        "'s son",

        "[Hh]is child",
        "[Hh]er child",
        "[Tt]heir child",
        "[Aa] child",
        "[Tt]he child",
        "[Tt]hy child",
        "[Oo]wn child",
        "[Yy]our child",
        "[Oo]ur child",
        "[Mm]y child",
        "'s child"

    ];
    for (var i = 0; i < patternArr.length; i++) {
        var pat = patternArr[i];
        var ret = new RegExp(pat, "g");
        var mat = vrs.match(ret);
        if (mat) {
            var sky = mat[0];
            if (undefined === frqObj[sky]) {
                frqObj[sky] = 0;
            }
            frqObj[sky]++;
            num[0]++;
            return pat;
        }
    }
    return "";
}
function get_pattern_Upperxx(vrs, num, frqObj, scod) {
    vrs=vrs.replace(/[\.\,\:\'\"\?\;\'\<\>\/\-\=\_\+\(\)\*\&\^\%\$\#\@\!\~]/g, " ")+" xxx";
    var mat = vrs.match(/H1121\s+of\s+[A-Z]\w+[\,\.\'\"\:\s]+[a-zA-Z\,\.\-\:\.]+/g);
    if(scod==="H1121"){
        mat = vrs.match(/H1121\s+of\s+[A-Z]\w+[\,\.\'\"\:\s]+[a-zA-Z\,\.\-\:\.]+/g);
    }
    if(scod==="G5207"){
        mat = vrs.match(/G5207\s+of\s+[A-Z]\w+[\,\.\'\"\:\s]+[a-zA-Z\,\.\-\:\.]+/g);
    }
    if (mat) {
        var pattern = mat[0];
        var mat1 = pattern.match(/H1121\s+of\s+\w+/g);
        if(scod==="H1121"){
            mat1 = pattern.match(/H1121\s+of\s+\w+/g);
        }
        if(scod==="G5207"){
            mat1 = pattern.match(/G5207\s+of\s+\w+/g);
        }

        var sky = mat1[0];
        if (undefined === frqObj[sky]) {
            frqObj[sky] = 0;
        }
        frqObj[sky]++;
        num[0]++;
        return pattern;
    }
    return "";
}
function get_pattern_lowerxx(vrs, num, frqObj, scod) {
    vrs=vrs.replace(/[\.\,\:\'\"\?\;\'\<\>\/\-\=\_\+\(\)\*\&\^\%\$\#\@\!\~]/g, " ")+" xxx";
    var mat = vrs.match(/H1121\s+of\s+[a-z]\w+[\,\.\'\"\:\s]{0,9}[a-zA-Z\,\.\-\:\.]+/g);
    if(scod==="H1121"){
        mat = vrs.match(/H1121\s+of\s+[a-z]\w+[\,\.\'\"\:\s]{0,9}[a-zA-Z\,\.\-\:\.]+/g);
    }
    if(scod==="G5207"){
        mat = vrs.match(/G5207\s+of\s+[a-z]\w+[\,\.\'\"\:\s]{0,9}[a-zA-Z\,\.\-\:\.]+/g);
    }

    if (mat) {
        var pattern = mat[0];
        var mat2=pattern.match(/of m[ae]n\s/g);
        if(mat2){
            pattern=scod+" of man/men";
        }
        var sky = pattern;
        if (undefined === frqObj[sky]) {
            frqObj[sky] = 0;
        }
        frqObj[sky]++;
        num[0]++;
        return pattern;
    }
    return "";
}







function get_jsn_from_blueletter(){
    
}


var ot_stat = {
    "son-of-Xxxx": {
        "frq": 949,
        "son-of-God": {
            "frq": 5
        }
    }
}