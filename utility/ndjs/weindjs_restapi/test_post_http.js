// Node.js program to create http server 
// using require to access http module 

const http = require("http");

// Port number 
const PORT = process.env.PORT || 8080;






var uti = {
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
}


// Creating server 
const server = http.createServer(

    // Server listening on port 2020 
    function (req, res) {
        uti.set_postHeader(res)

        var body = []
        req.on('error', (err) => {
            console.error(err);
            res.statusCode = 400;
            res.end();
        });
        req.on('data', (chunk) => {
            console.log("req.on.data:", chunk);
            body += chunk
            //res.statusCode = 400;
            //res.end();
        });
        req.on('end', (err) => {
            console.log("req.on.end:", body);
        });

        if (req.method === 'POST' && req.url === '/echo') {
            console.log("method= Post, url=", req.url)
            req.pipe(res);
        } else {
            console.log("end", body)
            res.statusCode = 404;
            res.end();
        }

        //res.write('Hello geeksforgeeks!');
        // Write a response to the client 
        //res.end();
    }
).listen(PORT, error => {
    // Prints in console 
    console.log(`http Server listening on port ${PORT}`)
}); 
