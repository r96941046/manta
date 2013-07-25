// registerPhoto.js
//
// Dependencies
var helpers = require('../helpers/helpers.js');
var util_redis = require('../utils/util_redis.js');
var async = require('async');
var fs = require('fs');
var gm = require('gm')
    , imageMagick = gm.subClass({ imageMagick : true });

module.exports = registerPhoto = function (tmpPath, tmpInfo) {
  
  imageMagick(tmpPath).identify( function (err, tmpExif) {
    
    var id = helpers.photoIdEncode(tmpExif.Properties['date:create']);
    
    var photoInfo = {
        Id : id   
        , DateTime : tmpInfo.DateTime
        , Location : tmpInfo.Location
        , Description : tmpInfo.Description
        , Lpath : './archive/lphoto/l' + id + '.jpg'
        , Spath : './archive/sphoto/s' + id + '.jpg'
        , Author : tmpInfo.Author
        , List : tmpInfo.List
        , Title : tmpInfo.Title
        , Camera : tmpInfo.Camera
        , ExposureTime : tmpExif.Properties['exif:ExposureTime']
        , FNumber : tmpExif.Properties['exif:FNumber']
        , FocalLength : tmpExif.Properties['exif:FocalLength']
        , ISOSpeedRatings : tmpExif.Properties['exif:ISOSpeedRatings']
      };

     async.series([
          function (callback) {
            fs.rename(tmpPath, photoInfo.Lpath, function (err) {
              if (err) {
                callback(err);
              } else {
                callback(null, 'Success writing large jpeg!');
              }
            });
          }
          , function (callback) {
              imageMagick(photoInfo.Lpath)
                .resize(400,300)
                .write(photoInfo.Spath, function (err) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(null, 'Success writing small jpeg!');
                  }
                });
          }
          , function (callback) {
              util_redis.writePhoto(photoInfo, callback);
          }
        ], function (err, logs) {
          console.log(logs);
        }); 
  });
 
}
