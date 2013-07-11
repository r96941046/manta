/* example.js */
/* experiments testing node.js and npm */

var express = require('express');
var app = express();
var restler = require('restler');
var redis = require('redis')
    , client = redis.createClient();
var URL= require(__dirname + '/utils/URL');
var timer = 5000;
var port = 3000;

// Configuration

app.configure(function() {
  // app.engine() may not required for ejs, see docs for express 
  app.engine('.html', require('ejs').renderFile);
  // set path for later use app.get('views')
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  // without looking for the default layout.ejs
  app.set('view options', { layout: false});
  // routing for css and image files
  app.use('/css', express.static(__dirname + '/public/css'));
  app.use('/images', express.static(__dirname + '/public/images'));
  app.use('/js', express.static(__dirname + '/public/js'));
  app.use('/plugins', express.static(__dirname + '/public/plugins'));
});

// Routes

app.get('/', function(req, res) {
  res.render('index.html');
});
app.get('/about.html', function(req, res) {
  res.render('about.html');
});


// Redis server
  
client.on('error', function(err) {
  console.log('Error: ' + err);
});

// Flush db when in development stage

client.flushdb();

// Periodic refresh videos from vimeo

var register = require(__dirname + '/modules/register.js');
register();

/*setInterval(function() {
  restler.get(URL.INDEX_VIMEO)
    .on('complete', function(data) {
      console.log(data);
    });

}, timer);*/

app.listen(port);
console.log('running~', app.get('address'));

