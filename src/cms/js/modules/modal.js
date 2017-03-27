// # modal.js
// This module provides a popup modal dialog box. The main contents of 
// the modal can be set using the `create()` method.

// Let's start.. Get our dependencies: 
var $ = require('cash-dom'); /* jquery alternative */

// Create a persistent self reference to use across all module mthods
var self;

// Use strict setting
"use strict";

// Define the CommonJS module
module.exports = {

  // ## Module Methods

  // ### init()
  init: function(){
    self = this; /* consistent self reference */
  },

  // ### create()
  // Creates the modal window, sets its contents, based on the `data' param it 
  // is given
  //  
  // @param `data` - Object, with keys `title` (string), `contents` (string) and optionally `callback` (function)  

  /* Example data object 
   *    {
   *     title: 'Edit Meta Info',
   *     contents: form,
   *     callback: someFunc
   *   }
   */
  create: function (data) {
    var html = self.getHtml(data),
        callback = data.callback;

    /* save our modal contents html */
    self.html = html;
    /* add the HTML to page, update its contents */
    self.addToPage();
    self.setContents(data.contents);
    /* now set a callback to run on exit, if one was given */
    self.callback = '';
    if (typeof callback === 'function') {
      self.callback = callback;
    }
  },

  // ### getHtml()
  //
  // @param `data` - Object containing values for the {{things}} in 
  // getTemplate() HTML  
  // @return `html` - a string of HTML
  getHtml: function (data) {
    var html = '',
        template = self.getTemplate();
    /* use our templater to combine the json and template into html output */
    html = cms.templater.renderTemplate(template, data);
    return html;
  },

  // ### getTemplate()
  // Returns the HTML of the modal dialog itself
  getTemplate: function () {
    return   '\
      <div class="cms-modal cms-anim-fade-250ms cms-transparent cms-hidden">\n\
        <div class="cms-modal-header-container">\n\
          <button class="cms-modal-back-btn">Back</button>\n\
          <h3 class="cms-modal-header">{{title}}</h3>\n\
        </div>\n\
        <div class="cms-modal-viewport"></div>\n\
      </div>';
  },

  // ### addToPage()
  // Adds the modal HTML to the page (index.html).
  addToPage: function () {
    $('body').append(self.html);
  },

  // ### setContents()
  // Update the main contents of the modal window.
  setContents: function (html) {
    var $modalViewport = $('.cms-modal-viewport');
    if ($modalViewport) $modalViewport.html(html);
  },

  // ### show()
  // Show the modal and make it ready to use.
  show: function () {
    var modal = $('.cms-modal'),
        backBtn = $('.cms-modal-back-btn');

    /* Save page HTL to local storage, show the modal, add event handlers */
    cms.saveProgress();
    $('body').addClass('cms-noscroll');
    modal.removeClass('cms-transparent cms-disabled cms-hidden');
    backBtn.on('click', self.backBtnClickHandler);
  },

  // ### backBtnClickHandler()
  // executes the callback defined in `create()` when back button is clicked 
  // (when modal is closed).
  backBtnClickHandler: function (e) {
    self.hide();
    if (typeof self.callback === 'function') self.callback();
  },

  // ### hide()
  // hide the modal, remove event handlers.
  hide: function () {
    var modal = $('.cms-modal'),
        backBtn = $('.cms-modal-back-btn');

    $('body').removeClass('cms-noscroll');
    modal.addClass('cms-transparent cms-disabled cms-hidden');
    backBtn.off('click', self.hide);
    self.remove();
    cms.saveProgress();
  },

  // ### remove()
  // Remove the modal HTML from the page (index.html) entirely.
  remove: function () {
    $('.cms-modal').remove();
  },

// End of module
};
