# page_editor.js
This module makes elements on the index.html page editable, adds buttons to inline 
elements and generally provides in-place, WYSIWYG editing of HTML.


First, we get our dependencies
```js
var $ = require('cash-dom');

```
Set a var we can use for consistent self reference
```js
var self;

```
Use strict rules
```js
"use strict";

```
Define our CommonJS module
```js
module.exports = {

```
## Module Methods

### init()
On init, create UI buttons, make chosen elems editable, add event handlers 
such as clickable elems, and editable elem actions.
```js
  init: function(){
    self = this;
    document.body.setAttribute('spellcheck', false);
    /* check if in firefox or not */
    self.isInFirefox = (typeof InstallTrigger !== 'undefined');
    /* create the HTML for the ADD MEDIA buttons */
    self.createMediaBtn();
    /* setup the editable elements */
    self.setEditableItems(cms.config.editableItems);
    self.setEditableRegions(cms.config.editableRegionClass);
    self.nextEditableElem = $('contenteditable')[0];
    /* setup the events for keypress etc on editable items */
    self.setEventHandlers();
  },

```
### createMediaBtn
Creates the inline buttons, adds them to page, 
and finally adds the click events to them
```js
  createMediaBtn: function (){
    /* define the HTML */
    self.mediaBtn = '\
    <div id="cms-media-btn" \
         class="cms-media-btn cms-anim-fade-500ms cms-transparent"\
         contenteditable="false"\
         onclick="mediaBtnClickHandler(this);">\
      ADD MEDIA\
    </div>';
    
    /* mediaBtnClickHandler() - the event handler function */
    mediaBtnClickHandler = function (el){
      var imgHtml = '<picture><img class="inline-image" src=images/placeholders/550x550.png /></picture>',
          $el     = $(el),
          $target = $el;

      /* when an ADD MEDIA button is clicked, the code below will 
       * add an image after the currently focused element
       */
      if ($el.hasClass('cms-media-btn')) $target = $el.parent();
      $target.after(imgHtml);
      $target.children('.cms-media-btn').remove();
    };
  },

```
### setEditableItems()

```js
  setEditableItems: function(items){
    items.forEach(function makeItemEditable(el, i){
      var $elems = $(cms.config.sectionSelector + ' ' + el);
      $elems.attr('contenteditable', true);
      $elems.addClass(cms.config.editableClass);
    });
  },

```
### setEditableRegions()

```js
  setEditableRegions: function(sel){
    var selector = sel.replace(/^\./, ''),
        $elems = $(cms.config.sectionSelector + ' .' + selector);
    
    $elems.attr('contenteditable', true);
    $elems.addClass(cms.config.editableRegionClass);
    self.addMediaButtons();
  },

```
### setEventHandlers()

```js
  setEventHandlers: function(){
    var $editables = self.getEditableItems();
    
    $editables.off('focus', self.onEditableFocusHandler);
    $editables.off('blur', self.onEditableBlurHandler);
    $editables.off('keypress', self.onEditableKeyPressHandler);
    
    $editables.on('focus', self.onEditableFocusHandler);
    $editables.on('blur', self.onEditableBlurHandler);
    $editables.on('keypress', self.onEditableKeyPressHandler);

    /* add a popup menu on text highlight */
    self.onHighlightTextHandler();
  },

```
### getEditableItems()

```js
  getEditableItems: function () {
    var $items = $('[contenteditable]');
    return $items;
  },

```
### onHighlightTextHandler()

```js
  onHighlightTextHandler: function(){
```
uses my fork of grande.js (https://github.com/sc0ttj/grande.js)
```js
    var selector = '.' + cms.config.editableRegionClass;
    var editables = document.querySelectorAll(selector);
    grande.bind(editables);
  },

```
### onEditableKeyPressHandler()

```js
  onEditableKeyPressHandler: function(e){
    var el = this;

    /* crude firefox fix - dont allow total emptying of editable regions */
    /* if(self.isInFirefox && self.elemIsEmpty(el)) document.execCommand("insertHTML", false, '<p contenteditable="true"></p>'); */

    if (e.which === 13) {
      if(!self.elemIsContainer(el)){
        e.preventDefault();
        if (self.nextEditableItemExists) self.nextEditableElem.focus();
      } else {
        /* if (!self.isInFirefox) $(':focus')[0].blur(); */
      }
      return false;
    }
  },

```
### addMediaButtons()

```js
  addMediaButtons: function () {
    $(cms.config.inlineMediaRegionSelector).each(function(){
      var $el = $(this),
          thisHasNoMediaBtn = ($el.children('.cms-media-btn').length < 1);
          
      if (thisHasNoMediaBtn) $el.append(self.mediaBtn);
    });
  },

```
### onEditableBlurHandler()

```js
  onEditableBlurHandler: function(e){
    var el = this,
        $el = $(el),
        elemIsEmpty = self.elemIsEmpty(el),
        elemIsContainer = self.elemIsContainer(el);

    if (elemIsEmpty && elemIsContainer) $el.remove();
    self.addMediaButtons();
    self.removeLeftOverMediaBtns(el);
    cms.saveProgress();
  },

```
### onEditableFocusHandler()

```js
  onEditableFocusHandler: function(e){
    var el = this;
    self.nextEditableElem = self.getNextEditableItem(el);
    self.nextEditableItemExists = (self.nextEditableElem === "{}" || typeof self.nextEditableElem != 'undefined');
    self.removeLeftOverMediaBtns(el);
    cms.imageManager.addResponsiveImageClickHandlers();
    
    /* chrome bug workaround - remove needless <span>s from <p>s
     * select spans to unwrap
     * https://plainjs.com/javascript/manipulation/unwrap-a-dom-element-35/
     */
    $(this).find('span:not([class="stat-text-highlight"])').each(function unwrapSpan(span){
      var parent = span.parentNode;
      while (span.firstChild) parent.insertBefore(span.firstChild, span);
      parent.removeChild(span);
    });
  },

```
### getNextEditableItem()

```js
  getNextEditableItem: function (el) {
    var nextItem = $('[contenteditable]').eq($('[contenteditable]').index($(el))+1)[0];
    return nextItem;
  },

```
### elemIsEmpty()

```js
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

```
### elemIsContainer()

```js
  elemIsContainer: function (el) {
    var elemIsContainer  = ($(el).children('[contenteditable]').length > 0);
    if (elemIsContainer) return true;
    return false;
  },

```
### removeLeftOverMediaBtns

```js
  removeLeftOverMediaBtns: function (el){
    $(el).children().each(function(elem){
      if (self.onlyContainsMediaBtn(elem)) $(elem).remove();
    });
    if (self.onlyContainsMediaBtn(el)) $(el).remove();
  },

```
### onlyContainsMediaBtn()

```js
  onlyContainsMediaBtn: function (el) {
    var onlyContainsBtn = (el.innerHTML.indexOf('<div id="cms-media-btn"') === 0);
    return onlyContainsBtn;
  },

```
### getTextBlockContainer()

```js
  /* https://stackoverflow.com/questions/5740640/contenteditable-extract-text-from-caret-to-end-of-element?answertab=votes#tab-top */
  getTextBlockContainer: function(node) {
    while (node) {
      if (node.nodeType == 1) return node;
      node = node.parentNode;
    }
  },

```
### getTextAfterCaret()

```js
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

```

End of module
```js
};

```
------------------------
Generated _Sat Mar 25 2017 03:19:45 GMT+0000 (GMT)_ from [&#x24C8; page_editor.js](page_editor.js "View in source")

