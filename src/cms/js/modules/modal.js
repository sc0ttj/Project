var $ = require('cash-dom');
var self;

"use strict";

module.exports = {
  init: function(){
    self = this;
  },

  create: function (data) {
    var html = self.getHtml(data);
    self.html = html;
    self.addToPage();
    self.setContents(data.contents);
  },

  getHtml: function (data) {
    var html = '',
        template = self.getTemplate();
    html = cms.templater.renderTemplate(template, data);
    return html;
  },

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

  addToPage: function () {
    $('body').append(self.html);
  },

  setContents: function (html) {
    var $modalViewport = $('.cms-modal-viewport');
    if ($modalViewport) $modalViewport.html(html);
  },

  show: function () {
    var modal = $('.cms-modal'),
        backBtn = $('.cms-modal-back-btn');

    $('body').addClass('cms-noscroll');
    modal.removeClass('cms-transparent cms-disabled cms-hidden');
    backBtn.on('click', self.backBtnClickHandler);
  },

  backBtnClickHandler: function (e) {
    self.hide();
  },

  hide: function () {
    var modal = $('.cms-modal'),
        backBtn = $('.cms-modal-back-btn');

    $('body').removeClass('cms-noscroll');
    modal.addClass('cms-transparent cms-disabled cms-hidden');
    backBtn.off('click', self.hide);
    self.remove();
  },

  remove: function () {
    $('.cms-modal').remove();
  },

}