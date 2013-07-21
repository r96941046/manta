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
               arr[i].html = 'http:\/\/player.vimeo.com\/video\/' + arr[i].id;
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

helpers.photoIdEncode = function (str) {
  return str.slice(0, 19).match(/[0-9]/g).join("");
}

helpers.trimPath = function (str) {
  return str.slice(10);
}

helpers.trimTime = function (str) {
  return str.slice(0, 10).replace(/-/g, '.');
} 
