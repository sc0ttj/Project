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

    this.restoreProgress();
    this.setupSmoothScrolling();
    // this.autoSave();

    this.ajax           = require('modules/ajaxer');
    this.modal          = require('modules/modal');
    this.editor         = require('modules/page_editor');
    this.videoManager   = require('modules/video_manager');
    this.imageManager   = require('modules/image_manager');
    this.sectionManager = require('modules/section_manager');
    this.metaManager    = require('modules/meta_manager');
    this.templater      = require('modules/templater');
    this.vocabEditor    = require('modules/vocab_editor');
    this.ui             = require('modules/ui');

    if (!cms.showTranslation()){
      this.modal.init();
      this.editor.init();
      this.videoManager.init();
      this.imageManager.init();
      this.sectionManager.init();
      this.metaManager.init();
      this.templater.init();
      this.ui.init();
    }
    this.vocabEditor.init();

    if (this.cutsTheMustard()) this.addMustard();
    this.loadStylesheets();

    if (this.showTranslation()) this.translatePage();

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

  previewPage: function () {
    this.ui.hideMenu();
    var html = cms.getPageHTMLWithoutCMS();
    html = cms.addDocType(html);
    cms.saveHtmlToFile(html, cms.showPreviewInModal);
  },

  showPreviewInModal: function () {
    var lang;

    var content = '<div class="cms-iframe-resizer">\
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
      var $this  = $(this),
          iframe = $('#pagePreview')[0],
          newHeight,
          newWidth,
          orientation = $(this).data('orientation') || '',
          iframeResizeBtn = $('.cms-iframe-resizer-btn-orientation');


      if (orientation === 'switch'){
        // reverse height and width
        newWidth  = iframe.height;
        newHeight = iframe.width;
      } else {
        // get height and width from buttons data-*  attrs
        newWidth  = $this.data('width');
        newHeight = $this.data('height');
      }

      //resize iframe
      iframe.width  = newWidth;
      iframe.height = newHeight;

      if (iframe.width == '100%'){
        iframeResizeBtn.addClass('cms-hidden');
        iframeResizeBtn.css('display', 'none');
      } else {
        iframeResizeBtn.removeClass('cms-hidden');
        iframeResizeBtn.css('display', 'inline-block');
      }
    });
  },

  showTranslation: function (){
    if (this.getQueryVariable('preview') != '') return true;
    return false;    
  },

  translatePage: function(){
    var tmpHtml = document.createElement('HTML'),
        $html = '',
        editableItemSelector='',
        metaSelector = 'meta[name^="title"], meta[name^="description"], meta[name^="author"], meta[name^="keywords"], meta[name^="news_keywords"], meta[name^="copyright"], meta[name^="twitter"], meta[property], meta[itemprop]';

    cms.vocabEditor.getPreviewPageHtml(function (html){
      tmpHtml.innerHTML = html;
      $html = $(tmpHtml);

      // if 'vocabs/[lang].json exists, get contents of vocab file
      cms.vocabEditor.getVocabFileContents(function vocabReturnedOK(vocab){
        // get html of preview page (in the iframe)
        var vocab = JSON.parse(vocab),
            index = '';

        // replace meta items
        $html.find(metaSelector).each(function(el, i){
          el.content = Object.values(vocab['meta'][i])[0];
          // console.log(Object.values(vocab['meta'][i])[0]);
          index = i;
        });

        // get editable items in page
        cms.config.editableItems.forEach(function (el) {
          editableItemSelector += el + ',';
        });
        editableItemSelector = editableItemSelector.slice(0, -1); // remove trailing comma

        var sectionIndex =1;
        // replace editables with mustache {{holders}}
        $html.find(editableItemSelector).each(function(el, i){
          var sectionName = 'section'+sectionIndex,
              prevTag = '',
              elemCount = 0;

          if (vocab[sectionName]){
            Object.values(vocab[sectionName]).forEach(function(vocabItem, i){
              var tag  = Object.keys(vocabItem)[0],
                  value = Object.values(vocabItem)[0];

              (prevTag == tag) ? elemCount++ : elemCount=0;

              var elemToUpdate = $html.find('.'+sectionName).find(tag)[elemCount];

              // console.log(sectionName, tag, elemCount, value, elemToUpdate);

              if (elemToUpdate) {
                if (tag == 'img'     && elemToUpdate.src)    elemToUpdate.src    = Object.values(vocabItem)[0];
                if (tag == 'source'  && elemToUpdate.srcset) elemToUpdate.srcset = Object.values(vocabItem)[0];
                if (tag !== 'source' && tag !== 'source' &&  elemToUpdate.innerHTML) elemToUpdate.innerHTML = Object.values(vocabItem)[0];
              }

              prevTag = tag;

            });
            sectionIndex++;
          }

        });

        // remove cms scripts
        $html.find('script[src^="cms"], #cms-init, link[href^="cms"]').remove();
        $html.find('*[class=""]').removeAttr('class');
        $html.find('*').removeAttr('contenteditable');
        $html.find('*').removeClass('cms-editable cms-editable-img cms-editable-region cms-inline-media');
        // reset app templates so they work on pages with no js
        // move to a method in the main app
        $html.find('html, body').removeClass('html5 js');
        $html.find('*').removeClass('anim-fade-1s transparent scrollmation-text-js scrollmation-image-container-top scrollmation-image-container-fixed scrollmation-image-container-bottom');
        $html.find('.scrollmation-text').addClass('article');

        cms.saveTranslatedHTML($html.html());
        cms.previewTranslation($html.html());

      });

    });

  },

  previewTranslation: function (html){
    $('html')[0].innerHTML = html;
    $('body').addClass('js');
    $('html').find('.video-overlay').removeClass('hidden');
    $('html').find('.video-overlay-button').html('▶');
    app.video.init();
  },

  saveTranslatedHTML: function(html){
    var data = new FormData();

    html = cms.addDocType(html);

    data.append('html', html);
    data.append('lang', cms.vocabEditor.getCurrentService());

    this.ajax.create('POST', 'cms/api/translation.php');
    this.ajax.onFinish(
      function success (responseText) {
        console.log(responseText);
      }, 
      function error (responseText) {
        console.log(responseText);
      }
    );
    this.ajax.send(data);
  },

  savePage: function(){
    this.ui.hideMenu();
    var html = cms.getPageHTMLWithoutCMS();
    html = cms.addDocType(html);
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
    $html.find('body').removeClass('js');
    $html.find('*').removeClass('anim-fade-1s transparent scrollmation-text-js scrollmation-image-container-top scrollmation-image-container-fixed scrollmation-image-container-bottom');
    $html.find('.scrollmation-text').addClass('article');
    $html.find('.video-overlay').removeClass('hidden');
    $html.find('.video-overlay-button').html('▶');
    // get cleaned html
    cleanHTML = $html.html();

    return cleanHTML;
  },

  addDocType: function (html) {
    var lang = cms.vocabEditor.getCurrentService() || 'en';
    return '<!DOCTYPE html>\n<html lang="'+lang+'">\n' + html + '</html>';
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