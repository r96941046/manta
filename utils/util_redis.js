// util_redis.js
//
// Module dependencies
var redis = require('redis')
    , client = redis.createClient();

module.exports = util_redis = {};

util_redis.registerAllItems = function (itemsToRegister, callback) {
      
      var allVideos = itemsToRegister.allVideos
          , allKeys = itemsToRegister.albums.allKeys
          , indexKeys = itemsToRegister.albums.indexKeys
          , libraryKeys = itemsToRegister.albums.libraryKeys;

      client.multi()
            // Delete temp keys
            .del(['video:all:temp'
                   , 'video:all:delete'
                   , 'video:all:add'
                   , 'video:index:temp'
                   , 'video:library:temp']
                   , redis.print)
            // Create temp set for all videos
            .sadd('video:all:temp', allKeys, redis.print)
            // Create temp set for videos to add and delete
            .sdiffstore('video:all:delete', 'video:all', 'video:all:temp', redis.print)
            .sdiffstore('video:all:add', 'video:all:temp', "video:all", redis.print)
            // Create hashs for videos to add
            .smembers('video:all:add', function (err, membersToAdd) {
                membersToAdd.forEach( function (member) {
                  for ( i = 0; i < allKeys.length; i++) {
                    if (allKeys[i] == member) {
                      client.hmset(member, allVideos[i]);
                    }
                  }
                });
              })
            // Create hashs for videos to delete  
            .smembers('video:all:delete', function (err, membersToDelete) {
                if (membersToDelete.length != 0) {
                  client.del(membersToDelete); 
                }
              })
            // Replace sets and album lists
            .del('video:all')
            .rename('video:all:temp', 'video:all', redis.print)
            .lpush('video:index:temp', indexKeys)
            .del('video:index')
            .rename('video:index:temp', 'video:index', redis.print)
            .lpush('video:library:temp', libraryKeys)
            .del('video:library')
            .rename('video:library:temp', 'video:library', redis.print)
            .exec(function (err, logs) {
              if (err instanceof Error) {
                callback(err);
              } else {
                callback(null, logs);
              }
            });
}
