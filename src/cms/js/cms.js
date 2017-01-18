var $             = require('cash-dom');
var loadCSS       = require('modules/loadcss').init;

"use strict";

module.exports = {

  config: {
    'name'            :           'default options',
    'templates'       :           [ '_article-full-width.tmpl', '_article-left.tmpl', '_article-right.tmpl', '_hero-center.tmpl', '_image-center.tmpl', '_image-fixed.tmpl', '_scrollmation-text-left.tmpl', '_stat-text.tmpl', '_youtube-full-width.tmpl' ],
    'sectionSelector' :           'body .section',
    'sectionContainer':           '<div class="section"></div>', 
    'editableItems'   :           [ 'h1', 'h2', 'p', 'li' ],
    'editableClass'   :           'cms-editable',
    'editableRegionClass' :       'cms-editable-region',
    'inlineMediaRegionSelector':  '.scrollmation-container p[contenteditable],.article:not(.article-right):not(.article-left) p[contenteditable]',
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
    this.pageConfig    = app.pageConfig;

    this.ajax          = require('modules/ajaxer.js');
    this.editor        = require('modules/inline_editor');
    this.mediaEditor   = require('modules/inline_media_editor');
    this.sectionEditor = require('modules/section_editor');
    this.templater     = require('modules/templater.js');
    this.ui            = require('modules/ui.js');

    this.editor.init();
    this.mediaEditor.init();
    this.sectionEditor.init();
    this.templater.init();
    this.ui.init();

    if (this.cutsTheMustard()) this.addMustard();
    this.loadStylesheets();
    return true // if we loaded up ok
  },

  reload: function (){
    cms.editor.setEditableItems(this.config.editableItems);
    cms.editor.setEditableRegions(this.config.editableRegionClass);
    cms.editor.setEventHandlers();
    cms.mediaEditor.init();
    app.fixedImage.init();
    app.scrollmation.init();
    app.statText.init();
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

  savePage: function(){
    this.ui.hideMenu();
    var html = cms.getPageHTMLWithoutCMS();
    cms.saveHtmlToFile(html);
  },

  getPageHTMLWithoutCMS: function () {
    var cleanHTML = '',
        $html = $('html').clone();

    cms.config.editableItems.forEach(function (el) {
      $html.find(el+':empty').remove();
    });
    // remove elems added by cms
    $html.find('.cms-menu, .cms-menu-bg, .cms-media-chooser, .cms-media-btn, .cms-menu-btn').remove();
    // remove all classes and attributes
    $html.find('*').removeClass('cms-editable cms-editable-img cms-editable-region cms-inline-media');
    $html.find('*').removeClass(cms.config.mustardClass);
    $html.find('*').removeAttr('contenteditable');
    $html.find('*').removeAttr('spellcheck');
    // remove cms scripts
    $html.find('script[src^="cms"], #cms-init, link[href^="cms"]').remove();
    $html.find('*[class=""]').removeAttr('class');
    // reset app templates so they work on pages with no js
    // move to a method in the main app
    $html.find('*').removeClass('anim-fade-1s transparent scrollmation-text-js scrollmation-image-container-top scrollmation-image-container-fixed scrollmation-image-container-bottom');
    $html.find('.scrollmation-text').addClass('article');
    // get cleaned html
    cleanHTML = $html.html();

    return '<!DOCTYPE html>\n<html lang="en">\n' + cleanHTML + '</html>';
  },

  saveHtmlToFile: function(html) {
    var data = new FormData();
    var filename = prompt('Please enter the filename', 'my-article-name.html');

    if (filename){
      data.append('html', html);
      data.append('filename', filename);

      this.ajax.create('POST', 'save.php');
      var successHandler = function (responseText) {
        // alert(responseText);
      }
      var errorHandler = function (responseText) {
        // alert('file save error');
      }
      this.ajax.onFinish(successHandler, errorHandler);
      this.ajax.send(data);
    }

  },

};