/* example.js */
/* experiments testing node.js and npm */

var express = require('express');
var app = express();
var restler = require('restler');
var redis = require('redis')
    , client = redis.createClient();
var async = require('async');
var URL= require(__dirname + '/utils/URL');
var util_render = require(__dirname + '/utils/util_render');
var timer = 10000;
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
  async.waterfall([
    function (callback) {
      util_redis.getIndexVideo(callback);
    }
    ], function (err, renderItems) {
      res.render('index.html', renderItems);
    });
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
setInterval( register , timer );

var writePhoto = require(__dirname + '/modules/writePhoto.js');
var fs = require('fs');
var gm = require('gm')
    , imageMagick = gm.subClass({ imageMagick : true });


app.get('/image', function (req, res) {
  res.render('image.html');
});
app.get('/admin/upload', function (req, res) {
  fs.readFile('mock/photo/083 copy.jpg', function (err, photo) {
    if (err) { 
      console.log(err);
    } else {

    res.writeHead(200, {'Content-Type' : 'image/jpeg'});
    res.end(photo, 'binary');
    }
  });
  console.log('req get!');
  });

app.listen(port);
console.log('running~', app.get('address'));
console.log(process.version + 'version node running');
