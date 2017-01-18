var $ = require('cash-dom');
var self;

"use strict";

module.exports = {
  init: function(){
    self = this;
    self.createUI();
  },

  createUI: function(){
    var sectionChooserHtml = self.createSectionChooser();
    $('body').append(sectionChooserHtml);

    self.$sectionChooser          = $('div.cms-media-chooser');
    self.$sectionChooserContainer = self.$sectionChooser.children('.cms-media-chooser-container');

    var $closeBtn = $('.cms-media-chooser-close-btn');
    $closeBtn.on('click', self.closeBtnClickHandler);
  },

  closeBtnClickHandler: function (e) {
    self.hideUI();
  },

  showUI: function () {
    $('body').css('overflow', 'hidden');
    $('.cms-menu-btn').addClass('cms-menu-btn-white');
    $('div.cms-media-chooser').css('display', 'block');
    self.sectionPreviews = self.getSectionPreviewImgs();
    self.addPreviewsToContainer(self.sectionPreviews);
    
    self.$previewImgs = $('.cms-media-chooser-container').children();
    self.$previewImgs.on('click', self.sectionPreviewClickHandler);
  },

  getSectionPreviewImgs: function (template) {
    var previewImgs = [];
    cms.config.templates.forEach(function (template, i){
      var previewImg = '<img class="cms-template-preview-image" id="'+template+'" src="/cms/images/previews/'+template+'.png" alt="'+template+'" />';
      previewImgs[i] = previewImg;
    });
    return previewImgs;
  },

  addPreviewsToContainer: function (items) {
    items.forEach(function addItem(item, i){
      $('.cms-media-chooser-container').append(item);
    });
  },

  sectionPreviewClickHandler: function (e) {
    self.getTemplateFromFile(this.id);
  },

  getTemplateFromFile: function (template) {
    cms.ajax.create('GET', 'templates/'+template);

    var onSuccessHandler = function (template){
      var loremData = cms.pageConfig,
          sectionHtml = cms.templater.renderTemplate(template, loremData);
      self.addTemplateToPage(sectionHtml);
      self.hideUI();

      // setup the newly added section with the cms
      cms.editor.reIndexSections();
      cms.ui.reIndexMenuItems();
      cms.reload();
    }

    var onErrorHandler = function (){
      alert('error');
    }

    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
    cms.ajax.send(null);
  },
  
  addTemplateToPage: function (html) {
    $(cms.config.sectionSelector).last().after(cms.config.sectionContainer);
    $(cms.config.sectionSelector).last().html(html);
  },

  addSectionToChooser: function (sectionHTML) {
    $('.cms-media-chooser-container').html(sectionHTML);
  },

  hideUI: function () {
    $('.cms-menu-btn').removeClass('cms-menu-btn-white');
    $('body').css('overflow', 'auto');
    self.$sectionChooserContainer.html('');
    $('div.cms-media-chooser').css('display', 'none');
  },

  createSectionChooser: function () {
    var templateChooser = '<div class="cms-media-chooser">\n\
      <div class="cms-media-chooser-header">\n\
        <button class="cms-media-chooser-btn cms-media-chooser-close-btn">Back</button>\n\
        <center><h3>Section Manager</h3>\n\
        </center>\n\
      </div>\n\
      <div class="cms-media-chooser-container" style="color:#333;padding-left:16px;padding-right:16px;"></div>\n\
      \n\
    </div>';
    return templateChooser;
  },

}