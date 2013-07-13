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
            .once('success', function(rawVideos) {
              callback(null, { videos: helpers.appendVideoEmbed(rawVideos)
                               , keys: helpers.getListKeys(rawVideos) });
            }).once('error', function(err) {
              callback(err);
            });
         },
    indexKeys: function (callback) {
        restler.get(URL.VIMEO.ALBUM.INDEX)
          .once('success', function (indexList) {
            callback(null, helpers.getListKeys(indexList)); 
          }).once('error', function (err) {
            callback(err);
          });
      },
    libraryKeys: function (callback) {
        restler.get(URL.VIMEO.ALBUM.LIBRARY)
          .once('success', function (libraryList) {
            callback(null, helpers.getListKeys(libraryList));
          }).once('error', function (err) {
            callback(err);
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
