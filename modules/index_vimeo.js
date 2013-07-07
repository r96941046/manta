// index_vimeo.js
//
// A function module
// Send request to vimeo, acquire information about videos in an album

// Module dependencies

var restler = require('restler')
    , async = require('async')
    , URL = require('../utils/URL.js')
    , util_index = require('../utils/util_index.js');

module.exports = index_vimeo = function() {
  async.waterfall([
    function (callback) {
      util_index.getVideoInfo(callback);
    },    
    function (rawVideos, videoUrls, callback) {
      util_index.getVideoEmbed(rawVideos, videoUrls, callback);
    },
    function (rawVideos, embedUrls, callback) {
      util_index.mergeVideoInfo(rawVideos, embedUrls, callback);
    },
    function (videos) {
      console.log(videos);
    }
      
  ], function (err, result) {
  
  });


};


