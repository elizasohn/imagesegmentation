// const http = require('http');
// const fs = require('fs');
// // create the server object
// const server = http.createServer((req, res) => {
// res.writeHead(200, { 'Content-Type': 'text/html' }) // response headers
//   // res.render('index.html'); // write a response to the client
//   fs.createReadStream('index.html').pipe(res)
// // res.end(); // end the response
// });
// // set the server to listen on port 5000
// // server.listen(8000, () => {
// //   console.log(`Server running at http://localhost:8000`);
//   server.listen(process.env.PORT || 8000);
// // });