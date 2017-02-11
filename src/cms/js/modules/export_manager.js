var $ = require('cash-dom');
var self;

"use strict";

module.exports = {
  init: function(){
    self = cms.exportManager;
    return true // if we loaded ok
  },

  savePage: function(){
    cms.ui.hideMenu();
    var html = self.getPageHTMLWithoutCMS();
    html = self.addDocType(html);
    self.saveHtmlToFile(html, self.saveToZip);
  },

  getPageHTMLWithoutCMS: function () {
    var cleanHTML = '',
        $html = $('html').clone();

    cms.config.editableItems.forEach(function (el) {
      $html.find(el+':empty').remove();
    });
    // remove elems added by cms
    $html.find('.cms-menu-container, .cms-menu, .cms-menu-bg, .cms-modal, .cms-media-btn, .cms-menu-btn, .g-options-container').remove();
    // remove all classes and attributes
    $html.find('*').removeClass('cms-editable cms-editable-img cms-editable-region cms-inline-media');
    $html.find('*').removeClass(cms.config.mustardClass);
    $html.find('*').removeAttr('contenteditable');
    $html.find('*').removeAttr('spellcheck');
    $html.find('*').removeAttr('style');

    //chrome bug workaround - remove needless <span>s from <p>s
    // select spans to unwrap
    //https://plainjs.com/javascript/manipulation/unwrap-a-dom-element-35/
    $html.find('p[contenteditable] span:not([class="stat-text-highlight"])').each(function unwrapSpan(span){
      var parent = span.parentNode;
      while (span.firstChild) parent.insertBefore(span.firstChild, span);
      // console.log(span, parent);
      parent.removeChild(span);
    });

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
    cleanHTML = self.cleanupWhitespace(cleanHTML);

    return cleanHTML;
  },

  addDocType: function (html) {
    var lang = cms.vocabEditor.getCurrentService() || 'en';
    return '<!DOCTYPE html>\n<html lang="'+lang+'">\n' + html + '</html>';
  },

  cleanupWhitespace: function(string){
    string = string.replace(/&nbsp;/g, ' ');
    string = string.replace(/  /g, '');
    string = string.replace(/ \n/g, '\n');
    string = string.replace(/\n\n/g, '');
    return string;
  },

  saveHtmlToFile: function(html, callback) {
    var data = new FormData();
    data.append('html', html);

    cms.ajax.create('POST', 'cms/api/preview.php');
    var successHandler = function (responseText) {
      console.log(responseText);
      callback();
    }
    var errorHandler = function (responseText) {
      console.log(responseText);
    }
    cms.ajax.onFinish(successHandler, errorHandler);
    cms.ajax.send(data);
  },

  saveTranslatedHTML: function(html){
    var data = new FormData(),
        filename = 'index.' + cms.vocabEditor.getCurrentService();

    html = self.addDocType(html);
    html = self.cleanupWhitespace(html);

    data.append('html', html);
    data.append('lang', filename);

    cms.ajax.create('POST', 'cms/api/translation.php');
    cms.ajax.onFinish(
      function success (responseText) {
        console.log(responseText);
        // translated html saved as index.LANG.html
        // now preview the translated file we just created
        // then reload the vocab editor on preview exit
        cms.previewManager.showUI(cms.vocabEditor.init);
      }, 
      function error (responseText) {
        console.log(responseText);
      }
    );
    cms.ajax.send(data);
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
  }

}