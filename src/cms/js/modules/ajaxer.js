var xhr;

"use strict";

module.exports = {

  create: function(method, url) {
    xhr = new XMLHttpRequest()
    xhr.open(method, url, true);
    return xhr;
  },

  send: function (formData) {
    xhr.send(formData);
  },

  onProgress: function(callback){
    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        callback(e);
      }
    }
  },

  onFinish: function(successCallback, errorCallback){
    xhr.onload = function() {
      if (xhr.status === 200) {
        successCallback();
      } else {
        errorCallback();
      }
    }
  },

}