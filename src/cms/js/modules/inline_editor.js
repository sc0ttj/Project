var $ = require('cash-dom');
var self;

"use strict";

module.exports = {
  init: function(){
    self = this;
    document.body.setAttribute('spellcheck', false);
    self.isInFirefox = (typeof InstallTrigger !== 'undefined');
    self.createMediaBtn();
    self.setEditableItems(cms.config.editableItems);
    self.setEditableRegions(cms.config.editableRegionClass);
    self.nextEditableElem = $('contenteditable')[0],
    self.setEventHandlers();
  },

  createMediaBtn: function (){
    self.mediaBtn = '\
    <div id="cms-media-btn" \
         class="cms-media-btn cms-anim-fade-250ms cms-transparent"\
         contenteditable="false"\
         onclick="mediaBtnClickHandler(this);">\
      ADD MEDIA\
    </div>'
    mediaBtnClickHandler = function (el){
      var imgHtml = '<picture><img src=images/placeholders/550x550.png /></picture>',
          $el     = $(el),
          $target = $el;

      if ($el.hasClass('cms-media-btn')) $target = $el.parent();
      $target.append(imgHtml);
      $target.children('.cms-media-btn').remove();
    }
  },

  getEditableItems: function () {
    return $('[contenteditable]');
  },

  setEditableRegions: function(selector){
    var selector = selector.replace(/^\./, ''),
        $elems = $(cms.config.sectionSelector + ' .' + selector);
    
    $elems.attr('contenteditable', true);
    $elems.addClass(cms.config.editableRegionClass);
    self.addMediaButtons();
  },

  setEditableItems: function(items){
    // document.designMode = 'on'; //makes ALL items editable, very buggy
    items.forEach(function makeItemEditable(el, i){
      var $elems = $(cms.config.sectionSelector + ' ' + el);
      $elems.attr('contenteditable', true);
      // $elems.attr('data-placeholder', 'Enter text here...');
      $elems.addClass(cms.config.editableClass);
    });
  },

  setEventHandlers: function(){
    var editables = self.getEditableItems();
    
    editables.off('focus', self.onEditableFocusHandler);
    editables.off('blur', self.onEditableBlurHandler);
    editables.off('keypress', self.onEditableKeyPressHandler);
    
    editables.on('focus', self.onEditableFocusHandler);
    editables.on('blur', self.onEditableBlurHandler);
    editables.on('keypress', self.onEditableKeyPressHandler);
  },

  onEditableKeyPressHandler: function(e){
    var el = this;

    // crude firefox fix - dont allow total emptying of editable regions
    if(self.isInFirefox && self.elemIsEmpty(el)) document.execCommand("insertHTML", false, '<p></p>');

    if (e.which === 13) {
      if(!self.elemIsContainer(el)){
        e.preventDefault();
        if (self.nextEditableItemExists) self.nextEditableElem.focus();
      } else {
        if (!self.isInFirefox) $(':focus')[0].blur();
      }
      return false;
    }
  },

  addMediaButtons: function () {
    $(cms.config.inlineMediaRegionSelector).each(function(){
      var $el = $(this),
          thisHasNoMediaBtn = ($el.children('.cms-media-btn').length < 1);
          
      if (thisHasNoMediaBtn) $el.append(self.mediaBtn);
    });
  },

  onEditableBlurHandler: function(e){
    var el = this,
        $el = $(el),
        elemIsEmpty = self.elemIsEmpty(el),
        elemIsContainer = self.elemIsContainer(el);

    if (elemIsEmpty && elemIsContainer) $el.remove();
    self.addMediaButtons();
    self.removeLeftOverMediaBtns(el);
  },

  onEditableFocusHandler: function(e){
    var el = this;
    self.nextEditableElem = self.getNextEditableItem(el);
    self.nextEditableItemExists = (self.nextEditableElem === "{}" || typeof self.nextEditableElem != 'undefined');
    self.addMediaButtons();
    self.removeLeftOverMediaBtns(el);
    cms.mediaEditor.addResponsiveImageClickHandlers();
  },

  getNextEditableItem: function (el) {
    return $('[contenteditable]').eq($('[contenteditable]').index($(el))+1)[0];
  },

  elemIsEmpty: function (el) {
    var elemIsEmpty = (el.innerHTML === '' 
      || el.innerHTML.indexOf('<br>') === 0
      || el.innerHTML === '\n' 
      || el.innerHTML === '""' 
      || el.innerHTML === '<br>' 
      || el.innerHTML === '<strong></strong>' 
      || el.innerHTML === '<span></span>' 
      || el.innerHTML === '<b></b>'  
      || el.innerHTML === '<i></i>' 
      || el.innerHTML === '<em></em>' 
      || el.innerHTML === '<div></div>');

    if (elemIsEmpty) {
      el.innerHTML = '';
      return true;
    }
    return false;
  },

  elemIsContainer: function (el) {
    var elemIsContainer  = ($(el).children('[contenteditable]').length > 0);
    if (elemIsContainer) return true;
    return false;
  },

  removeLeftOverMediaBtns: function (el){
    $(el).children().each(function(elem){
      if (self.onlyContainsMediaBtn(elem)) $(elem).remove();
    });
    if (self.onlyContainsMediaBtn(el)) $(el).remove();
  },

  onlyContainsMediaBtn: function (el) {
    return (el.innerHTML.indexOf('<div id="cms-media-btn"') === 0);
  },

  //https://stackoverflow.com/questions/5740640/contenteditable-extract-text-from-caret-to-end-of-element?answertab=votes#tab-top
  getTextBlockContainer: function(node) {
    while (node) {
      if (node.nodeType == 1) return node;
      node = node.parentNode;
    }
  },

  getTextAfterCaret: function() {
    var sel = window.getSelection();
    if (sel.rangeCount) {
      var selRange = sel.getRangeAt(0);
      var blockEl = self.getTextBlockContainer(selRange.endContainer);
      if (blockEl) {
        var range = selRange.cloneRange();
        range.selectNodeContents(blockEl);
        range.setStart(selRange.endContainer, selRange.endOffset);
        return range.extractContents();
      }
    }
  },

  moveSectionUp: function (index) {
    var $section = $('.section'+index);
    $section.prev().before($section);
  },

  moveSectionDown: function (index) {
    var $section = $('.section'+index);
    $section.next().after($section);
  },

  removeSection: function (index) {
    var $section = $('.section'+index);
    $section.remove();
  },

  reIndexSections: function () {
    var $sections = $(cms.config.sectionSelector);

    $sections.each(function(el, i){
      var currentSection = '.section'+(i+1);
      $(currentSection).removeClass('section'+(i+1));
    });

    $sections.each(function(el, i){
      var $el = $(this);
      $el.addClass('section'+(i+1));
      $el.attr('id', 'section'+(i+1));
    });
  },

}
