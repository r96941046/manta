// util_render.js
//
// Module Dependencies
var redis = require('redis')
    , client = redis.createClient();

module.exports = util_render = {};

util_render.renderIndex = function (res) {
  client.exists('video:index', redis.print);
  client.lindex('video:index', 0, function (err, indexFirst) {
    console.log(indexFirst);
    client.hgetall(indexFirst, function (err, html) {
      console.log(html);
    })
  });

}
