var $             = require('cash-dom');
var loadCSS       = require('modules/loadcss').init;
var store         = require('store');
var zenscroll     = require('zenscroll');

// note: var 'translateOnly' was set either true or false by our PHP backend
// if true, Cms should disable editing of page, and only allow editing of translation

"use strict";

module.exports = {

  config: {
    'name'            :           'default options',
    'templates'       :           [ '_article-full-width.tmpl', '_article-left.tmpl', '_article-right.tmpl', '_hero-center.tmpl', '_image-center.tmpl', '_image-fixed.tmpl', '_scrollmation-text-left.tmpl', '_stat-text.tmpl', '_youtube-full-width.tmpl', '_video.tmpl', '_video-full-width.tmpl' ],
    'sectionSelector' :           'body .section',
    'sectionContainer':           '<div class="section"></div>', 
    'editableItems'   :           [ 'h1', 'h2', 'p', 'blockquote', 'li' ],
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

    this.restoreProgress();
    if (this.cutsTheMustard()) this.addMustard();
    this.loadStylesheets();
    this.setupSmoothScrolling();
    // this.autoSave();

    this.ajax           = require('modules/ajaxer');
    this.modal          = require('modules/modal');
    this.editor         = require('modules/page_editor');
    this.videoManager   = require('modules/video_manager');
    this.imageManager   = require('modules/image_manager');
    this.sectionManager = require('modules/section_manager');
    this.metaManager    = require('modules/meta_manager');
    this.previewManager = require('modules/preview_manager');
    this.exportManager  = require('modules/export_manager');
    this.templater      = require('modules/templater');
    this.translationManager = require('modules/translation_manager');
    this.vocabEditor    = require('modules/vocab_editor');
    this.fileManager    = require('modules/file_manager');
    this.ui             = require('modules/ui');

    this.modal.init();
    this.vocabEditor.init();
    this.previewManager.init();
    this.exportManager.init();
    if (!cms.showTranslation() && !translateOnly){
      this.editor.init();
      this.videoManager.init();
      this.imageManager.init();
      this.sectionManager.init();
      this.metaManager.init();
      this.fileManager.init();
      this.templater.init();
      this.translationManager.init();
      this.ui.init();
    }

    if (this.showTranslation()) this.vocabEditor.translatePage();

    return true // if we loaded up ok
  },

  setupSmoothScrolling: function () {
    var defaultDuration = 400; // ms
    var edgeOffset = 0; // px
    zenscroll.setup(defaultDuration, edgeOffset);
  },

  reload: function (){
    if (this.showTranslation()) return false;
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

  showTranslation: function (){
    if (this.getQueryVariable('preview') != '') return true;
    return false;    
  },

  autoSave: function () {
    if (this.showTranslation()) return false;
    setInterval(this.saveProgress, 30000);
  },

  saveProgress: function(){
    if (cms.showTranslation()) return false;

    var $html = $('body').clone(),
        $head = $('head').clone(),
        html  = '';

    $html.find('.cms-menu-container, .cms-menu, .cms-modal, .cms-media-btn, .cms-menu-btn').remove();
    $html.find('#cms-init, link[href^="cms"]').remove();
    //reset page to defaults
    $html.find('body').removeClass('js');
    $html.find('.video-overlay').removeClass('hidden');
    $html.find('.video-overlay-button').html('▶');
    $html.find('*').removeClass('scrollmation-image-container-fixed');
    //get cleaned up html
    html = $html.html();

    html = cms.exportManager.cleanupWhitespace(html);

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

  //https://css-tricks.com/snippets/javascript/get-url-variables/
  getQueryVariable: function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){return pair[1];}
    }
    return(false);
  },

};