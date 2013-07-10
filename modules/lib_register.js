// lib_register.js
//
// A function module
// Send request to vimeo, acquire information about videos in an album

// Module dependencies

var restler = require('restler')
    , async = require('async')
    , URL = require('../utils/URL.js')
    , util_vimeo = require('../utils/util_vimeo.js');

module.exports = lib_register = {};

lib_register.getAllVideos = function(callback) {
  async.waterfall([
    function (callback) {
      util_vimeo.getVideoInfo(URL.VIMEO.ALBUM.ALL, callback);
    },    
    function (rawVideos, videoUrls, callback) {
      util_vimeo.getVideoEmbed(rawVideos, videoUrls, callback);
    },
    function (rawVideos, embedUrls, callback) {
      util_vimeo.mergeVideoInfo(rawVideos, embedUrls, callback);
    } 
  ], function (err, allVideos) {
    if (err instanceof Error) {
      console.log('Error: ' + err);
    } else {
      callback(null, allVideos);
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
