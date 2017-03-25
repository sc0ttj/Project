// # ajaxer.js
// A simple AJAX module

// Store the xhr requests in an array for easier logging/debugging:
var xhr = [],
    i = i || 0;

// Use strict setting
"use strict";

// Define the CommonJS module
module.exports = {

  // ## Module Methods

  // ### create(method, url)
  // @param `method` - POST or GET  
  // @param `url` - the URL  
  create: function(method, url) {
    i++;
    xhr[i] = new XMLHttpRequest();
    xhr[i].open(method, url, true);
    /* console.log(i, xhr); */
    return xhr[i];
  },

  // ### send(formData)
  // @param `formData` - a valid [formData](https://developer.mozilla.org/en/docs/Web/API/FormData) object  
  send: function (formData) {
    xhr[i].send(formData);
  },

  // ### onProgress(callback)
  // @param `callback` - a callback function to execute on progress update  
  onProgress: function(callback){
    xhr[i].upload.onprogress = function (e) {
      if (e.lengthComputable) {
        callback(e);
      }
    };
  },

  // ### onFinish(successCallback, errorCallback)
  // @param `successCallback` - a func to execute on success  
  // @param `errorCallback` - a func to execute on failure  
  onFinish: function(successCallback, errorCallback){
    xhr[i].onload = function() {
      /* console.log(xhr[i]); */
      if (xhr[i].status === 200) {
        successCallback(xhr[i].responseText);
      } else {
        errorCallback(xhr[i].responseText);
      }
    };
  },

// End of module
};
