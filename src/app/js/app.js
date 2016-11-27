var $ = require('cash-dom');

"use strict";

module.exports = {

  init: function(){
    if (this.cutsTheMustard()){
      // add mustard
      $('body').addClass('html5');


      // load cms with custom options
      var cms = require('cms');
      var cmsConfig = {
        'name'            : 'custom options',
        'templates'       : ['hero-center.tmpl', 'article-center.tmpl', 'article-full-width.tmpl', 'article-right.tmpl', 'article-left.tmpl' ],
        'templatesDir'    : './templates/',
        'sectionSelector' : 'body .section',
        'sectionContainer': '<div class="section"></div>', 
        'mustardClass'    : 'mustard-cms',
      };
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