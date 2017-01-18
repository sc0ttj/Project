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

    modal.removeClass('cms-transparent');
    modal.removeClass('cms-disabled');
    modal.removeClass('cms-hidden');
    backBtn.on('click', self.hide);
    $('body').css('overflow', 'none');
    $('.cms-menu-btn').addClass('cms-menu-btn-white');
  },

  hide: function () {
    var modal = $('.cms-modal'),
        backBtn = $('.cms-modal-back-btn');

    modal.addClass('cms-transparent');
    modal.addClass('cms-disabled');
    modal.addClass('cms-hidden');
    $('body').css('overflow', 'auto');
    $('.cms-menu-btn').removeClass('cms-menu-btn-white');
  },

  remove: function () {
    $('.cms-modal').remove();
  },

}