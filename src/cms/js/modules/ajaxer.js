"use strict";

module.exports = {

  create: function(method, url) {
    var xhr = new XMLHttpRequest()
    xhr.open(method, url, true);
    self._xhr = xhr;
    return xhr;
  },

  send: function (formData) {
    self._xhr.send(formData);
  },

  onProgress: function(callback){
    self._xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        callback(e);
      }
    }
  },

  onFinish: function(successCallback, errorCallback){
    self._xhr.onload = function() {
      if (self._xhr.status === 200) {
        successCallback();
      } else {
        errorCallback();
      }
    }
  },

}