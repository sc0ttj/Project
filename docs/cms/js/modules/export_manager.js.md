# export_manager.js
This CMS module parses then saves the current page HTML    
to .html files, and saves the current dir to a .tar.gz file.

## Begin script
 
Get dependencies
```js
var $ = require('cash-dom'); /* jQuery alternative */

```
Create a self reference 
```js
var self;

```
Use strict setting
```js
"use strict";

```
Define CommonJS module
```js
module.exports = {
  
```
## Module Methods

### init()

```js
  init: function(){
    /* make this module available globally as cms.exportManager */
    self = cms.exportManager;
    return true // if we loaded ok
  },

```
### savePage()
Hide the CMS menu, get the current page HTML,    
clean up the HTML (remove the CMS from the html),    
then save the cleaned HTML to a .html file.
```js
  savePage: function(){
    cms.ui.hideMenu();
    var html = self.getPageHTMLWithoutCMS();
    html = self.addDocType(html);
    self.saveHtmlToFile(html, self.saveToZip);
  },

```
### getPageHTMLWithoutCMS()
Get the page HTML as a string, remove all CMS elems and classes,    
remove excess whitespace, then reset the HTML to its default, onload settings.    

@return string  - returns the cleaned HTML as a string
```js
  getPageHTMLWithoutCMS: function () {
    var cleanHTML = '',
        $html = $('html').clone(); /* get page html */

    /* remove all editable items that are empty */
    cms.config.editableItems.forEach(function (el) {
      $html.find(el+':empty').remove();
    });
    
    /* remove all CMS related elems */
    $html.find('.cms-menu-container, .cms-menu, .cms-menu-bg, .cms-modal, .cms-media-btn, .cms-menu-btn, .g-options-container, .cms-script').remove();
    
    /* remove all CMS related classes and attributes */
    $html.find('*').removeClass('cms-html5 cms-editable cms-editable-img cms-editable-region cms-inline-media');
    $html.find('*').removeAttr('contenteditable');
    $html.find('*').removeAttr('spellcheck');
    $html.find('*').removeAttr('style');

    /* chrome bug workaround - remove needless <span>s from <p>s, then select spans to unwrap,
     * source: https://plainjs.com/javascript/manipulation/unwrap-a-dom-element-35/
     */
    $html.find('p[contenteditable] span:not([class="stat-text-highlight"])').each(function unwrapSpan(span){
      var parent = span.parentNode;
      while (span.firstChild) parent.insertBefore(span.firstChild, span);
      /* console.log(span, parent); */
      parent.removeChild(span);
    });
    $html.find('span:empty').remove();

    /* remove cms scripts */
    $html.find('script[src^="cms"], #cms-init, link[href^="cms"], .cms-script').remove();
    $html.find('*[class=""]').removeAttr('class');
    
    /* reset app templates so they work on pages with no js */
    $html.find('*').removeClass(cms.config.mustardClass);
    $html.find('.scrollmation-text-js').removeClass('full-height');
    $html.find('*').removeClass('anim-fade-1s transparent scrollmation-text-js scrollmation-image-container-top scrollmation-image-container-fixed scrollmation-image-container-bottom');
    $html.find('.scrollmation-text').addClass('article');
    $html.find('.video-overlay').removeClass('hidden');
    $html.find('.video-overlay-button').html('▶');
    
    /* get cleaned html */
    cleanHTML = $html.html();
    cleanHTML = self.cleanupWhitespace(cleanHTML);

    return cleanHTML;
  },

```
### addDocType()
Wraps the given html string in a `<html>` tag with DOCTYPE  

@param `html` - the html string to add the doctype to  
@return `string` - the full html, including html5 doctype  
```js
  addDocType: function (html) {
    var lang = cms.vocabEditor.getCurrentService() || 'en';
    return '<!DOCTYPE html>\n<html lang="'+lang+'">\n' + html + '</html>';
  },

```
### cleanupWhitespace()
Clean up the spaces, tabs and excess newlines from the given string

@param `string` - the string to clean  
@return `string` - the cleaned up string  
```js
  cleanupWhitespace: function(string){
    string = string.replace(/&nbsp;/g, ' ');
    string = string.replace(/  /g, '');
    string = string.replace(/ \n/g, '\n');
    string = string.replace(/\n\n/g, '');
    return string;
  },

```
### saveHtmlToFile()

@param `html` - string of html to save to file  
@param `callback` - the func to exec on save file success  
```js
  saveHtmlToFile: function(html, callback) {
    var data = new FormData();
    data.append('html', html);

    cms.ajax.create('POST', cms.config.api.preview);
    var successHandler = function (responseText) {
      console.log(responseText);
      callback();
    };
    var errorHandler = function (responseText) {
      console.log(responseText);
    };
    cms.ajax.onFinish(successHandler, errorHandler);
    cms.ajax.send(data);
  },

```
### saveTranslatedHTML()
save a translated version of the current page.    
Will save to index.LANG.html, where LANG is the current language

@param `html` - string of html to save to file  
```js
  saveTranslatedHTML: function(html){
    var data = new FormData(),
        filename = 'index.' + cms.vocabEditor.getCurrentService();

    html = self.addDocType(html);
    html = self.cleanupWhitespace(html);

    data.append('html', html);
    data.append('lang', filename);
    data.append('save_translation', true);

    cms.ajax.create('POST', cms.config.api.translate);
    cms.ajax.onFinish(
      function success (responseText) {
        console.log(responseText);
        /* translated html saved as index.LANG.html
         * now preview the translated file we just created
         * then reload the vocab editor on preview exit */
        cms.previewManager.showUI(cms.vocabEditor.init);
      }, 
      function error (responseText) {
        console.log(responseText);
      }
    );
    cms.ajax.send(data);
  },

```
### saveToZip()
Save the current directory to a tar.gz file.
```js
  saveToZip: function () {
    var data = new FormData();
    data.append('savetozip', 'true');

    cms.ajax.create('POST', cms.config.api.save);
    var successHandler = function (responseText) {
      console.log(responseText);
      window.location = responseText;
    };
    var errorHandler = function (responseText) {
      console.log(responseText);
    };
    cms.ajax.onFinish(successHandler, errorHandler);
    cms.ajax.send(data);
  }

```
End of module
```js
};

```
------------------------
Generated _Sat Mar 25 2017 03:19:45 GMT+0000 (GMT)_ from [&#x24C8; export_manager.js](export_manager.js "View in source")

