// registerPhotoTemp.js
//
// Dependencies
var helpers = require('../helpers/helpers.js');
var util_redis = require('../utils/util_redis.js');
var async = require('async');
var fs = require('fs');
var gm = require('gm')
    , imageMagick = gm.subClass({ imageMagick : true });

module.exports = registerPhotoTemp = function (data, mock) {
    var photo = data[0]; 
    var id = helpers.photoIdEncode(mock.DateCreate);
    var photoInfo = {
        Id : id   
        , DateTime : mock.DateTime
        , Location : mock.Location
        , Description : mock.Description
        , Lpath : './archive/lphoto/l' + id + '.jpg'
        , Spath : './archive/sphoto/s' + id + '.jpg'
        , Author : mock.Author
        , List : mock.List
        , Title : mock.Title
        , Camera : mock.Camera
        , ExposureTime : data[1].Properties['exif:ExposureTime']
        , FNumber : data[1].Properties['exif:FNumber']
        , FocalLength : data[1].Properties['exif:FocalLength']
        , ISOSpeedRatings : data[1].Properties['exif:ISOSpeedRatings']
      };
    
    async.series([
          function (callback) {
            fs.writeFile(photoInfo.Lpath, photo, function (err) {
              if (err) {
                callback(err);
              } else {
                callback(null, 'Success writing large jpeg!');
              }
            });
          }
          , function (callback) {
              imageMagick(photo)
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
}
