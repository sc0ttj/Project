var xhr = [],
    i = i || 0;

"use strict";

module.exports = {

  create: function(method, url) {
    i++;
    xhr[i] = new XMLHttpRequest();
    xhr[i].open(method, url, true);
    // console.log(i, xhr);
    return xhr[i];
  },

  send: function (formData) {
    xhr[i].send(formData);
  },

  onProgress: function(callback){
    xhr[i].upload.onprogress = function (e) {
      if (e.lengthComputable) {
        callback(e);
      }
    }
  },

  onFinish: function(successCallback, errorCallback){
    xhr[i].onload = function() {
      if (xhr[i].status === 200) {
        successCallback(xhr[i].responseText);
        xhr[i] = '';
      } else {
        errorCallback(xhr[i].responseText);
      }
    }
  },

}