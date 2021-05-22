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
    Uti.GetFilesAryFromDir(dir, true, function (fname) {
        var ext = path.parse(fname).ext;
        //console.log("ext:",ext)
        if (ftypes[ext]) {
            console.log("api:", fname)
            http.use("/" + fname, async (req, res) => {
                console.log('[post] resp save :', req.body, fname)
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