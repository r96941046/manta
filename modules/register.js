// register.js
//
// Module Dependencies
var lib_register = require('../modules/lib_register.js');
var async = require('async');

var register = module.exports = function () {

  async.waterfall([
        function (callback) {
          lib_register.getAllVideos(callback);
        },
        function (results) {
          console.log(results);
        }
      
      ]);


};

