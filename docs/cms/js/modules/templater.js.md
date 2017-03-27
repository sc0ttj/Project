# templater.js
A small module that uses [mustache.js](https://www.npmjs.com/package/mustache) to create HTML by combining 
`.tmpl` files and JSON data.  
See the templates in [src/app/templates/](https://github.com/sc0ttj/Project/tree/master/src/app/templates).

Get our dependencies.
```js
var $ = require('cash-dom'); // like jquery
var m = require('mustache'); // template compiler

```
use strict setting
```js
"use strict";

```
Define the CommonJS module
```js
module.exports = {
  
```
## Module Methods

### init()

```js
  init: function(){
    var sections = this.getSections();
    sections.each(this.numberTheSections);
    return true // if we loaded ok
  },

```
### getSections()

@return `sections`    - an HTML Collection of the sections of the page
```js
  getSections: function(){
    var sections = $(cms.config.sectionSelector);
    return sections;
  },

```
### numberTheSections(elem, i)
Adds a numberred class and id to the given element

@param `elem` - the section to number  
@param `index` - the index position of the section
```js
  numberTheSections: function(elem, i){
    $(elem).addClass('section' + (i+1));
    $(elem).attr('id', 'section'+(i+1));
  },

```
### renderTemplate(template, data)
renders HTML from mustache templates

@param `template` - string, a mustache template (see `src/app/templates/*.tmpl`)  
@param `data`     - JSON object - the keys/values to populate the given template  
@return `html`    - string, the compiled HTML output  
```js
  renderTemplate: function(template, data){
    m.parse(template); // caching
    return m.render(template, data);
  },

```
End of module
```js
};

```
------------------------
Generated _Sat Mar 25 2017 03:19:45 GMT+0000 (GMT)_ from [&#x24C8; templater.js](templater.js "View in source")

