

var Jsonpster = {}; Jsonpster.Url = function () { return 'http://104.188.182.128:7778/' + this.api + '?inp=' + encodeURIComponent(JSON.stringify(this.inp)); }; Jsonpster.Run = function (prm, cbf) { Object.assign(this, prm); this.Response = cbf; if (!cbf) this.Response = function () { alert('cb is null'); }; var s = document.createElement('script'); s.src = this.Url(); document.body.appendChild(s); }; const RestApi = JSON.parse('{"GetApiInputParamObj":"GetApiInputParamObj","updateVocabHebrewBuf":"updateVocabHebrewBuf","updateVocabHebrewDat":"updateVocabHebrewDat","loadBibleObj":"loadBibleObj","ApiBibleObj_load_Bkns_Vols_Chp_Vrs":"ApiBibleObj_load_Bkns_Vols_Chp_Vrs","ApiBibleObj_access_regex_search_history":"ApiBibleObj_access_regex_search_history","ApiBibleObj_update_notes":"ApiBibleObj_update_notes","HistFile":{"__history_verses_loaded":"__history_verses_loaded","__history_regex_search":"__history_regex_search"}}');
var Jsonpster = {}; Jsonpster.Url = function () { return 'http://localhost:7778/'       + this.api + '?inp=' + encodeURIComponent(JSON.stringify(this.inp)); }; Jsonpster.Run = function (prm, cbf) { Object.assign(this, prm); this.Response = cbf; if (!cbf) this.Response = function () { alert('cb is null'); }; var s = document.createElement('script'); s.src = this.Url(); document.body.appendChild(s); }; const RestApi = JSON.parse('{"ApiBibleObj_update_notes":"ApiBibleObj_update_notes","ApiBibleObj_load_Bkns_Vols_Chp_Vrs":"ApiBibleObj_load_Bkns_Vols_Chp_Vrs","ApiBibleObj_access_regex_search_history":"ApiBibleObj_access_regex_search_history","HistFile":{"__history_verses_loaded":"__history_verses_loaded","__history_regex_search":"__history_regex_search"}}');






var Jsonpster = {}; Jsonpster.Url = function () { return 'http://104.188.182.128:7778/' + this.api + '?inp=' + encodeURIComponent(JSON.stringify(this.inp)); }; Jsonpster.Run = function (prm, cbf) { Object.assign(this, prm); this.Response = cbf; if (!cbf) this.Response = function () { alert('cb is null'); }; var s = document.createElement('script'); s.src = this.Url(); document.body.appendChild(s); }; const RestApi = JSON.parse('{"ApiBibleObj_load_Bkns_Vols_Chp_Vrs":"ApiBibleObj_load_Bkns_Vols_Chp_Vrs","ApiBibleObj_access_regex_search_history":"ApiBibleObj_access_regex_search_history","ApiBibleObj_update_notes":"ApiBibleObj_update_notes","HistFile":{"__history_verses_loaded":"__history_verses_loaded","__history_regex_search":"__history_regex_search"}}');
var Jsonpster = {}; Jsonpster.Url = function () { return 'http://localhost:7778/'       + this.api + '?inp=' + encodeURIComponent(JSON.stringify(this.inp)); }; Jsonpster.Run = function (prm, cbf) { Object.assign(this, prm); this.Response = cbf; if (!cbf) this.Response = function () { alert('cb is null'); }; var s = document.createElement('script'); s.src = this.Url(); document.body.appendChild(s); }; const RestApi = JSON.parse('{"ApiBibleObj_update_notes":"ApiBibleObj_update_notes","ApiBibleObj_load_Bkns_Vols_Chp_Vrs":"ApiBibleObj_load_Bkns_Vols_Chp_Vrs","ApiBibleObj_access_regex_search_history":"ApiBibleObj_access_regex_search_history","HistFile":{"__history_verses_loaded":"__history_verses_loaded","__history_regex_search":"__history_regex_search"}}');






var Jsonpster = {};
Jsonpster.Url = function () {
	return 'http://localhost:7778/' + this.api + '?inp=' + encodeURIComponent(JSON.stringify(this.inp));
};
Jsonpster.Run = function (prm, cbf) {
	Object.assign(this, prm);
	this.Response = cbf;
	if (!cbf) this.Response = function () {
		alert('cb is null');
	};
	var s = document.createElement('script');
	s.src = this.Url();
	document.body.appendChild(s);
};
const RestApi = JSON.parse('{"ApiBibleObj_update_notes":"ApiBibleObj_update_notes","ApiBibleObj_load_Bkns_Vols_Chp_Vrs":"ApiBibleObj_load_Bkns_Vols_Chp_Vrs","ApiBibleObj_access_regex_search_history":"ApiBibleObj_access_regex_search_history","HistFile":{"__history_verses_loaded":"__history_verses_loaded","__history_regex_search":"__history_regex_search"}}');