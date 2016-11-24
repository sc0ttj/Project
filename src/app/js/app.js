var $ = require('cash-dom');

"use strict";

module.exports = {
  init: function(){
    console.log('main app started');

    if (this.cutsTheMustard()){
      console.log('getting full experience');
      // add mustard
      $('body').addClass('with-mustard');

      // load cms with custom options
      var cms = require('cms');
      var cmsConfig = {"name" : "custom CMS options"};
      cms.init(cmsConfig);
    }

  },
  cutsTheMustard: function () {
    var cutsTheMustard = (
      'querySelector' in document
      && 'localStorage' in window
      && 'addEventListener' in window);
    return cutsTheMustard;
  }
}