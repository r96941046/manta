// register.js
//
// Module Dependencies
var lib_register = require('../modules/lib_register.js');
var async = require('async');

var register = module.exports = function () {
  
  async.waterfall([
      function(callback) {
        lib_register.getAllVideos(callback);
      },
      function(allVideos, listKeys, callback) {
      
      }, 
      function(results, callback) {
      
      }
      
      ]);

/*  async.series({
    videos : function (callback) {
              lib_register.getAllVideos(callback);
             },
    lists : function (callback) {
             lib_register.getAlbumLists(callback);
            }
  }, function (err, results) {
   if (err instanceof Error) {
    console.log('Error: ' + err);
   } else {
     console.log('-------------------------------------------');
     console.log(results);*/
/*      console.log('-------------------------------------------'); */
/*     console.log(results.lists.all);
     console.log('-------------------------------------------');
     console.log(results.lists.index);
     console.log('-------------------------------------------');
     console.log(results.lists.library);*/
/*   }
  
  });

*/
};

