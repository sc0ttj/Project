// # preview_manager.js
// This module creates a modal popup containing a preview of the edited page.  
// The previewed page is inside an iframe which can be resized to various device sizes.
//  

// First, we get our dependencies
var $ = require('cash-dom');

// Create a persistent reference
var self;

// Use strict setting
"use strict";

// Define our CommonJS module
module.exports = {

  // ## Module Methods

  // ### init()
  init: function(){
    /* make this module available globally as cms.previewManager */
    self = cms.previewManager; 
    return true // if we loaded ok
  },

  // ### previewPage()
  // Hide this modal and the CMS menu, then get a string of the HTML of our 
  // page (index.html), then remove the CMS from it, then save that HTML to 
  // a preview.html file, then re-show this preview manager UI
  previewPage: function () {
    cms.ui.hideMenu();
    var html = cms.exportManager.getPageHTMLWithoutCMS();
    html = cms.exportManager.addDocType(html);
    cms.exportManager.saveHtmlToFile(html, self.showUI);
  },

  // ### showUI(callback)
  // Shows the Preview Manager modal dialog and enables its event handlers
  //
  // @param `callback` - a function that is executed on closing the modal 
  showUI: function (callback) {
    var lang = cms.vocabEditor.getCurrentService(),
        filename = 'index.' + lang, // name of page to preview, example 'index.fr.html'
        langInfo = cms.getLangInfo(lang);

    /* set the correct filename based on the current language */
    if (lang === 'en') filename = 'preview'; // if default LANG, get default preview page

    /* create the modal content - a resizable iframe containing a preview of the edited page */
    var content = '<div class="cms-iframe-resizer">\
      <button class="cms-iframe-resizer-btn" data-width="320px"  data-height="568px">  iPhone 5  </button>\
      <button class="cms-iframe-resizer-btn" data-width="360px"  data-height="640px">  Galaxy S5 </button>\
      <button class="cms-iframe-resizer-btn" data-width="414px"  data-height="736px">  iPhone 6  </button>\
      <button class="cms-iframe-resizer-btn cms-iframe-resizer-btn-ipad" data-width="1024px" data-height="768px">  iPad      </button>\
      <button class="cms-iframe-resizer-btn" data-width="100%" data-height="100%">     Full      </button>\
      <button class="cms-iframe-resizer-btn cms-iframe-resizer-btn-orientation cms-hidden" data-orientation="switch" style="display:none;"> Rotate ⟳ </button>\
    </div>\
    <iframe id="pagePreview"\
      title="Preview ('+langInfo.name+')"\
      width="100%"\
      height="100%"\
      frameborder="0"\
      marginheight="0"\
      marginwidth="0"\
      src="'+filename+'.html?c'+Math.random()+'">\
    </iframe>';

    /* load modal */
    cms.modal.create({
      "title": 'Preview ('+langInfo.name+')',
      "contents": content,
      "callback": callback
    });
    cms.modal.show();

    /* hide back button if previewing via ?preview=LANG */
    if (cms.showTranslation()) $('.cms-modal-back-btn').addClass('cms-hidden');

    /* add custom styling for the modal contents */
    $('.cms-modal-viewport').addClass('cms-modal-viewport-previewer');
    /* add event handlers */
    self.iframeResizeBtnClickHandler();
  },

  // ### iframeResizeBtnClickHandler()
  // Resizes the iframe in the Preview Manager to match the given dimensions
  iframeResizeBtnClickHandler: function () {
    /* on clicking the 'cms-iframe-resizer-btn' button, get the dimensions 
     * from data attributes then apply those dimensions to the iframe
     */
    $('.cms-iframe-resizer-btn').on('click', function resizeIframe() {
      var $this  = $(this),
          iframe = $('#pagePreview')[0],
          newHeight,
          newWidth,
          orientation = $(this).data('orientation') || '',
          iframeResizeBtn = $('.cms-iframe-resizer-btn-orientation');

      if (orientation === 'switch'){
        /* reverse height and width */
        newWidth  = iframe.height;
        newHeight = iframe.width;
      } else {
        /* get height and width from buttons data-*  attrs */
        newWidth  = $this.data('width');
        newHeight = $this.data('height');
      }

      /* resize iframe */
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

//  
// End of the module
};
