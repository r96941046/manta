/* example.js */
/* experiments testing node.js and npm */

var express = require('express');
var app = express();

// Configuration

app.configure(function() {
  // app.engine() may not required for ejs, see docs for express 
  app.engine('.html', require('ejs').renderFile);
  // set path for later use app.get('views')
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  // without looking for the default layout.ejs
  app.set('view options', { layout: false});

});

// Routes

app.get('/', function(req,res) {
  res.render('indexTemp.html');
});

app.listen(3000);
console.log('running~', app.get('address'));

