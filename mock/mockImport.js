// mockImport.js
//
// Dependencies
var async = require('async');
var registerPhotoTemp = require('../modules/registerPhotoTemp.js');
var fs = require('fs');
var mockPhoto = require('../mock/mockPhoto.js');
var gm = require('gm')
    , imageMagick = gm.subClass({ imageMagick : true });


module.exports = mockImport = function () {

   async.series([
    function (callback) {
       fs.readFile('mock/photo/IMG_0000.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            callback(null, photo);
          }
          });
    }, 
    function (callback) {
        fs.readFile('mock/photo/IMG_0000.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            imageMagick(photo).identify( function (err, data) {
            if (err) {
              callback(err);
            } else {
              callback(null, data);
            }
          });
          }
        }); 
    }
    ], function (err, photo) {
        registerPhotoTemp(photo, mockPhoto.photo01); 
    });

  
  async.series([
    function (callback) {
       fs.readFile('mock/photo/IMG_0959.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            callback(null, photo);
          }
          });
    }, 
    function (callback) {
        fs.readFile('mock/photo/IMG_0959.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            imageMagick(photo).identify( function (err, data) {
            if (err) {
              callback(err);
            } else {
              callback(null, data);
            }
          });
          }
        }); 
    }
    ], function (err, photo) {
        registerPhotoTemp(photo, mockPhoto.photo02); 
    });

  
  async.series([
    function (callback) {
       fs.readFile('mock/photo/IMG_7518.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            callback(null, photo);
          }
          });
    }, 
    function (callback) {
        fs.readFile('mock/photo/IMG_7518.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            imageMagick(photo).identify( function (err, data) {
            if (err) {
              callback(err);
            } else {
              callback(null, data);
            }
          });
          }
        }); 
    }
    ], function (err, photo) {
        registerPhotoTemp(photo, mockPhoto.photo03); 
    });
 
  async.series([
    function (callback) {
       fs.readFile('mock/photo/083 copy.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            callback(null, photo);
          }
          });
    }, 
    function (callback) {
        fs.readFile('mock/photo/083 copy.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            imageMagick(photo).identify( function (err, data) {
            if (err) {
              callback(err);
            } else {
              callback(null, data);
            }
          });
          }
        }); 
    }
    ], function (err, photo) {
        registerPhotoTemp(photo, mockPhoto.photo04); 
    });

async.series([
    function (callback) {
       fs.readFile('mock/photo/IMG_1461 copy.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            callback(null, photo);
          }
          });
    }, 
    function (callback) {
        fs.readFile('mock/photo/IMG_1461 copy.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            imageMagick(photo).identify( function (err, data) {
            if (err) {
              callback(err);
            } else {
              callback(null, data);
            }
          });
          }
        }); 
    }
    ], function (err, photo) {
        registerPhotoTemp(photo, mockPhoto.photo05); 
    });
async.series([
    function (callback) {
       fs.readFile('mock/photo/067-P1013615.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            callback(null, photo);
          }
          });
    }, 
    function (callback) {
        fs.readFile('mock/photo/067-P1013615.jpg', function (err, photo) {
          if (err) { 
            callback(err);
          } else {
            imageMagick(photo).identify( function (err, data) {
            if (err) {
              callback(err);
            } else {
              callback(null, data);
            }
          });
          }
        }); 
    }
    ], function (err, photo) {
        registerPhotoTemp(photo, mockPhoto.photo06); 
    });

};
