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
    this.makeItemsEditable(config.editableItems);
    this.startEventHandlers();
  },

  makeItemsEditable: function(items){
    var self = this;
    items.forEach(function makeItemEditable(el, i){
      var elems = self.config.sectionSelector + ' ' + el;
      $(elems).attr('contenteditable', true);
      $(elems).addClass('cms-editable');
    });

  },

  startEventHandlers: function(){
    var $nextEditableElem = $('.cms-editable')[0],
        nextEditableItemExists;

    $('.cms-editable').on('focus', this.onEditableFocusHandler);
    $('.cms-editable').on('blur', this.onEditableBlurHandler);
    $('.cms-editable').on('keypress', this.onEditableEnterHandler);

  },

  onEditableEnterHandler: function(e){
   if (e.keyCode === 13) {
      e.preventDefault();
      if (nextEditableItemExists) $nextEditableElem[0].focus();
      return false;
    }
  },

  onEditableBlurHandler: function(e){
    var elemIsEmpty = (this.innerHTML === ''),
        elemIsPara  = (this.tagName == 'P'),
        isInArticle = ($(this).parents().hasClass('article'));
    if (elemIsPara && elemIsEmpty && isInArticle) $(this).remove();
  },

  onEditableFocusHandler: function(e){
    $nextEditableElem = $('.cms-editable').eq($('.cms-editable').index($(this))+1);
    nextEditableItemExists = ($nextEditableElem[0] === "{}" || typeof $nextEditableElem[0] != 'undefined');
  },

}
