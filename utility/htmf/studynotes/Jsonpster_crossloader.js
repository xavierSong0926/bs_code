function Jsonpster_crossloader(ip) {
    if("undefined" != typeof RestApi){
        return console.log("Jsonpster is already loaded. Ignore", ip)
    }

    var e = document.createElement("script");
    e.src = `http://${ip}:7778/Jsonpster/`;
    document.body.appendChild(e);
    console.log("crossload:", e.src)
}

Jsonpster_crossloader("localhost")
Jsonpster_crossloader("104.188.182.128")
Jsonpster_crossloader("54.227.156.235")