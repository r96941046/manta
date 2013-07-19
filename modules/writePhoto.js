// writePhoto.js
//
// Dependencies
var fs = require ('fs');
var gm = require('gm')
    , imageMagick = gm.subClass({ imageMagick : true });

module.exports = writePhoto = function () {
  fs.readFile('mock/photo/083 copy.jpg', 'utf8', function (err, photo) {
    if (err) {
      console.log(err);
    } else {
      return photo;
    }
  });
} 
