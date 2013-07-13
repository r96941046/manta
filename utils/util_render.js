// util_render.js
//
// Module Dependencies
var redis = require('redis')
    , client = redis.createClient();

module.exports = util_render = {};

util_render.renderIndex (res) {
  client.lindex('video:album:index', 1, function (indexFirst) {
    client.hget(indexFirst, html, function (html) {
      console.log(html);
    })
  })

}
