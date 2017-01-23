var $             = require('cash-dom');
var loadCSS       = require('modules/loadcss').init;
var store         = require('store');
var zenscroll     = require('zenscroll');

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

    this.setupSmoothScrolling();

    this.restoreProgress();
    // this.autoSave();

    this.ajax           = require('modules/ajaxer');
    this.modal          = require('modules/modal');
    this.editor         = require('modules/page_editor');
    this.imageManager   = require('modules/image_manager');
    this.sectionManager = require('modules/section_manager');
    this.templater      = require('modules/templater');
    this.ui             = require('modules/ui');

    this.modal.init();
    this.editor.init();
    this.imageManager.init();
    this.sectionManager.init();
    this.templater.init();
    this.ui.init();

    if (this.cutsTheMustard()) this.addMustard();
    this.loadStylesheets();
    return true // if we loaded up ok
  },

  setupSmoothScrolling: function () {
    var defaultDuration = 400; // ms
    var edgeOffset = 0; // px
    zenscroll.setup(defaultDuration, edgeOffset);
  },

  reload: function (){
    cms.editor.setEditableItems(this.config.editableItems);
    cms.editor.setEditableRegions(this.config.editableRegionClass);
    cms.editor.setEventHandlers();
    cms.imageManager.init();
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

  previewPage: function () {
    this.ui.hideMenu();
    var html = cms.getPageHTMLWithoutCMS();

    cms.saveHtmlToFile(html, function thenPreviewInModal(){
      content = '<iframe id="pagePreview"\
        title="Page Preview"\
        width="100%"\
        height="100%"\
        frameborder="0"\
        marginheight="0"\
        marginwidth="0"\
        src="preview.html?c'+Math.random()+'">\
      </iframe>';
      // load modal
      cms.modal.create({
        title: 'Page Preview',
        contents: content
      });
      cms.modal.show();      
    });

  },

  savePage: function(){
    this.ui.hideMenu();
    var html = cms.getPageHTMLWithoutCMS();
    cms.saveHtmlToFile(html, cms.saveToZip);
  },

  getPageHTMLWithoutCMS: function () {
    var cleanHTML = '',
        $html = $('html').clone();

    cms.config.editableItems.forEach(function (el) {
      $html.find(el+':empty').remove();
    });
    // remove elems added by cms
    $html.find('.cms-menu-container, .cms-menu, .cms-menu-bg, .cms-modal, .cms-media-btn, .cms-menu-btn').remove();
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

  saveHtmlToFile: function(html, callback) {
    var data = new FormData();
    data.append('html', html);

    this.ajax.create('POST', 'cms/api/preview.php');
    var successHandler = function (responseText) {
      console.log(responseText);
      callback();
    }
    var errorHandler = function (responseText) {
      console.log(responseText);
    }
    this.ajax.onFinish(successHandler, errorHandler);
    this.ajax.send(data);
  },

  saveToZip: function () {
    var data = new FormData();
    data.append('savetozip', 'true');

    cms.ajax.create('POST', 'cms/api/save.php');
    var successHandler = function (responseText) {
      console.log(responseText);
      window.location = responseText;
    }
    var errorHandler = function (responseText) {
      console.log(responseText);
    }
    cms.ajax.onFinish(successHandler, errorHandler);
    cms.ajax.send(data);
  },

  autoSave: function () {
    setInterval(this.saveProgress, 30000);
  },

  saveProgress: function(){
    var $html = $('body').clone(),
        html  = '';

    $html.find('.cms-menu-container, .cms-menu, .cms-modal, .cms-media-btn, .cms-menu-btn').remove();
    $html.find('#cms-init, link[href^="cms"]').remove();
    html = $html.html();
    // save cleaned up html to localstorage
    store.set('page', html);
    console.log('Saved progress..');
  },

  restoreProgress: function(){
    var html = store.get('page');
    if (html) {
      $('body').html(html);
      app.reload();
    }
  },

};