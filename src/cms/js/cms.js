var t       = require('modules/templater.js');
var ui      = require('modules/ui.js');
var loadCSS = require('modules/loadcss').init;


"use strict";

module.exports = {

  config: {
    'name'            : 'default CMS options',
    'templates'       : ['hero-center.tmpl', 'article-full-width.tmpl', 'stat-text.tmpl', 'image-center.tmpl', 'article-right.tmpl', 'image-fixed.tmpl', 'article-left.tmpl', 'youtube-full-width.tmpl', 'article-full-width.tmpl', 'scrollmation-text-left.tmpl', 'article-full-width.tmpl'  ],
    'templatesDir'    : 'templates/',
    'sectionContainer': '<div class="section"></div>', 
    'sectionSelector' : 'body .section',
    'mustardClass'    : 'html5-cms',
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
    
    //get list of templates
    var templates = t.getTemplates();
    // render templates to page
    t.processTemplates(templates, t.renderTemplate);

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