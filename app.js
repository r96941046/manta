/* example.js */
/* experiments testing node.js and npm */

var express = require('express');
var app = express();
var restler = require('restler');
var redis = require('redis')
    , client = redis.createClient();
var async = require('async');
var URL= require(__dirname + '/utils/URL');
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
  app.use(express.bodyParser());
  app.use('/css', express.static(__dirname + '/public/css'));
  app.use('/images', express.static(__dirname + '/public/images'));
  app.use('/js', express.static(__dirname + '/public/js'));
  app.use('/plugins', express.static(__dirname + '/public/plugins'));
  app.use('/sphoto', express.static(__dirname + '/archive/sphoto'));
  app.use('/lphoto', express.static(__dirname + '/archive/lphoto'));
});

// Routes

app.get('/', function(req, res) {
  async.parallel([
    function (callback) {
      util_redis.getIndexVideo(callback);
    }
    , function (callback) {
      util_redis.getIndexNews(callback);
    }
    , function (callback) {
      util_redis.getIndexSnapshot(callback);
    }
    ], function (err, renderItems) {
      res.render('index.html', {
        indexVideo : renderItems[0].indexVideo
        , indexNews : renderItems[1].indexNews
        , indexSnapshot : renderItems[2].indexSnapshot
      });
    });
});
app.get('/about.html', function(req, res) {
  res.render('about.html');
});

app.get('/upload', function (req, res) {
  res.render('upload.html');
});

app.post('/api/upload', function (req, res) {
  console.log(req);
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

// Photo write system

var registerPhoto = require(__dirname + '/modules/registerPhoto.js');
var fs = require('fs');
var mockPhoto = require(__dirname + '/mock/mockPhoto.js');
var gm = require('gm')
    , imageMagick = gm.subClass({ imageMagick : true });


// Delete writed photos in development stage
/*
fs.unlink(__dirname + '/archive/lphoto/l20130720155035.jpg', function (err) { if (err) throw err;});
fs.unlink(__dirname + '/archive/lphoto/l20130720165035.jpg', function (err) { if (err) throw err;});
fs.unlink(__dirname + '/archive/lphoto/l20130720175035.jpg', function (err) { if (err) throw err;});
fs.unlink(__dirname + '/archive/lphoto/l20130720185035.jpg', function (err) { if (err) throw err;});
fs.unlink(__dirname + '/archive/sphoto/s20130720155035.jpg', function (err) { if (err) throw err;});
fs.unlink(__dirname + '/archive/sphoto/s20130720165035.jpg', function (err) { if (err) throw err;});
fs.unlink(__dirname + '/archive/sphoto/s20130720175035.jpg', function (err) { if (err) throw err;});
fs.unlink(__dirname + '/archive/sphoto/s20130720185035.jpg', function (err) { if (err) throw err;});
*/
app.get('/DBinfo', function (req, res) {
  client.smembers('photo:all', redis.print);
  client.lrange('photo:news', 0, -1, redis.print);
  client.lrange('photo:snapshot', 0, -1, redis.print);
  client.lrange('photo:contest', 0, -1, redis.print);

});

var mockImport = require(__dirname + '/mock/mockImport.js');
app.get('/photo', function (req, res) {
  // mock photo information
  mockImport();
});

app.get('/image', function (req, res) {
  res.render('image.html');
});
app.get('/admin/upload', function (req, res) {
  imageMagick('mock/photo/083 copy.jpg')
  .flip()
  .resize(340, 255)
  .identify( function (err, data) {
    console.log(data);
  });
/*  .stream('jpeg', function (err, stdout) {
     if (err) return next(err);
     res.setHeader('Content-Type', 'image/jpeg');
      stdout.pipe(res);

  });
  */
/*  
  fs.readFile('mock/photo/083 copy.jpg', function (err, photo) {
    if (err) { 
      console.log(err);
    } else {

    res.writeHead(200, {'Content-Type' : 'image/jpeg'});
    res.end(photo, 'binary');
    }
  });*/
  console.log('req get!');
  });

app.listen(port);
console.log('running~', app.get('address'));
console.log(process.version + 'version node running');
