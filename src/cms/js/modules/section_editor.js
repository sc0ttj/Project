var sectionEditor;
var $    = require('cash-dom');
var ajax = require('modules/ajaxer');
var t    = require('modules/templater.js');

//get this data from file instead!
var loremData = {
  authorName: 'Your Name Here',
  publishedDate: '1st January, 2017',
  heroTitle : 'My Title',
  heroSubTitle : 'A subtitle for the page you\'re reading',
  articleHeading: 'Article Heading',
  para: 'Lorem ipsum thing dolor sit amet, consectetur adipiscing elit. Mauris pharetra erat sit amet orci auctor finibus. Sed at aliquet enim, vel tincidunt mauris.',
  fullWidthImageCaption: 'Full-width image caption here',
  fixedImageText: 'Text Over Image',
  imagePlaceholder: 'images/placeholders/550x550.png'
};

"use strict";

module.exports = {
  getConfig: function (){
    return sectionEditor.config;
  },

  setConfig: function (config){
    sectionEditor.config = config || sectionEditor.config;
  },

  init: function(config){
    sectionEditor = this;
    cms.sectionEditor = this;

    sectionEditor.setConfig(config);
    sectionEditor.createUI();
    t.init(config);
  },

  createUI: function(){
    var sectionChooserHtml = sectionEditor.createSectionChooser();
    $('body').append(sectionChooserHtml);

    sectionEditor.$sectionChooser          = $('div.cms-media-chooser');
    sectionEditor.$sectionChooserContainer = sectionEditor.$sectionChooser.children('.cms-media-chooser-container');

    var $closeBtn = $('.cms-media-chooser-close-btn');
    $closeBtn.on('click', sectionEditor.closeBtnClickHandler);
  },

  closeBtnClickHandler: function (e) {
    sectionEditor.hideUI();
  },

  showUI: function () {
    $('body').css('overflow', 'hidden');
    $('.cms-menu-btn').addClass('cms-menu-btn-white');
    $('div.cms-media-chooser').css('display', 'block');
    sectionEditor.sectionPreviews = sectionEditor.getSectionPreviewImgs();
    sectionEditor.addPreviewsToContainer(sectionEditor.sectionPreviews);
    
    sectionEditor.$previewImgs = $('.cms-media-chooser-container').children();
    sectionEditor.$previewImgs.on('click', sectionEditor.sectionPreviewClickHandler);

  },

  getSectionPreviewImgs: function (template) {
    var previewImgs = [];
    sectionEditor.config.templates.forEach(function (template, i){
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
    sectionEditor.getTemplateFromFile(this.id);
  },

  getTemplateFromFile: function (template) {
    ajax.create('GET', 'templates/'+template);

    var onSuccessHandler = function (template){
      var sectionHtml = t.renderTemplate(template, loremData);
      sectionEditor.addTemplateToPage(sectionHtml);
      sectionEditor.hideUI();

      // setup the newly added section with the cms
      cms.reload();
    }

    var onErrorHandler = function (){
      alert('error');
    }

    ajax.onFinish(onSuccessHandler, onErrorHandler);
    ajax.send(null);
  },
  
  addTemplateToPage: function (html) {
    $(sectionEditor.config.sectionSelector).last().after(sectionEditor.config.sectionContainer);
    $(sectionEditor.config.sectionSelector).last().html(html);
    sectionEditor.reIndexSections();
  },

  addSectionToChooser: function (sectionHTML) {
    $('.cms-media-chooser-container').html(sectionHTML);
  },

  hideUI: function () {
    $('.cms-menu-btn').removeClass('cms-menu-btn-white');
    $('body').css('overflow', 'auto');
    sectionEditor.$sectionChooserContainer.html('');
    $('div.cms-media-chooser').css('display', 'none');
  },

  reIndexSections: function () {
    $(sectionEditor.config.sectionSelector).each(function(el, i){
      var currentSection = '.section'+(i+1);
      $(currentSection).removeClass('section'+(i+1));
    });

    $(sectionEditor.config.sectionSelector).each(function(el, i){
      var $el = $(this);
      $el.addClass('section'+(i+1));
      $el.attr('id', 'section'+(i+1));
    });
    $('.cms-menu-item').each(function(elem, i){
      $(elem).attr('id', 'menu-item-'+(i+1));
      $(elem).find('a').attr('href', '#section'+(i+1));
    });
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