// helpers.js
//
// Module dependencies

var helpers = module.exports = {};

helpers.getVideoUrl = function (arr) {
  var videoUrls = [];
  if (!(arr instanceof Array)) {
    return new Error('Video data from vimeo is not an array');
  } else {
    for (i = 0; i < arr.length; i++) {
      videoUrls[i] = arr[i].url
    }
    return videoUrls;
  }
}

helpers.getListKeys = function (arr) {
  var listKeys = [];
  if (!(arr instanceof Array)) {
    return new Error('Video data from vimeo is not an array');
  } else {
    for (i = 0; i < arr.length; i++) {
      listKeys[i] = 'video:' + arr[i].id;
    }
    return listKeys;
  }
}
