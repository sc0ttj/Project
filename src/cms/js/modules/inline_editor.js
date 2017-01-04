var $ = require('cash-dom');
// console.log($)

"use strict";

module.exports = {
  getConfig: function (){
    return this.config;
  },

  setConfig: function (config){
    this.config = config || this.config;
  },

  init: function(config){
    this.setConfig(config);
    this.editableClass = 'cms-editable';
    this.editableSelector = '.'+this.editableClass;
    this.inlineMediaContainers = config.inlineMediaContainers;

    this.isInFirefox = (typeof InstallTrigger !== 'undefined');
    document.body.setAttribute('spellcheck', false);

    this.createMediaBtn();
    this.setEditableItems(config.editableItems);
    this.setEditableRegions(config.editableRegionClass);
    $nextEditableElem = $('contenteditable')[0],
    this.setEventHandlers();
  },

  createMediaBtn: function (){
    this.mediaBtn = '<div id="cms-media-btn" class="cms-media-btn" contenteditable="false" onclick="mediaBtnClickHandler(this);">ADD MEDIA</div>'
    mediaBtnClickHandler = function (el){
      var imgHtml = '<img class=cms-inline-media style=width:100%; src=images/placeholders/550x550.png />',
          $el     = $(el),
          $target = $el;

      if ($el.hasClass('cms-media-btn')) $target = $el.parent();
      var SthisBtn = $target.children('.cms-media-btn');
      $target.append(imgHtml);
      $target.children('.cms-media-btn').remove();
    }
  },

  getEditableItems: function () {
    return $('[contenteditable]');
  },

  setEditableRegions: function(selector){
    var selector = selector.replace(/^\./, '');
    var $elems = $(this.config.sectionSelector + ' .' + selector);
    $elems.attr('contenteditable', true);
    // $elems.addClass(this.editableClass);
    $elems.addClass('cms-editable-region');
    $(this.inlineMediaContainers).append(this.mediaBtn);
  },

  setEditableItems: function(items){
    // document.designMode = 'on'; //makes ALL items editable, very buggy
    var self = this;
    items.forEach(function makeItemEditable(el, i){
      var $elems = $(self.config.sectionSelector + ' ' + el);
      $elems.attr('contenteditable', true);
      // $elems.attr('data-placeholder', 'Enter text here...');
      $elems.addClass(self.editableClass);
    });
  },

  setEventHandlers: function(){
    var nextEditableItemExists,
        $nextEditableElem,
        editables = this.getEditableItems();
        self = this;
    
    editables.off('focus', this.onEditableFocusHandler);
    editables.off('blur', this.onEditableBlurHandler);
    editables.off('keypress', this.onEditableKeyPressHandler);
    
    editables.on('focus', this.onEditableFocusHandler);
    editables.on('blur', this.onEditableBlurHandler);
    editables.on('keypress', this.onEditableKeyPressHandler);
  },

  onEditableKeyPressHandler: function(e){
    var el = this;

    // crude firefox fix - dont allow total emptying of editable regions
    if(self.isInFirefox && self.elemIsEmpty(el)) document.execCommand("insertHTML", false, '<p></p>');

    if (e.which === 13) {
      if(!self.elemIsContainer(el)){
        e.preventDefault();
        if (nextEditableItemExists) $nextEditableElem[0].focus();
      } else {
        if (!self.isInFirefox) $(':focus')[0].blur();
      }
      return false;
    }
  },

  addMediaButtons: function (el) {
    $(this.inlineMediaContainers).each(function(){
      var $this = $(this),
          thisHasNoMediaBtn = ($this.children('.cms-media-btn').length < 1);
          
      if (thisHasNoMediaBtn) $this.append(self.mediaBtn);
    });
  },

  onEditableBlurHandler: function(e){
    var el = this,
        $el = $(el),
        elemIsEmpty = self.elemIsEmpty(el),
        elemIsContainer = self.elemIsContainer(el);
    if (elemIsEmpty && elemIsContainer) $el.remove();
    self.addMediaButtons(el);
    self.removeLeftOverMediaBtns(el);
  },

  onEditableFocusHandler: function(e){
    var el = this;
    $nextEditableElem = self.getNextEditableItem(el);
    nextEditableItemExists = ($nextEditableElem[0] === "{}" || typeof $nextEditableElem[0] != 'undefined');
    self.addMediaButtons(el);
    self.removeLeftOverMediaBtns(el);
  },

  getNextEditableItem: function (el) {
    return $('[contenteditable]').eq($('[contenteditable]').index($(el))+1);
  },

  elemIsEmpty: function (el) {
    var elemIsEmpty = (el.innerHTML === '' 
      || el.innerHTML.indexOf('<br>') === 0
      || el.innerHTML === '\n' 
      || el.innerHTML === '""' 
      || el.innerHTML === '<br>' 
      || el.innerHTML === '<strong></strong>' 
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
    $(el).children('p').each(function(){
      if (self.onlyContainsMediaBtn(this)) $(this).remove();
    });
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

}
