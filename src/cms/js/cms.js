var $       = require('cash-dom');
var t       = require('modules/templater.js');
var ui      = require('modules/ui.js');
var ajax    = require('modules/ajaxer.js');
var loadCSS = require('modules/loadcss').init;


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

    if (this.cutsTheMustard()) this.addMustard();

    // load our templater
    t.init(this.config);
    
    //add CMS UI
    ui.init(this.config);

    this.loadStylesheets();

    return true // if we loaded up ok
  },

  reload: function (){
    cms.editor.setEditableItems(this.config.editableItems);
    cms.editor.setEditableRegions(this.config.editableRegionClass);
    cms.editor.setEventHandlers();
    cms.mediaEditor.init(this.config);
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
    ui.hideMenu();
    var html = cms.getPageHtml();
    cms.saveHtmlToFile(html);
  },

  getPageHtml: function () {
    var html = '',
        $htmlWithoutCMS = $('html').clone();

    cms.config.editableItems.forEach(function (el) {
      $htmlWithoutCMS.find(el+':empty').remove();
    });

    $htmlWithoutCMS.find('.cms-menu, .cms-menu-bg, .cms-media-chooser, .cms-media-btn, .cms-menu-btn').remove();
    $htmlWithoutCMS.find('*').removeClass('cms-editable');
    $htmlWithoutCMS.find('*').removeClass('cms-editable-img');
    $htmlWithoutCMS.find('*').removeClass('cms-editable-region');
    $htmlWithoutCMS.find('*').removeClass('cms-inline-media');
    $htmlWithoutCMS.find('*').removeClass(cms.config.mustardClass);
    $htmlWithoutCMS.find('*').removeAttr('contenteditable');
    $htmlWithoutCMS.find('*').removeAttr('spellcheck');

    $htmlWithoutCMS.find('script[src^="cms"]').remove();
    $htmlWithoutCMS.find('#cms-init').remove();
    $htmlWithoutCMS.find('link[href^="cms"]').remove();
    $htmlWithoutCMS.find('*[class=""]').removeAttr('class');

    // reset templates so they work on pages with no js
    // move this to app.reset()  ... or something
    $htmlWithoutCMS.find('*').removeClass('anim-fade-1s');
    $htmlWithoutCMS.find('*').removeClass('transparent');
    $htmlWithoutCMS.find('*').removeClass('scrollmation-text-js');
    $htmlWithoutCMS.find('*').removeClass('scrollmation-image-container-top');
    $htmlWithoutCMS.find('*').removeClass('scrollmation-image-container-fixed');
    $htmlWithoutCMS.find('*').removeClass('scrollmation-image-container-bottom');
    $htmlWithoutCMS.find('.scrollmation-text').addClass('article');

    html = $htmlWithoutCMS.html();

    return '<!DOCTYPE html>\n<html lang="en">\n' + html + '</html>';
  },

  saveHtmlToFile: function(html) {
    var data = new FormData();
    var filename = prompt('Please enter the filename', 'my-article-name.html');

    if (filename){
      data.append('html', html);
      data.append('filename', filename);

      ajax.create('POST', 'save.php');
      var successHandler = function (responseText) {
        // alert(responseText);
      }
      var errorHandler = function (responseText) {
        // alert('file save error');
      }
      ajax.onFinish(successHandler, errorHandler);
      ajax.send(data);
    }

  },

};