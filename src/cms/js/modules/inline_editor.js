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

    this.isInFirefox = (typeof InstallTrigger !== 'undefined');

    this.setEditableRegions(config.editableRegionClass);
    this.setEditableItems(config.editableItems);
    $nextEditableElem = $(this.editableSelector)[0],
    this.setEventHandlers();
  },

  getEditableItems: function () {
    return $(this.editableSelector);
  },

  setEditableRegions: function(selector){
    var selector = selector.replace(/^\./, '');
    var $elems = $(this.config.sectionSelector + ' .' + selector);
    $elems.attr('contenteditable', true);
    $elems.addClass(this.editableClass);
    $elems.addClass('cms-editable-region');
  },

  setEditableItems: function(items){
    // document.designMode = 'on'; //makes ALL items editable, very buggy
    var self = this;
    items.forEach(function makeItemEditable(el, i){
      var $elems = $(self.config.sectionSelector + ' ' + el);
      $elems.attr('contenteditable', true);
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

    if (e.keyCode === 13) {
      if(!self.elemIsContainer(el)){
        e.preventDefault();
        if (nextEditableItemExists) $nextEditableElem[0].focus();
      }
      return false;
    }
  },

  onEditableBlurHandler: function(e){
    var el = this,
        $el = $(el);
        elemIsEmpty = self.elemIsEmpty(el),
        elemIsContainer = self.elemIsContainer(el);
    if (elemIsEmpty && elemIsContainer) $el.remove();
  },

  onEditableFocusHandler: function(e){
    $nextEditableElem = self.getNextEditableItem(this);
    nextEditableItemExists = ($nextEditableElem[0] === "{}" || typeof $nextEditableElem[0] != 'undefined');
  },

  getNextEditableItem: function (el) {
    return $(this.editableSelector).eq($(this.editableSelector).index($(el))+1);
  },

  elemIsEmpty: function (el) {
    var elemIsEmpty = (el.innerHTML === '' || el.innerHTML === '\n' || el.innerHTML === '<br>' || el.innerHTML === '<strong></strong>' || el.innerHTML === '<b></b>'  || el.innerHTML === '<i></i>' || el.innerHTML === '<em></em>' || el.innerHTML === '<div></div>');
    if (elemIsEmpty) return true;
    return false;
  },

  elemIsContainer: function (el) {
    var editableRegionClass = this.config.editableRegionClass.replace(/^\./, '');
    var elemIsContainer  = ($(el).hasClass(editableRegionClass));
    if (elemIsContainer) return true;
    return false;
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
