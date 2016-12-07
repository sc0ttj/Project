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
    this.setEditableItems(config.editableItems);
    $nextEditableElem = $('.cms-editable')[0],
    this.setEventHandlers();
  },

  getEditableItems: function () {
    return $('.cms-editable');
  },

  setEditableItems: function(items){
    // document.designMode = 'on'; //makes ALL items editable, very buggy
    var self = this;
    items.forEach(function makeItemEditable(el, i){
      var $elems = $(self.config.sectionSelector + ' ' + el);
      $elems.attr('contenteditable', true);
      $elems.addClass('cms-editable');
    });
  },

  setEventHandlers: function(){
    var nextEditableItemExists,
        $nextEditableElem,
        editables = this.getEditableItems();
        self = this;
    
    editables.off('focus', this.onEditableFocusHandler);
    editables.off('blur', this.onEditableBlurHandler);
    editables.off('keypress', this.onEditableEnterHandler);
    
    editables.on('focus', this.onEditableFocusHandler);
    editables.on('blur', this.onEditableBlurHandler);
    editables.on('keypress', this.onEditableEnterHandler);
  },

  onEditableEnterHandler: function(e){
   var el = this;
   if (e.keyCode === 13) {
      e.preventDefault();
      if(self.elemIsArticlePara(el)){
        self.createNewParaAfterCurrentElem(el);
        $nextEditableElem = self.getNextEditableItem(el);
        self.setEventHandlers();
      }
      if (nextEditableItemExists) $nextEditableElem[0].focus();
      return false;
    }
  },

  onEditableBlurHandler: function(e){
    var el = this,
        elemIsEmpty = self.elemIsEmpty(el),
        elemIsArticlePara = self.elemIsArticlePara(el);
    if (elemIsEmpty && elemIsArticlePara) $(el).remove();
  },

  onEditableFocusHandler: function(e){
    $nextEditableElem = self.getNextEditableItem(this);
    nextEditableItemExists = ($nextEditableElem[0] === "{}" || typeof $nextEditableElem[0] != 'undefined');
  },

  getNextEditableItem: function (el) {
    return $('.cms-editable').eq($('.cms-editable').index($(el))+1);
  },

  elemIsEmpty: function (el) {
    var elemIsEmpty = (el.innerHTML === '' || el.innerHTML === '\n' || el.innerHTML === '<br>' || el.innerHTML === '<strong></strong>' || el.innerHTML === '<b></b>'  || el.innerHTML === '<i></i>' || el.innerHTML === '<em></em>' || el.innerHTML === '<div></div>');
    if (elemIsEmpty) return true;
    return false;
  },

  elemIsArticlePara: function (el) {
    var elemIsPara  = (el.tagName == 'P'),
        isInArticle = ($(el).parents().hasClass('article'));
    if (elemIsPara && isInArticle) return true;
    return false;
  },

  createNewParaAfterCurrentElem: function(el){
    //https://stackoverflow.com/questions/4896944/converting-range-or-documentfragment-to-string
    var $el = $(el),
        p = document.createElement('p'),
        text = self.getTextAfterCaret();
    $(p).attr('contenteditable', true);
    $(p).addClass('cms-editable');
    $(p).append(text);
    document.execCommand('insertText', false, ''); //fixes for undo/redo UX
    $el.after(p);
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
