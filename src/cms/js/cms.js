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
    this.previewManager = require('modules/preview_manager');
    this.templater      = require('modules/templater');
    this.vocabEditor    = require('modules/vocab_editor');
    this.ui             = require('modules/ui');

    this.modal.init();
    this.vocabEditor.init();
    this.previewManager.init();
    if (!cms.showTranslation()){
      this.editor.init();
      this.videoManager.init();
      this.imageManager.init();
      this.sectionManager.init();
      this.metaManager.init();
      this.templater.init();
      this.ui.init();
    }

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

  showTranslation: function (){
    if (this.getQueryVariable('preview') != '') return true;
    return false;    
  },

  translatePage: function(){
    var tmpHtml = document.createElement('HTML'),
        html = '',
        $html = '',
        editableItemSelector='',
        metaSelector = 'meta[name^="title"], meta[name^="description"], meta[name^="author"], meta[name^="keywords"], meta[name^="news_keywords"], meta[name^="copyright"], meta[name^="twitter"], meta[property], meta[itemprop]';

    cms.vocabEditor.getPreviewPageHtml(function translatePreviewPageHTML(html){
      tmpHtml.innerHTML = html;
      $html = $(tmpHtml);

      // if 'vocabs/[lang].json exists, add contents of vocab file to $html, then run saveTranslatedHTML
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

        // update <title> tag as well
        $html.find('title').html(vocab.meta[0].title);

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

        // get lang details for current translation LANG
        var lang     = cms.vocabEditor.getCurrentService(),
            langInfo = app.getLangInfo(lang);

        langInfo.code = lang;

        // remove from page all of the lang info that will be replaced
        $html.find('html, body').removeClass('en');
        $html.find('html, body').removeAttr('dir');
        $html.find('html, body').removeClass('rtl');

        // now add the correct values for lang to page
        if (langInfo.direction === 'rtl') {
          $html.find('html, body').attr('dir', langInfo.direction);
          $html.find('hmtl, body').addClass(langInfo.direction);
        }

        html = $html.html();
        cms.saveTranslatedHTML(html);
      });

    });

  },

  saveTranslatedHTML: function(html){
    var data = new FormData(),
        filename = 'index.' + cms.vocabEditor.getCurrentService();

    html = cms.addDocType(html);
    html = cms.removeWhitespace(html);

    data.append('html', html);
    data.append('lang', filename);

    this.ajax.create('POST', 'cms/api/translation.php');
    this.ajax.onFinish(
      function success (responseText) {
        console.log(responseText);
        // translated html saved as LANG.html
        // now preview the translated file we just created
        cms.previewManager.showPreviewInModal(cms.vocabEditor.init);
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
    cleanHTML = cms.removeWhitespace(cleanHTML);

    return cleanHTML;
  },

  addDocType: function (html) {
    var lang = cms.vocabEditor.getCurrentService() || 'en';
    return '<!DOCTYPE html>\n<html lang="'+lang+'">\n' + html + '</html>';
  },

  removeWhitespace: function(string){
    string = string.replace(/  /g, '');
    string = string.replace(/ \n/g, '\n');
    string = string.replace(/\n\n/g, '');
    return string;
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