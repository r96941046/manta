// register.js
//
// A function module
// Send request to vimeo, acquire information about videos in an album

// Module dependencies

var restler = require('restler')
    , async = require('async')
    , URL = require('../utils/URL.js')
    , util_vimeo = require('../utils/util_vimeo.js')
    , util_redis = require('../utils/util_redis');
var redis = require('redis')
    , client = redis.createClient();

module.exports = register =  function() {
  async.waterfall([
    function (callback) {
      util_vimeo.getRegisterItems(callback);
    },
    function (itemsToRegister, callback) {
      util_redis.registerAllItems(itemsToRegister, callback);
    }

  ], function (err, redisLogs) {
    if (err instanceof Error) {
      console.log('Error: ' + err);
    } else {
      client.smembers('video:all:temp', redis.print);
      client.smembers('video:all:add', redis.print);
      client.smembers('video:all:delete', redis.print);
      client.smembers('video:all', redis.print);
      client.lrange('video:index', 0, -1, redis.print);
      client.lrange('video:library', 0,-1, redis.print);
      client.lrange('video:index:temp', 0, -1, redis.print);
      client.lrange('video:library:temp', 0, -1, redis.print);
    }
  });
};
