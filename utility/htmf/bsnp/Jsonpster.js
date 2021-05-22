var Jsonpster = {};
Jsonpster.Url = function() {
    return 'http://54.227.156.235:7778/' + this.api + '?inp=' + encodeURIComponent(JSON.stringify(this.inp));
};
Jsonpster.Run = function(prm, cbf) {
    Object.assign(this, prm);
    if (!this.api) alert('api null');
    if (!this.inp) alert('inp null');
    this.Response = cbf;
    if (!cbf) alert('callback Response null');
    var s = document.createElement('script');
    s.src = this.Url();
    document.body.appendChild(s);
};
const RestApi = JSON.parse('{"ApiBibleObj_update_notes":"ApiBibleObj_update_notes","ApiBibleObj_load_Bkns_Vols_Chp_Vrs":"ApiBibleObj_load_Bkns_Vols_Chp_Vrs","ApiBibleObj_access_regex_search_history":"ApiBibleObj_access_regex_search_history","HistFile":{"__history_verses_loaded":"__history_verses_loaded","__history_regex_search":"__history_regex_search"}}');