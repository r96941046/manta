// lib_register.js
//
// A function module
// Send request to vimeo, acquire information about videos in an album

// Module dependencies

var restler = require('restler')
    , async = require('async')
    , URL = require('../utils/URL.js')
    , util_vimeo = require('../utils/util_vimeo.js');
var redis = require('redis')
    , client = redis.createClient();

module.exports = lib_register = {};

lib_register.getAllVideos = function(callback) {
  async.waterfall([
    function (callback) {
      util_vimeo.getVideoInfo(URL.VIMEO.ALBUM.ALL, callback);
    }, 
    function (allVideos, listKeys, callback) {
      client.del(['video:all:temp', 'video:all:delete', 'video:all:add'], redis.print);
      client.sadd('video:all:temp', listKeys, redis.print);
      client.smembers('video:all:temp', redis.print);
      client.sdiffstore('video:all:delete', 'video:all', 'video:all:temp', redis.print);
      client.sdiffstore('video:all:add', 'video:all:temp', "video:all", redis.print);
      client.smembers('video:all:add', function (err, membersToAdd) {
        membersToAdd.forEach( function (member) {
          for ( i = 0; i < listKeys.length; i++) {
            if (listKeys[i] == member) {
              client.hmset(member, allVideos[i]);
            }
          }
        });
      });
      client.smembers('video:all:delete', function (err, membersToDelete) {
        if (membersToDelete.length != 0) {
          client.del(membersToDelete, redis.print); 
          }
        });
      client.del('video:all');
      client.rename('video:all:temp', 'video:all');
    }

  ], function (err, allVideos, listKeys) {
    if (err instanceof Error) {
      console.log('Error: ' + err);
    } else {
      callback(null, allVideos, listKeys);
    }
  });
}

lib_register.compareSet = function (allVideos, listKeys, callback) {
  async.waterfall([
    function (callback, allVideos, listKeys) {
    }    
  ], function (err, results) {
    if (err instanceof Error) {
      console.log('Error: ' + err);
    } else {
      callback(null);
    }
  });
}

lib_register.getAlbumLists = function(callback) {
  async.parallel({
    all : function (callback) {
      util_vimeo.getAlbumList(URL.VIMEO.ALBUM.ALL, callback);
    },
    index : function (callback) {
      util_vimeo.getAlbumList(URL.VIMEO.ALBUM.INDEX, callback); 
    },
    library : function (callback) {
      util_vimeo.getAlbumList(URL.VIMEO.ALBUM.LIBRARY, callback);
    }
  }, function (err, lists) {
      if (err instanceof Error) {
        console.log('Error: ' + err);
      } else {
        callback(null, lists);
      }
    });
}
