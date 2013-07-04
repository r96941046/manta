/* example.js */
/* experiments testing node.js and npm */

var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);

app.get('/',function(req,res){
  res.send('Hello World!');
});

app.listen(3000);
console.log('running~', server.address());

