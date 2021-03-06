// # file_manager.js
// This is a simple wrapper for [PHPFM](https://www.codeproject.com/Articles/1167761/PHPFM-A-single-file-responsive-file-manager), which loads up in a CMS modal.

// Get our JS dependencies
var $ = require('cash-dom'); /* jQuery alternative */

// Create a self reference 
var self;

// Use strict setting
"use strict";

// Define CommonJS module
module.exports = {
  
  // ## Module Methods

  // ### init()
  // Makes this module available globally as cms.fileManager
  init: function(){
    self = cms.fileManager;
    return true // if we loaded ok
  },

  // ### showUI()
  // Creates an iframe which contains PHPFM, then loads  
  // a CMS modal with that iframe as its main content.
  showUI: function (){
    
    /* create our iframe HTML */
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

    /* load the modal, just an iframe containing local copy of PHPFM
     * https://www.codeproject.com/Articles/1167761/PHPFM-A-single-file-responsive-file-manager
     */
    cms.modal.create({
      "title": 'File Manager',
      "contents": content
    });
    cms.modal.show();

    /* add custom styling for this CMS modal */ 
    $('.cms-modal-viewport').addClass('cms-modal-file-manager')
  },

// End of module
};
