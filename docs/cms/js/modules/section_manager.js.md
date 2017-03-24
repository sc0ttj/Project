# section_manager.js
This module creates a popup modal dialog, with a list of page sections.  
The user clicks on a section in the Section Manager to add it to the page, 
as a new section.

The 'templates' option in the [CMS config](https://github.com/sc0ttj/Project/blob/jdi/docs/cms/js/cms.js.md) defines which templates/sections are available to add.


Let's start - first, we get our dependencies.
```js
var $ = require('cash-dom');

```
Then set a persistent reference.
```js
var self;

```
Use strict setting.
```js
"use strict";

```
Define our CommonJS module.
```js
module.exports = {

```
## Module Methods

### init()
```js
  init: function(){
    self = this;
  },

```
### showUI()
Show a modal popup dialog, listing the sections that can be added
```js
  showUI: function () {
    /* get html to be used in modal window */
    self.sectionPreviews = self.getSectionPreviewImgs();

    /* load modal */
    cms.modal.create({
      title: 'Section Manager',
      contents: self.sectionPreviews
    });
    cms.modal.show();

    /* get modal contents and add event handlers */
    self.$previewImgs = $('.cms-modal-viewport').children();
    self.$previewImgs.on('click', self.sectionPreviewClickHandler);
  },

```
### getSectionPreviewImgs()
Get the preview images for each template defined in the CMS config
```js
  getSectionPreviewImgs: function () {
    var previewImgs = '';
    cms.config.templates.forEach(function (section, i){
      var previewImg = '<img id="'+section+'" src="cms/images/previews/'+section+'.png" alt="'+section+'" />';
      previewImgs += previewImg;
    });
    return previewImgs;
  },

```
### sectionPreviewClickHandler(e)
Click handler for the template preview images
```js
  sectionPreviewClickHandler: function (e) {
    self.getTemplateFromFile(this.id);
  },

```
### getTemplateFromFile(template)
Get the markup from the chosen `.tmpl` file and the build the HTML 
to be used. 

@param `template` - string, the template file name (see list of valid templates in CMS config)
```js
  getTemplateFromFile: function (template) {
    cms.ajax.create('GET', 'templates/'+template);

    /* onSuccessHandler()
     * handle successful GET of template 
     * @param template - string, the mustache template markup
     */
    var onSuccessHandler = function (template){
      var sectionHtml = cms.templater.renderTemplate(template, cms.pageConfig);

      /* we successfully got the template + data into section HTML, so let's 
       * so add the new section template to the page, and re-index all the 
       * page sections. Finally, reload the CMS and CMS menu.
       */
      self.addTemplateToPage(sectionHtml);
      self.reIndexSections();
      cms.modal.hide();

      /* setup the newly added section with the cms */
      cms.ui.showMenu();
      cms.reload();
    }

    /* onErrorHandler()
     * handle failure to GET the template
     */
    var onErrorHandler = function (){
      alert('error');
    }

    /* run the ajax request */
    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
    cms.ajax.send(null);
  },
  
```
### addTemplateToPage(html)
Adds a new section to the page (index.html) then populates it with the 
given HTML string

@param `html` - string, the HTML to add to the page, as a new section
```js
  addTemplateToPage: function (html) {
    $(cms.config.sectionSelector).last().after(cms.config.sectionContainer);
    $(cms.config.sectionSelector).last().html(html);
  },

```
### moveSectionUp(index)

@param `index` - int, the index of the section to move
```js
  moveSectionUp: function (index) {
    var $section = $('.section'+index);
    $section.prev().before($section);
  },

```
### moveSectionDown(index)

@param `index` - int, the index of the section to move
```js
  moveSectionDown: function (index) {
    var $section = $('.section'+index);
    $section.next().after($section);
  },

```
### removeSection(index)

@param `index` - int, the index of the section to remove
```js
  removeSection: function (index) {
    var $section = $('.section'+index);
    $section.remove();
  },

```
### reIndexSections()
Update all sections on the page (index.html), so that they are in correct 
numerical order.
```js
  reIndexSections: function () {
    var $sections = $(cms.config.sectionSelector);

    $sections.each(function(el, i){
      var $el = $(this),
          currentSection = '.section'+(i+1);
      $(currentSection).removeClass('section'+(i+1));
      $el.addClass('section'+(i+1));
      $el.attr('id', 'section'+(i+1));
    });
  },

```

End of module
```js
}
```
------------------------
Generated _Wed Mar 22 2017 22:18:17 GMT+0000 (GMT)_ from [&#x24C8; section_manager.js](section_manager.js "View in source")

