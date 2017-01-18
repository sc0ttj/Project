var $ = require('cash-dom');
var self;

"use strict";

module.exports = {
  init: function(){
    self = this;
  },

  showUI: function () {
    // get hmtl to be used in modal window
    self.sectionPreviews = self.getSectionPreviewImgs();

    // load modal
    cms.modal.create({
      title: 'Section Manager',
      contents: self.sectionPreviews
    });
    cms.modal.show();

    // get modal contents and add event handlers
    self.$previewImgs = $('.cms-modal-viewport').children();
    self.$previewImgs.on('click', self.sectionPreviewClickHandler);
  },

  getSectionPreviewImgs: function () {
    var previewImgs = '';
    cms.config.templates.forEach(function (section, i){
      var previewImg = '<img id="'+section+'" src="/cms/images/previews/'+section+'.png" alt="'+section+'" />';
      previewImgs += previewImg;
    });
    return previewImgs;
  },

  sectionPreviewClickHandler: function (e) {
    self.getTemplateFromFile(this.id);
  },

  getTemplateFromFile: function (template) {
    cms.ajax.create('GET', 'templates/'+template);

    var onSuccessHandler = function (template){
      var sectionHtml = cms.templater.renderTemplate(template, cms.pageConfig);

      self.addTemplateToPage(sectionHtml);
      cms.modal.hide();
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

}