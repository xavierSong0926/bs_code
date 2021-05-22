const http = require('http');

var cors = require('cors');



// use it before all route definitions. for cross domain post.
http.use(cors({origin: null}));

http.createServer((request, response) => {
  request.on('error', (err) => {
    console.error(err);
    response.statusCode = 400;
    response.end();
  });
  response.on('error', (err) => {
    console.error(err);
  });

  if (request.method === 'POST' && request.url === '/echo') {
    console.log("get Post")
    request.pipe(response);
  } else {
    console.log("end")
    response.statusCode = 404;
    response.end();
  }
}).listen(8080);