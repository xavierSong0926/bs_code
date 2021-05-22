alert();
function test() {
    alert("test");
}


var Jsonpster = {}; 
Jsonpster.Url = function () { 
    return 'http://localhost:7778/' + this.api + '?inp=' + encodeURIComponent(JSON.stringify(this.inp)); 
}; 
Jsonpster.Run = function (prm, cbf) { 
    Object.assign(this, prm); 
    this.Response = cbf; 
    if (!cbf) this.Response = function () { 
        alert('cb is null'); }; 
        var s = document.createElement('script'); 
        s.src = this.Url(); document.body.appendChild(s); 
    };
const RestApi = JSON.parse("${JsonStr_Api}");
   // '{"GetApiInputParamObj":"GetApiInputParamObj","updateVocabHebrewBuf":"updateVocabHebrewBuf","updateVocabHebrewDat":"updateVocabHebrewDat","loadBibleObj":"loadBibleObj","ApiBibleObj_load_Bkns_Vols_Chp_Vrs":"ApiBibleObj_load_Bkns_Vols_Chp_Vrs","ApiBibleObj_access_regex_search_history":"ApiBibleObj_access_regex_search_history","ApiBibleObj_update_notes":"ApiBibleObj_update_notes","HistFile":{"__history_verses_loaded":"__history_verses_loaded","__history_regex_search":"__history_regex_search"}}');
//req.url = /ApiBibleObj_load_Bkns_Vols_Chp_Vrs?inp=%7B%22fname%22%3A%5B%22H_G%22%5D%2C%22bibOj%22%3A%7B%22Gen%22%3A%7B%7D%7D%2C%22Search%22%3Anull%7D