// util_vimeo.js
//
// Module dependencies
var restler = require('restler');
var URL = require('../utils/URL.js');
var helpers = require('../helpers/helpers.js');
var async = require('async');

var util_vimeo = module.exports = {};

// Retrieve album list keys from video albums

util_vimeo.getRegisterItems = function (callback) {
  async.series({
    all: function (callback) {
          restler.get(URL.VIMEO.ALBUM.ALL)
            .once('complete', function(rawVideos) {
              if (rawVideos instanceof Error) {
                callback(rawVideos);
              } else {
              callback(null, { videos: helpers.appendVideoEmbed(rawVideos)
                               , keys: helpers.getListKeys(rawVideos) });
              }
            });
         },
    indexKeys: function (callback) {
        restler.get(URL.VIMEO.ALBUM.INDEX)
          .once('complete', function (indexList) {
            if (indexList instanceof Error) {
              callback(indexList);
            } else {
            callback(null, helpers.getListKeys(indexList));
            }
          });
      },
    libraryKeys: function (callback) {
        restler.get(URL.VIMEO.ALBUM.LIBRARY)
          .once('complete', function (libraryList) {
            if (libraryList instanceof Error) {
              callback(libraryList);
            } else {
            callback(null, helpers.getListKeys(libraryList));
            }
          });
      }
      }, function (err, results) {
        if (err instanceof Error) {
          callback(err);
        } else {
          callback(null, { allVideos : results.all.videos
                           , albums : {
                              allKeys : results.all.keys
                              , indexKeys: results.indexKeys
                              , libraryKeys : results.libraryKeys
                           }                   
          });
        }
      });
}
