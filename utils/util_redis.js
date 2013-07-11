// util_redis.js
//
// Module dependencies
var redis = require('redis')
    , client = redis.createClient();

module.exports = util_redis = {};

util_redis.compareSets(allVideos, listKeys, callback) {
  client.on('error', function(err) {
    console.log('Error: ' + err);
  });  
  
  console.log(client.exists('video:all'));
  
}
