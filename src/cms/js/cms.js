var $             = require('cash-dom');
var loadCSS       = require('modules/loadcss').init;
var store         = require('store');
var zenscroll     = require('zenscroll');

"use strict";

module.exports = {

  config: {
    'name'            :           'default options',
    'templates'       :           [ '_article-full-width.tmpl', '_article-left.tmpl', '_article-right.tmpl', '_hero-center.tmpl', '_image-center.tmpl', '_image-fixed.tmpl', '_scrollmation-text-left.tmpl', '_stat-text.tmpl', '_youtube-full-width.tmpl', '_video.tmpl', '_video-full-width.tmpl' ],
    'sectionSelector' :           'body .section',
    'sectionContainer':           '<div class="section"></div>', 
    'editableItems'   :           [ 'h1', 'h2', 'p', 'li' ],
    'editableClass'   :           'cms-editable',
    'editableRegionClass' :       'cms-editable-region',
    'inlineMediaRegionSelector':  '.scrollmation-container p[contenteditable],.article:not(.article-right):not(.article-left) p[contenteditable]',
    'responsiveImageSelector':    'picture, .scrollmation-container, .inline-image',
    'videoSelector'   :           'video',
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
    this.pageConfig = app.pageConfig;
    this.pageDir    = window.location.pathname.split('/').slice(0, -1).join('/');

    this.setupSmoothScrolling();
    this.restoreProgress();
    // this.autoSave();

    this.ajax           = require('modules/ajaxer');
    this.modal          = require('modules/modal');
    this.editor         = require('modules/page_editor');
    this.videoManager   = require('modules/video_manager');
    this.imageManager   = require('modules/image_manager');
    this.sectionManager = require('modules/section_manager');
    this.metaManager    = require('modules/meta_manager');
    this.templater      = require('modules/templater');
    this.ui             = require('modules/ui');

    this.modal.init();
    this.editor.init();
    this.videoManager.init();
    this.imageManager.init();
    this.sectionManager.init();
    this.metaManager.init();
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
    cms.videoManager.addVideoClickHandlers();
    cms.imageManager.init();
    app.reload();
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

    cms.saveHtmlToFile(html, cms.showPreviewInModal);
  },

  showPreviewInModal: function () {
    content = '<div class="cms-iframe-resizer">\
      <button class="cms-iframe-resizer-btn" data-width="320px"  data-height="568px">  iPhone 5  </button>\
      <button class="cms-iframe-resizer-btn" data-width="360px"  data-height="640px">  Galaxy S5 </button>\
      <button class="cms-iframe-resizer-btn" data-width="414px"  data-height="736px">  iPhone 6  </button>\
      <button class="cms-iframe-resizer-btn cms-iframe-resizer-btn-ipad" data-width="1024px" data-height="768px">  iPad      </button>\
      <button class="cms-iframe-resizer-btn" data-width="100%" data-height="100%">     Full      </button>\
      <br/>\
      <button class="cms-iframe-resizer-btn cms-iframe-resizer-btn-orientation cms-hidden" data-orientation="switch" style="display:none;"> Switch Orientation ⟳ </button>\
    </div>\
    <iframe id="pagePreview"\
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

    $('.cms-modal-viewport').addClass('cms-modal-viewport-previewer');
    cms.iframeResizeBtnClickHandler();
  },

  iframeResizeBtnClickHandler: function () {
    $('.cms-iframe-resizer-btn').on('click', function resizeIframe() {
      var iframe = $('#pagePreview')[0],
          newHeight,
          newWidth,
          orientation = $(this).data('orientation') || '';

      if (orientation === 'switch'){
        // reverse height and width
        newWidth  = $('#pagePreview')[0].height;
        newHeight = $('#pagePreview')[0].width;
      } else {
        // get height and width from buttons data-*  attrs
        newWidth  = $(this).data('width');
        newHeight = $(this).data('height');
      }

      //resize iframe
      iframe.width  = newWidth;
      iframe.height = newHeight;

      if (iframe.width == '100%'){
        $('.cms-iframe-resizer-btn-orientation').addClass('cms-hidden');
        $('.cms-iframe-resizer-btn-orientation').css('display', 'none');
      } else {
        $('.cms-iframe-resizer-btn-orientation').removeClass('cms-hidden');
        $('.cms-iframe-resizer-btn-orientation').css('display', 'inline-block');
      }
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
    $html.find('.video-overlay-button').html('▶');
    $html.find('.video-overlay-button').removeClass('hidden');
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
        $head = $('head').clone(),
        html  = '';

    $html.find('.cms-menu-container, .cms-menu, .cms-modal, .cms-media-btn, .cms-menu-btn').remove();
    $html.find('#cms-init, link[href^="cms"]').remove();
    $html.find('.video-overlay-button').html('▶');
    $html.find('.video-overlay-button').removeClass('hidden');
    $html.find('*').removeClass('scrollmation-image-container-fixed');
    html = $html.html();

    // save cleaned up html to localstorage
    store.set(this.pageDir + '__head', $head.html());
    store.set(this.pageDir, html);
    console.log('Saved progress..');
  },

  restoreProgress: function(){
    var html = store.get(this.pageDir),
        head = store.get(this.pageDir + '__head'),
        restored = false;

    if (html) {
      $('body').html(html);
      restored = true;
    }
    if (head) {
      $('head').html(head);
      restored = true;
    }
    if (restored) app.reload();
  },

};