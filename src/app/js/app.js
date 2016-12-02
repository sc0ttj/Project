var loadCSS = require('modules/loadcss').init;
var loadJS = require('modules/loadjs');

"use strict";

module.exports = {

  init: function(){
    if (this.cutsTheMustard()){
      // add mustard
      $('body').addClass('html5');

      //load 'nice-to-haves'
      this.loadStylesheet('css/full.css');
      this.loadModules(['test', 'test1']);

      // load cms with custom options
      var cms = require('cms');
      var cmsConfig = {
        'name'            : 'custom options',
        'templates'       : ['hero-center.tmpl', 'article-full-width.tmpl', 'stat-text.tmpl', 'image-center.tmpl', 'article-right.tmpl', 'image-fixed.tmpl', 'article-left.tmpl', 'youtube-full-width.tmpl', 'article-full-width.tmpl', 'scrollmation-text-left.tmpl', 'article-full-width.tmpl'  ],
        'templatesDir'    : './templates/',
        'sectionSelector' : 'body .section',
        'sectionContainer': '<div class="section"></div>', 
        'mustardClass'    : 'with-cms',
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
  },

  loadStylesheet: function (file) {
    loadCSS(file);
  },

  loadModules: function (modules) {
    loadJS('js/enhancements.js', function(){
      modules.forEach(function(val, i){
        require('enhancements/' + val).init();
      });
    });
  },

}