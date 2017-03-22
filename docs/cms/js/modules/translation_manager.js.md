# translation_manager.js
This module shows a Translation Manager UI, which lists all the 
languages available in a searchable table.  

Translations can be enabled by clicking the ENABLE button next 
to the desired language.

Enabling a translation will create a new URL and password - these 
should be given to whoever will do the translation work.

Once a translator has logged into the given translation URL, 
they'll see a form showing form fields for the English on the 
left, and editable fields on the right. The translators should 
put their translations for each item in the textboxes on the 
right hand side.

Once the translations have been done, the translator can create the 
translated version of the page, by clicking the PREVIEW button.


First, we get our dependencies.
```js
var $ = require('cash-dom');  // like jquery
var store = require('store'); // cross browser localStorage wrapper

```
Define a var the module can use to reference itself
```js
var self;

```
Use strict setting.
```js
"use strict";

```
Define the CommonJS module
```js
module.exports = {

```
## Module Methods

### init()
restore any previously enabled translations on page load
```js
  init: function(){
    self = cms.translationManager;
    self.restoreTranslationSettings();
    return true // if we loaded ok
  },

```
### restoreTranslationSettings()
Get list of supported languages and get translations settings from 
local storage (so we can re-enable translations that have been enabled)
```js
  restoreTranslationSettings: function (){
    var languages = cms.getLanguages(),
        translations = store.get(cms.pageDir + '__translations');

    /* if localStorage settings were found */
    if (translations){
      /* update the CMS with settings from local storage */
      cms.translation = translations;
    } else {
      /* create new list of translations */
      cms.translation = {};
      /* for each supported language, create a translation object,
       * so we can track if the translation is enabled or not
       */
      Object.keys(languages).forEach(function (code){
        /* cms.translation.push({ 'code': code, 'name': languages[code].name, 'enabled' : false}); */
        cms.translation[code] = { 'name' : '', enabled: false};
        cms.translation[code].name = languages[code].name;
      });
    }
  },

```
### showUI()
show the Translation Manager UI
```js
  showUI: function () {
    var content = '',
        callback = self.removeEventHandlers;

    /* search form, filters the table below */
    content += '<input \
      type="text" \
      class="cms-trans-autocomplete" \
      placeholder="Enter language name.." />\
      <div class="cms-trans-table-container">';

    /* the table of translations ( fields = code|name|native name|url|pass|enable/disable) */
    content += self.buildTranslationsTable();

    content += '</div>'; // end table wrapper

    /* load modal */
    cms.modal.create({
      "title": 'Manage Translations',
      "contents": content,
      "callback": callback
    });
    cms.modal.show();

    self.addEventHandlers();
  },

```
### buildTranslationsTable()
Build the table of languages. Fields for each - name, native name, 
passwd, URL, enable button and disable button.
```js
  buildTranslationsTable: function () {
    var languages = cms.getLanguages(),
        table = '<table id="cms-trans-table" class="cms-trans-table">';

    /* add table header */
    table += '<thead>\
    <tr class="cms-trans-table-header">\
       <th>code</th>\
       <th>name</th>\
       <th class="cms-trans-header-native-name">native name</th>\
       <th>editor</th>\
       <th>password</th>\
       <th>enabled</th>\
     </tr>\
     </thead>\
     <tbody>';

    /* for each language, build a row in the table */
    Object.keys(languages).forEach(function (key){
      var code       = key,
          name       = languages[code].name,
          nativeName = languages[code].nativeName,
          passwd = '-';

      table += '\n\
      <tr class="cms-trans-row">\n\
        <td class="cms-trans-code" data-label="code:">\n\
          '+code+'\n\
        </td>\n\
        <td class="cms-trans-name" data-label="name:">\n\
          '+name+'\n\
        </td>\n\
        <td class="cms-trans-native-name" data-label="native name:" dir="'+languages[code].direction+'" >\n\
          '+nativeName+'\n\
        </td>\n';

        /* here we check a persistent list of our translations..
         * this list has each lang, enabled or not, and the passwd */

        /* if this translation is NOT enabled, show button to enable it */
        if (cms.translation[code].enabled === false){
          table += '\
          <td class="cms-trans-url" data-label="editor:">\n\
            -\n\
          </td>\n\
          <td class="cms-trans-passwd" data-label="password:">\n\
            -\n\
          </td>\n\
          <td class="cms-trans-enabled" data-label="">\n\
            <button data-lang="'+code+'" class="cms-trans-btn cms-trans-btn-enable">Enable</button>\n\
          </td>\n';
        
        /* if this translation IS enabled, show button to disable it */
        } else { 
          table += '\
          <td class="cms-trans-url" data-label="editor:">\n\
            <a href="?translate='+code+'" target="_blank" title="Edit '+name+'">Edit</a>\n\
          </td>\n\
          <td class="cms-trans-passwd" data-label="password:">\n\
            '+cms.translation[code].passwd+'\n\
          </td>\n\
          <td class="cms-trans-disabled" data-label="">\n\
            <button data-lang="'+code+'" class="cms-trans-btn cms-trans-btn-disable">Disable</button>\n\
          </td>\n';

        }
        
      table += '</tr>';

    });

    table += '</tbody></table>';

    return table;
  },

```
### updateTable()
update the contents of the table after enabling/disabling a translation
```js
  updateTable: function () {
    var table = self.buildTranslationsTable(); // get latest table

    /* disable existing event handlers */
    self.removeEventHandlers();

    /* replace table HTML, then update search settings */
    $('.cms-trans-table-container').html(table);
    self.autoCompleteHandler();

    /* add event handlers  */
    self.addEventHandlers();

    /*save translation settings to localStorage */
    store.set(cms.pageDir + '__translations', cms.translation);
  },

```
### addEventHandlers()
Add events when search field is changed and translation buttons are clicked
```js
  addEventHandlers: function () {
    $('.cms-trans-autocomplete').on('keyup', self.autoCompleteHandler);
    $('.cms-trans-autocomplete').on('change', self.autoCompleteHandler);
    $('.cms-trans-btn-enable').on('click',  self.enableBtnHandler);
    $('.cms-trans-btn-disable').on('click', self.disableBtnHandler);
  },

```
### autoCompleteHandler()
Hides table rows which do not match the given search term - 
it gets the search term on input change, and applies CSS to 
hide non-matching rows
```js
  autoCompleteHandler: function () {
    /* adapted from http://www.w3schools.com/howto/howto_js_filter_table.asp */
    var input, filter, table, tr, td, i;
    input   = $('.cms-trans-autocomplete')[0];
    filter  = input.value.toUpperCase();
    table   = document.getElementById('cms-trans-table');
    tr      = $(table).find('tr:not(.cms-trans-table-header)');

    /* for each row in the table */
    for (i = 0; i < tr.length; i++) {
      var code = tr[i].getElementsByTagName('td')[0],
          name = tr[i].getElementsByTagName('td')[1],
          native = tr[i].getElementsByTagName('td')[2],
          match = false;

      /* check code, name and native name for matching string */
      if (code && code.innerHTML.toUpperCase().indexOf(filter) > -1) {
        match = true;
      } else if (name && name.innerHTML.toUpperCase().indexOf(filter) > -1) {
        match = true;
      } else if (native && native.innerHTML.toUpperCase().indexOf(filter) > -1) {
        match = true;
      }

      /* if row had TD with matching contents, dont hide it */
      if (match) {
        tr[i].style.display = '';
      } else {
        /* hide it cos it didnt match */
        tr[i].style.display = "none";
      }

    }

  },

```
### enableBtnHandler()

