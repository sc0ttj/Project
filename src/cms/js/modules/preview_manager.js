var $ = require('cash-dom');
var self;

"use strict";

module.exports = {
  init: function(){
    self = cms.previewManager;
    return true // if we loaded ok
  },

  previewPage: function () {
    cms.ui.hideMenu();
    var html = cms.exportManager.getPageHTMLWithoutCMS();
    html = cms.exportManager.addDocType(html);
    cms.exportManager.saveHtmlToFile(html, self.showUI);
  },

  showUI: function (callback) {
    var lang = cms.vocabEditor.getCurrentService(),
        filename = 'index.' + lang, // name of page to preview, example 'index.fr.html'
        langInfo = cms.getLangInfo(lang);

    if (lang === 'en') filename = 'preview'; // if default LANG, get default preview page

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
      title="Preview ('+langInfo.name+')"\
      width="100%"\
      height="100%"\
      frameborder="0"\
      marginheight="0"\
      marginwidth="0"\
      src="'+filename+'.html?c'+Math.random()+'">\
    </iframe>';

    // load modal
    cms.modal.create({
      "title": 'Preview ('+langInfo.name+')',
      "contents": content,
      "callback": callback
    });
    cms.modal.show();

    // hide back button if previewing via ?preview=LANG
    if (cms.showTranslation()) $('.cms-modal-back-btn').addClass('cms-hidden');

    $('.cms-modal-viewport').addClass('cms-modal-viewport-previewer');
    self.iframeResizeBtnClickHandler();
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

}