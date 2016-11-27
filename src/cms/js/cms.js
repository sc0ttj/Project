"use strict";

module.exports = {

  config: {
    'name'            : 'default CMS options',
    'templates'       : ['hero-center.tmpl', 'article-center.tmpl', 'article-full-width.tmpl', 'article-left.tmpl', 'article-right.tmpl'],
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
    var t = require('modules/templater.js');
    t.init(this.config);
    
    //get list of templates
    var templates = t.getTemplates();
    // render templates to page
    t.processTemplates(templates, t.renderTemplate);

    //add CMS UI
    var ui = require('modules/ui.js');
    ui.init(this.config);

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

};