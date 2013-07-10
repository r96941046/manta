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

helpers.appendVideoEmbed = function (arr) {
  if (!(arr instanceof Array)) {
     return new Error('Video dara from vimeo is not an array');
     } else {
        for (i = 0; i < arr.length; i++) {
               arr[i].html = '<iframe src=\"http:\/\/player.vimeo.com\/video\/'
               + arr[i].id
               + '\" width=\"1920\" height=\"1080\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowFullScreen><\/iframe>';
        }
      return arr;
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
