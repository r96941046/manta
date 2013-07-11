// util_vimeo.js
//
// Module dependencies
var restler = require('restler');
var URL = require('../utils/URL.js');
var helpers = require('../helpers/helpers.js');
var async = require('async');

var util_vimeo = module.exports = {};

// Request for all video infos, append embed code to it, and retrieve a list for it.

util_vimeo.getVideoInfo = function (albumUrl, callback) {
  restler.get(albumUrl)
    .on('success', function(rawVideos) {
      callback(null, helpers.appendVideoEmbed(rawVideos), helpers.getListKeys(rawVideos));
    }).on('error', function(err) {
      callback(err);
    });
}

// retrieve album list keys from video albums

util_vimeo.getAlbumList = function (albumUrl, callback) {
  restler.get(albumUrl)
    .once('success', function(rawVideos) {
      callback(null, helpers.getListKeys(rawVideos));
    }).once('error', function(err) {
      callback(err);
    });
}

// retrieve vimeo embed codes from video information

util_vimeo.getVideoEmbed = function(rawVideos, videoUrls, callback) {
  async.mapSeries(videoUrls, function (videoUrl, callback) {
        restler.get(URL.VIMEO.EMBED + encodeURIComponent(videoUrl))
          .once('success', function(embedUrl) {
            callback(null, embedUrl.html);
          });
      }, function(err, embedUrls) {
        if (err instanceof Error) {
          console.log('Something went wrong when getting video embed');
        } else {
          // prevent leaking of []
          if (embedUrls.length != 0) {
            callback(null, rawVideos, embedUrls);
          }
        }
      });
}

// merge embed codes into video information

util_vimeo.mergeVideoInfo = function(rawVideos, embedUrls, callback) {
  for (i = 0; i < embedUrls.length; i++) {
    rawVideos[i].html = embedUrls[i]
  }
  callback(null, rawVideos);
}
