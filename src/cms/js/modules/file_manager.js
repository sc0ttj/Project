var $ = require('cash-dom');
var self;

"use strict";

module.exports = {
  init: function(){
    self = cms.fileManager;
    return true // if we loaded ok
  },

  showUI: function (){
    var content = '\n\
    <iframe id="file-manager"\n\
      title="File Manager"\n\
      width="100%"\n\
      height="100%"\n\
      frameborder="0"\n\
      marginheight="0"\n\
      marginwidth="0"\n\
      src="phpfm.php">\n\
    </iframe>';

    // load modal, just an iframe containing local copy of PHPFM
    // https://www.codeproject.com/Articles/1167761/PHPFM-A-single-file-responsive-file-manager
    cms.modal.create({
      "title": 'File Manager',
      "contents": content
    });
    cms.modal.show();

    $('.cms-modal-viewport').addClass('cms-modal-file-manager')
  },

}