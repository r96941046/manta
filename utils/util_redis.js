// util_redis.js
//
// Module dependencies
var redis = require('redis')
    , client = redis.createClient();
var async = require('async');
var helpers = require('../helpers/helpers.js');

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
            .del('video:index', function (err, reply) {
              indexKeys.forEach ( function (membersToPush) {
                client.rpush('video:index', membersToPush);
              });
            })
            .del('video:library', function (err, reply) {
              libraryKeys.forEach ( function (membersToPush) {
                client.rpush('video:library', membersToPush);
              });
            })
            .exec(function (err, logs) {
              if (err instanceof Error) {
                callback(err);
              } else {
                callback(null, logs);
              }
            });
}

util_redis.getIndexVideo = function (callback) {
  client.lrange('video:index', 0, -1, function (err, indexList) {
    async.map(indexList
      , function (index, callback) {
        client.hgetall(index, function (err, videoHash) {
          if (err instanceof Error) {
            callback(err);
          } else {
            callback(null, {
               thumbnail_medium : videoHash.thumbnail_medium
              , title : videoHash.title
              , upload_date : videoHash.upload_date
              , description : videoHash.description
              , html : videoHash.html
            });
          }
        });
      }, function (err, results) {
        if (err instanceof Error) {
          callback(err);
        } else {
          callback(null, { indexVideo : results });
        }
      });  
  });
}

util_redis.writePhoto = function (itemsToWrite, callback) {
  
  var photohash = 'photo:' + itemsToWrite.Id
      , photolist = itemsToWrite.List;

  client.multi()
    .hmset( photohash, itemsToWrite)
    .sadd('photo:all', photohash)
    .rpush('photo:' + photolist, photohash)
    .exec( function (err, logs) {
      if (err) {
        callback(err);
      } else {
        console.log('Add ' + photohash + ' to list successfully!');
        callback(null, logs);
      }   
    })
}

util_redis.getIndexNews = function (callback) {
  client.lrange('photo:news', -3, -1, function (err, newsList) {
    async.map(newsList
      , function (news, callback) {
        client.hgetall(news, function (err, photoHash) {
          if (err instanceof Error) {
            callback(err);
          } else {
            callback(null, {
               DateTime : helpers.trimTime(photoHash.DateTime)
              , Description : photoHash.Description
              , Spath : helpers.trimPath(photoHash.Spath)
            });
          }
        });
      }, function (err, results) {
        if (err instanceof Error) {
          callback(err);
        } else {
          callback(null, { indexNews : results.reverse() });
        }
      });  
  });
}
