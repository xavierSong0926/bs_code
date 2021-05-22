// Node.js program to create server 
// with help of Express.js module 



var cors = require('cors');


// Importing express 
const express = require('express');

// Creating new express app 
const app = express();


// use it before all route definitions. for cross domain post.
app.use(cors({ origin: null }));


// PORT configuration 
const PORT = process.env.PORT || 8080;

// IP configuration 
const IP = process.env.IP || 8081;

// Create a route for the app 
app.get('/', (req, res) => {
    res.send('Hello Vikas_g from geeksforgeeks!');
});

// Create a route for the app 
app.use('/echo', (req, res) => {
    res.send('OOPS!! The link is broken...');
});

// Server listening to requests 
app.listen(PORT, IP, () => {
    console.log(
        `The express Server is running at: http://localhost:${PORT}/, IP=${IP}`);
}); 
