// util_index.js
//
// Module dependencies
var restler = require('restler');
var URL = require('../utils/URL.js');
var helpers = require('../helpers/helpers.js');
var async = require('async');

var util_index = module.exports = {};

// retrieve vimeo urls from video information

util_index.getVideoInfo = function(callback) {
  restler.get(URL.VIMEO.ALBUM)
    .on('success', function(rawVideos) {
      callback(null, rawVideos, helpers.getVideoUrl(rawVideos));
    }).on('error', function(err) {
      callback(err);
    });
}

// retrieve vimeo embed codes from video information

util_index.getVideoEmbed = function(rawVideos, videoUrls, callback) {
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

util_index.mergeVideoInfo = function(rawVideos, embedUrls, callback) {
  for (i = 0; i < embedUrls.length; i++) {
    rawVideos[i].html = embedUrls[i]
  }
  callback(null, rawVideos);
}
