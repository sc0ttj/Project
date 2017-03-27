# file_manager.js
This is a simple wrapper for [PHPFM](https://www.codeproject.com/Articles/1167761/PHPFM-A-single-file-responsive-file-manager), which loads up in a CMS modal.

Get our JS dependencies
```js
var $ = require('cash-dom'); /* jQuery alternative */

```
Create a self reference 
```js
var self;

```
Use strict setting
```js
"use strict";

```
Define CommonJS module
```js
module.exports = {
  
```
## Module Methods

### init()
Makes this module available globally as cms.fileManager
```js
  init: function(){
    self = cms.fileManager;
    return true // if we loaded ok
  },

```
### showUI()
Creates an iframe which contains PHPFM, then loads  
a CMS modal with that iframe as its main content.
```js
  showUI: function (){
    
    /* create our iframe HTML */
    var content = '\n\
    <iframe id="file-manager"\n\
      title="File Manager"\n\
      width="100%"\n\
      height="100%"\n\
      frameborder="0"\n\
      marginheight="0"\n\
      marginwidth="0"\n\
      src="phpfm.php">\n\
    </iframe>';

    /* load the modal, just an iframe containing local copy of PHPFM
     * https://www.codeproject.com/Articles/1167761/PHPFM-A-single-file-responsive-file-manager
     */
    cms.modal.create({
      "title": 'File Manager',
      "contents": content
    });
    cms.modal.show();

    /* add custom styling for this CMS modal */ 
    $('.cms-modal-viewport').addClass('cms-modal-file-manager')
  },

```
End of module
```js
};

```
------------------------
Generated _Sat Mar 25 2017 03:19:45 GMT+0000 (GMT)_ from [&#x24C8; file_manager.js](file_manager.js "View in source")

