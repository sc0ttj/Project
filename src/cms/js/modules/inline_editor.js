var $ = require('cash-dom');
var mediaEditor  = require('modules/inline_media_editor');
var editor;
// console.log($)

"use strict";

module.exports = {
  getConfig: function (){
    return editor.config;
  },

  setConfig: function (config){
    editor.config = config || editor.config;
  },

  init: function(config){
    editor = this;

    editor.setConfig(config);

    editor.isInFirefox = (typeof InstallTrigger !== 'undefined');
    document.body.setAttribute('spellcheck', false);

    editor.createMediaBtn();
    mediaEditor.init(config);

    editor.setEditableItems(editor.config.editableItems);
    editor.setEditableRegions(editor.config.editableRegionClass);
    editor.nextEditableElem = $('contenteditable')[0],
    editor.setEventHandlers();
  },

  createMediaBtn: function (){
    editor.mediaBtn = '<div id="cms-media-btn" class="cms-media-btn" contenteditable="false" onclick="mediaBtnClickHandler(this);">ADD MEDIA</div>'
    mediaBtnClickHandler = function (el){
      var imgHtml = '<picture><img class=cms-inline-media style=width:100%; src=images/placeholders/550x550.png /></picture>',
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
        $elems = $(editor.config.sectionSelector + ' .' + selector);
    
    $elems.attr('contenteditable', true);
    $elems.addClass(editor.config.editableRegionClass);
    $(editor.config.inlineMediaRegionSelector).append(editor.mediaBtn);
  },

  setEditableItems: function(items){
    // document.designMode = 'on'; //makes ALL items editable, very buggy
    items.forEach(function makeItemEditable(el, i){
      var $elems = $(editor.config.sectionSelector + ' ' + el);
      $elems.attr('contenteditable', true);
      // $elems.attr('data-placeholder', 'Enter text here...');
      $elems.addClass(editor.config.editableClass);
    });
  },

  setEventHandlers: function(){
    var editables = editor.getEditableItems();
    
    editables.off('focus', editor.onEditableFocusHandler);
    editables.off('blur', editor.onEditableBlurHandler);
    editables.off('keypress', editor.onEditableKeyPressHandler);
    
    editables.on('focus', editor.onEditableFocusHandler);
    editables.on('blur', editor.onEditableBlurHandler);
    editables.on('keypress', editor.onEditableKeyPressHandler);
  },

  onEditableKeyPressHandler: function(e){
    var el = this;

    // crude firefox fix - dont allow total emptying of editable regions
    if(editor.isInFirefox && editor.elemIsEmpty(el)) document.execCommand("insertHTML", false, '<p></p>');

    if (e.which === 13) {
      if(!editor.elemIsContainer(el)){
        e.preventDefault();
        if (editor.nextEditableItemExists) editor.nextEditableElem.focus();
      } else {
        if (!editor.isInFirefox) $(':focus')[0].blur();
      }
      return false;
    }
  },

  addMediaButtons: function (el) {
    $(editor.config.inlineMediaRegionSelector).each(function(){
      var $el = $(this),
          thisHasNoMediaBtn = ($el.children('.cms-media-btn').length < 1);
          
      if (thisHasNoMediaBtn) $el.append(editor.mediaBtn);
    });
  },

  onEditableBlurHandler: function(e){
    var el = this,
        $el = $(el),
        elemIsEmpty = editor.elemIsEmpty(el),
        elemIsContainer = editor.elemIsContainer(el);

    if (elemIsEmpty && elemIsContainer) $el.remove();
    editor.addMediaButtons(el);
    editor.removeLeftOverMediaBtns(el);
  },

  onEditableFocusHandler: function(e){
    var el = this;
    editor.nextEditableElem = editor.getNextEditableItem(el);
    editor.nextEditableItemExists = (editor.nextEditableElem === "{}" || typeof editor.nextEditableElem != 'undefined');
    editor.addMediaButtons(el);
    editor.removeLeftOverMediaBtns(el);
    mediaEditor.addResponsiveImageClickHandlers();
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
      if (editor.onlyContainsMediaBtn(el)) $(el).remove();
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
      var blockEl = editor.getTextBlockContainer(selRange.endContainer);
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

  reIndexSections: function () {
    $(editor.config.sectionSelector).each(function(el, i){
      var currentSection = '.section'+(i+1);
      $(currentSection).removeClass('section'+(i+1));
    });

    $(editor.config.sectionSelector).each(function(el, i){
      var $el = $(this);
      $el.addClass('section'+(i+1));
      $el.attr('id', 'section'+(i+1));
    });
  },

}
