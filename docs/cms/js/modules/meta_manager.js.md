# meta_manager.js
This module allows users to easily edit the META information of the page 
(index.html) via a simple, popup form.

Let's begin - get our dependencies 
```js
var $ = require('cash-dom');
```

### init()

```js
  init: function(){
    self = this; /* consistent self reference */
  },

```
### showUI()

```js
  showUI: function () {
    
    /* Get the meta values from the page */
    var form        = '',
        $meta       = $('head').find('meta[name^="title"], meta[name^="description"], meta[name^="author"], meta[name^="keywords"], meta[name^="news_keywords"], meta[name^="copyright"]'),
        $twitter    = $('head').find('meta[name^="twitter"]'),
        $facebook   = $('head').find('meta[property]'),
        $googleplus = $('head').find('meta[itemprop]');

    /* addMetaSection()
     * a function that will build our editable meta info form sections
     * 
     * @param `title` - string, title of the meta section  
     * @param `$list` - an HTML Collection of meta elems  
     */
    var addMetaSection = function (title, $list){
      var type = 'name';

      /* set the attribute to look for */
      if (title === 'Facebook'){
        type = 'property';
      } else if (title === 'Google+') {
        type = 'itemprop';
      }

      /* add a header to the form for this meta section */
      form += '<h3 class="cms-meta-group-header">'+title+'</h3>\n\r';
 
      /* for each meta elem/item, 
       * get the name and value, 
       * then create a form field 
       */
      $list.each(function (el) {
        var metaValue = el.attributes['content'].nodeValue,
            metaKey   = $(el).attr('itemprop');
        
        /* fix empty meta fields */
        if (!metaKey) metaKey = $(el).attr('property');
        if (!metaKey) metaKey = $(el).attr('name');

        /* build the form field html string */
        form += '\
        <label>\n\r\
          <p class="cms-meta-key">'+metaKey+'</p>\n\r\
          <input data-type="'+type+'" name="'+metaKey+'" class="cms-meta-value" type="text" value="'+metaValue+'" size="25" />\n\r\
        </label>\n\r';
      });

    };

    /* create the form element, the add each meta section to the form */
    form = '<form name="cms-meta-form" class="cms-meta-form" action="" method="POST">\n\r';
    addMetaSection('Meta Info', $meta);
    addMetaSection('Twitter', $twitter);
    addMetaSection('Facebook', $facebook);
    addMetaSection('Google+', $googleplus);
    form += '</form>\n\r';
    
    /* load modal */
    cms.modal.create({
      title: 'Edit Meta Info',
      contents: form
    });
    cms.modal.show();

    /* modal is loaded, now add event handlers for the modal contents */
    self.addEventHandlers();

  },

```
### addEventHandlers()
This func calls the `updateMeta()` function each time a Meta Manager 
form field value changes.  
```js
  addEventHandlers: function () {
    $('input.cms-meta-value').on('change', function updateMetaField(e){
      var attr      = $(this).data('type'),
          metaKey   = $(this).attr('name'),
          metaValue = $(this).val();

      self.updateMeta(attr, metaKey, metaValue);
    });
  },

```
### updateMeta()
Update the meta values in the page with the ones given as parameters  

@param `attr`  - string, name of the meta attribute to update  
@param `key`   - string, the attribute key to update  
@param `value` - string, the new value to assign to the given key  
```js
  updateMeta: function (attr, key, value) {
    var elemToUpdate = $('head').find('meta['+attr+'^="'+key+'"]');

    /* If the meta item is 'title', use it to update the <title> tag */
    if (key === 'title'){
      /* update <title> in <head> */
      $('head title').text(value);
    }

    /* If a value was given, update the attribute, else clear it */
    if (value) {
      $(elemToUpdate).attr('content', value);
    } else {
      $(elemToUpdate).attr('content', '');
    }
  },

}
```
------------------------
Generated _Wed Mar 22 2017 14:44:04 GMT+0000 (GMT)_ from [&#x24C8; meta_manager.js](meta_manager.js "View in source")

