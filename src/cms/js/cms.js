var t       = require('modules/templater.js');
var ui      = require('modules/ui.js');
var loadCSS = require('modules/loadcss').init;


"use strict";

module.exports = {

  config: {
    'name'            :           'default CMS options',
    'templates'       :           [ '_article-full-width.tmpl', '_article-left.tmpl', '_article-right.tmpl', '_cms-script.tmpl', '_hero-center.tmpl', '_image-center.tmpl', '_image-fixed.js.tmpl', '_image-fixed.tmpl index.tmpl', '_scrollmation-text-left.js.tmpl', '_scrollmation-text-left.tmpl', '_stat-text.js.tmpl', '_stat-text.tmpl', '_youtube-full-width.tmpl' ],
    'sectionSelector' :           'body .section',
    'sectionContainer':           '<div class="section"></div>', 
    'editableItems'   :           [ 'h1', 'h2', 'p', 'li' ],
    'editableRegionClass' :       'editable-region',
    'inlineMediaContainers' :     '.scrollmation-container p[contenteditable],.article:not(.article-right):not(.article-left) p[contenteditable]',
    'responsiveImageSelector':    'picture, .scrollmation-container',
    'mustardClass'    :           'html5-cms',
  },

  getConfig: function (){
    return this.config;
  },

  setConfig: function (config){
    this.config = config || this.config;
  },

  init: function(config){
    this.setConfig(config);

    if (this.cutsTheMustard()) this.addMustard();

    // load our templater
    t.init(this.config);
    
    //add CMS UI
    ui.init(this.config);

    this.loadStylesheets();

    return true // if we loaded up ok
  },

  cutsTheMustard: function () {
    var cutsTheMustard = (
      'querySelector' in document
      && 'localStorage' in window
      && 'addEventListener' in window);
    return cutsTheMustard;
  },

  addMustard: function (){
    var mustardClass = this.config.mustardClass;
    document.getElementsByTagName('body')[0].classList.add(mustardClass);
  },

  loadStylesheets: function (){
    var stylesheets = [ 'cms/css/vendor.css', 'cms/css/cms.css' ];
    stylesheets.forEach(function(val){
      loadCSS(val);
    });
  },

};