```js
  enableBtnHandler: function () {
    var lang = $(this).attr('data-lang');
    
    /* button was clicked, so get the password */
    self.getTranslatorPasswd(lang, function updatePasswdInTable(passwd){
      if (passwd != '') {
        /* enable this translation and store passwd */
        cms.translation[lang].enabled = true;
        cms.translation[lang].passwd  = passwd;

        /* update the table to show enabled translation */
        self.updateTable();
      }
    });

  },

```
### disableBtnHandler()

```js
  disableBtnHandler: function () {
    var lang = $(this).attr('data-lang');

    /* update the setting for this translation */
    cms.translation[lang].enabled = false;
    /* update the translations table */
    self.updateTable();
  },

```
### getTranslatorPasswd(lang, callback)
Gets the password for the selected language/translation row, 
and if no passwd file exists, it will create one.

@param `lang` - string, 2 letter ISO language code (see [languages.js](https://github.com/sc0ttj/Project/blob/master/src/cms/js/modules/languages.js))  
@param `callback` - a function which takes a `passwd` string as a param
```js
  getTranslatorPasswd: function (lang, callback) {
    var data = new FormData();

    data.append('get_passwd', true);

    var onSuccessHandler = function (passwd){
      if (typeof callback == 'function') callback(passwd);
    }
    
    var onErrorHandler = function (result){
      /* if no translation passwd found, create one as the translation was just enabled */
      self.createTranslatorPasswd(lang, function (passwd){
        /* enable this translation and store passwd */
        cms.translation[lang].enabled = true;
        cms.translation[lang].passwd  = passwd;
        /* update the table */
        self.updateTable();
      });
    }

    cms.ajax.create('POST', 'cms/api/passwds/'+lang+'.php');
    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
    cms.ajax.send(data);
  },

```
### createTranslatorPasswd(lang, callback)
POSTs an `enable_translation` and `lang` to the translation backend, 
which will create a password and return it. On success, this func will 
execute the given callback, passing to it the new passwd as a param.

@param `lang` - string, 2 letter ISO language code (see [languages.js](https://github.com/sc0ttj/Project/blob/master/src/cms/js/modules/languages.js))  
@param `callback` - a function which takes a `passwd` string as a param
```js
  createTranslatorPasswd: function (lang, callback) {
    var data = new FormData();

    data.append('lang', lang);
    data.append('enable_translation', true);

    var onSuccessHandler = function (passwd){
      if (typeof callback == 'function') callback(passwd);
    }
    
    var onErrorHandler = function (msg){
      console.log('error creating password for translation ' + lang, msg);
    }

    cms.ajax.create('POST', cms.config.api.translate);
    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
    cms.ajax.send(data);
  },

```
### removeEventHandlers()

```js
  removeEventHandlers: function () {
    $('.cms-trans-btn-enable').off('click',  self.enableBtnHandler);
    $('.cms-trans-btn-disable').off('click', self.disableBtnHandler);
    $('.cms-trans-autocomplete').off('keyup', self.autoCompleteHandler);
    $('.cms-trans-autocomplete').off('change', self.autoCompleteHandler);
 },

```

End of module  
```js
}
```
------------------------
Generated _Wed Mar 22 2017 23:32:14 GMT+0000 (GMT)_ from [&#x24C8; translation_manager.js](translation_manager.js "View in source")

