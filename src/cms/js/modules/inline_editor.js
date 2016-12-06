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

  startEventHandlers: function(){
    var $nextEditableElem = $('.cms-editable')[0],
        nextEditableItemExists;

    function onEditableEnterHandler(e) {
     if (e.keyCode === 13) {
        e.preventDefault();
        if (nextEditableItemExists) $nextEditableElem[0].focus();
        return false;
      }
    }

    function onEditableBlurHandler(e) {
      var elemIsEmpty = (this.innerHTML === '');
      if (elemIsEmpty) $(this).remove();
    }

    function onEditableFocusHandler(e) {
      $nextEditableElem = $('.cms-editable').eq($('.cms-editable').index($(this))+1);
      nextEditableItemExists = ($nextEditableElem[0] === "{}" || typeof $nextEditableElem[0] != 'undefined');
    }

    $('.cms-editable').on('focus', onEditableFocusHandler);
    $('.cms-editable').on('blur', onEditableBlurHandler);
    $('.cms-editable').on('keypress', onEditableEnterHandler);

  },

  makeItemsEditable: function(items){
    var self = this;
    items.forEach(function makeItemEditable(el, i){
      var elems = self.config.sectionSelector + ' ' + el;
      $(elems).attr('contenteditable', true);
      $(elems).addClass('cms-editable');
    });

  },

}