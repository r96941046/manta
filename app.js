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

// Photo write system

var registerPhoto = require(__dirname + '/modules/registerPhoto.js');
var fs = require('fs');
var mockPhoto = require(__dirname + '/mock/mockPhoto.js');
var gm = require('gm')
    , imageMagick = gm.subClass({ imageMagick : true });


// Delete writed photos in development stage

fs.unlink(__dirname + '/archive/lphoto/l20130720155035.jpg', function (err) { if (err) throw err;});
fs.unlink(__dirname + '/archive/lphoto/l20130720165035.jpg', function (err) { if (err) throw err;});
fs.unlink(__dirname + '/archive/lphoto/l20130720175035.jpg', function (err) { if (err) throw err;});
fs.unlink(__dirname + '/archive/lphoto/l20130720185035.jpg', function (err) { if (err) throw err;});
fs.unlink(__dirname + '/archive/sphoto/s20130720155035.jpg', function (err) { if (err) throw err;});
fs.unlink(__dirname + '/archive/sphoto/s20130720165035.jpg', function (err) { if (err) throw err;});
fs.unlink(__dirname + '/archive/sphoto/s20130720175035.jpg', function (err) { if (err) throw err;});
fs.unlink(__dirname + '/archive/sphoto/s20130720185035.jpg', function (err) { if (err) throw err;});

app.get('/DBinfo', function (req, res) {
  client.smembers('photo:all', redis.print);
  client.lrange('photo:news', 0, -1, redis.print);
  client.lrange('photo:snapshot', 0, -1, redis.print);
  client.lrange('photo:contest', 0, -1, redis.print);

});

app.get('/photo', function (req, res) {
  // mock photo information
   async.series([
    function (callback) {
       fs.readFile('mock/photo/IMG_0000.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            callback(null, photo);
          }
          });
    }, 
    function (callback) {
        fs.readFile('mock/photo/IMG_0000.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            imageMagick(photo).identify( function (err, data) {
            if (err) {
              callback(err);
            } else {
              callback(null, data);
            }
          });
          }
        }); 
    }
    ], function (err, photo) {
        registerPhoto(photo, mockPhoto.photo01); 
    });

  
  async.series([
    function (callback) {
       fs.readFile('mock/photo/IMG_0959.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            callback(null, photo);
          }
          });
    }, 
    function (callback) {
        fs.readFile('mock/photo/IMG_0959.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            imageMagick(photo).identify( function (err, data) {
            if (err) {
              callback(err);
            } else {
              callback(null, data);
            }
          });
          }
        }); 
    }
    ], function (err, photo) {
        registerPhoto(photo, mockPhoto.photo02); 
    });

  
  async.series([
    function (callback) {
       fs.readFile('mock/photo/IMG_7518.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            callback(null, photo);
          }
          });
    }, 
    function (callback) {
        fs.readFile('mock/photo/IMG_7518.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            imageMagick(photo).identify( function (err, data) {
            if (err) {
              callback(err);
            } else {
              callback(null, data);
            }
          });
          }
        }); 
    }
    ], function (err, photo) {
        registerPhoto(photo, mockPhoto.photo03); 
    });
 
  async.series([
    function (callback) {
       fs.readFile('mock/photo/083 copy.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            callback(null, photo);
          }
          });
    }, 
    function (callback) {
        fs.readFile('mock/photo/083 copy.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            imageMagick(photo).identify( function (err, data) {
            if (err) {
              callback(err);
            } else {
              callback(null, data);
            }
          });
          }
        }); 
    }
    ], function (err, photo) {
        registerPhoto(photo, mockPhoto.photo04); 
    });
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
