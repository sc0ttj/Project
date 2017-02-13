var $ = require('cash-dom');
var store = require('store');
var self;

"use strict";

module.exports = {
  init: function(){
    self = cms.translationManager;


    self.restoreTranslationSettings();

    return true // if we loaded ok
  },

  restoreTranslationSettings: function (){
    // get list of supported languages
    // and get translations settings from local storage
    var languages = self.getLanguages(),
        translations = store.get(cms.pageDir + '__translations');

    // if localStorage settings were found
    if (translations){
      // update the CMS with settings from local storage
      cms.translation = translations;
    } else {
      // create new list of translations
      cms.translation = {};
      // for each supported language, create a translation object,
      // so we can track if the translation is enabled or not
      Object.keys(languages).forEach(function (code){
        // cms.translation.push({ 'code': code, 'name': languages[code].name, 'enabled' : false});
        cms.translation[code] = { 'name' : '', enabled: false};
        cms.translation[code].name = languages[code].name;
      });
    }
  },

  showUI: function () {
    var content = '',
        callback = self.exitModal;

    content += '<input \
      type="text" \
      class="cms-translations-autocomplete" \
      placeholder="Enter language code or name" />\
      <div class="cms-translations-table-container">';

    content += self.buildTranslationsTable();

    content += '</div>';

    // load modal
    cms.modal.create({
      "title": 'Manage Translations',
      "contents": content,
      "callback": callback
    });
    cms.modal.show();

    self.addEventHandlers();
  },

  buildTranslationsTable: function () {
    var languages = self.getLanguages(),
        table = '<table id="cms-translations-table" class="cms-translations-table">';

    // add table header
    table += '<thead>\
    <tr class="cms-translations-table-header">\
       <th>code</th>\
       <th>name</th>\
       <th class="cms-translations-header-native-name">native name</th>\
       <th>editor</th>\
       <th>password</th>\
       <th>enabled</th>\
     </tr>\
     </thead>\
     <tbody>';

    //
    // for each language, build a row in the table
    //
    Object.keys(languages).forEach(function (key){
      var code       = key,
          name       = languages[code].name,
          nativeName = languages[code].nativeName,
          passwd = '-';

      table += '\n\
      <tr class="cms-translations-row">\n\
        <td class="cms-translations-code" data-label="code:" data-lang="'+code+'">\n\
          '+code+'\n\
        </td>\n\
        <td class="cms-translations-name" data-label="name:" data-lang="'+code+'">\n\
          '+name+'\n\
        </td>\n\
        <td class="cms-translations-native-name" data-label="native name:" data-lang="'+code+'" dir="'+languages[code].direction+'" >\n\
          '+nativeName+'\n\
        </td>\n';

        // here we check a persistent list of our translations..
        // this list has each lang, enabled or not, and the passwd

        // if this translation is NOT enabled, show button to enable it
        if (cms.translation[code].enabled === false){

          table += '\
          <td class="cms-translations-url" data-label="editor:" data-lang="'+code+'">\n\
            -\n\
          </td>\n\
          <td class="cms-translations-passwd" data-label="password:" data-lang="'+code+'">\n\
            -\n\
          </td>\n\
          <td class="cms-translations-enabled" data-label="" data-lang="'+code+'">\n\
            <button data-lang="'+code+'" class="cms-translation-btn cms-translation-btn-enable">Enable</button>\n\
          </td>\n';

        // if this translation IS enabled, show button to disable it
        } else {

          table += '\
          <td class="cms-translations-url" data-label="editor:" data-lang="'+code+'">\n\
            <a data-lang="'+code+'" href="?translate='+code+'" target="_blank" title="Edit '+name+'">Edit</a>\n\
          </td>\n\
          <td class="cms-translations-passwd" data-label="password:" data-lang="'+code+'">\n\
            '+cms.translation[code].passwd+'\n\
          </td>\n\
          <td class="cms-translations-disabled" data-label="" data-lang="'+code+'">\n\
            <button data-lang="'+code+'" class="cms-translation-btn cms-translation-btn-disable">Disable</button>\n\
          </td>\n';

        }
        
      table += '</tr>';

    });

    table += '</tbody></table>';

    return table;
  },

  updateTable: function () {
    var table = self.buildTranslationsTable();

    // disable existing event handlers
    $('.cms-translation-btn-enable').off('click',  self.enableBtnHandler);
    $('.cms-translation-btn-disable').off('click', self.disableBtnHandler);

    // replace table HTML, then update search settings
    $('.cms-translations-table-container').html(table);
    self.autocompleteHandler();

    // disable event handlers 
    $('.cms-translation-btn-enable').on('click',  self.enableBtnHandler);
    $('.cms-translation-btn-disable').on('click', self.disableBtnHandler);

    //save translation settings to localstorage
    store.set(cms.pageDir + '__translations', cms.translation);
  },

  getLanguages: function () {
    var languages = app.getLanguages();
    return languages;
  },

  addEventHandlers: function () {
    $('.cms-translations-autocomplete').on('keyup', self.autocompleteHandler);
    $('.cms-translations-autocomplete').on('change', self.autocompleteHandler);
    $('.cms-translation-btn-enable').on('click',  self.enableBtnHandler);
    $('.cms-translation-btn-disable').on('click', self.disableBtnHandler);
  },

  autocompleteHandler: function () {
    //http://www.w3schools.com/howto/howto_js_filter_table.asp
    var input, filter, table, tr, td, i;
    input   = $('.cms-translations-autocomplete')[0];
    filter  = input.value.toUpperCase();
    table   = document.getElementById('cms-translations-table');
    tr      = table.getElementsByTagName('tr');

    // for each row in the table
    for (i = 0; i < tr.length; i++) {
      var code = tr[i].getElementsByTagName('td')[0],
          name = tr[i].getElementsByTagName('td')[1],
          native = tr[i].getElementsByTagName('td')[2],
          match = false;

      //
      // check code, name and native name for matching string
      //
      if (code && code.innerHTML.toUpperCase().indexOf(filter) > -1) {
        match = true;
      } else if (name && name.innerHTML.toUpperCase().indexOf(filter) > -1) {
        match = true;
      } else if (native && native.innerHTML.toUpperCase().indexOf(filter) > -1) {
        match = true;
      }

      // if row had TD with matching contents, dont hide it
      if (match) {
        tr[i].style.display = '';
      } else {
        // hide it cos it didnt match
        tr[i].style.display = "none";
      }

    }

  },

  enableBtnHandler: function () {
    var lang = $(this).attr('data-lang');
    
    self.getTranslatorPasswd(lang, function updatePasswdInTable(passwd){
      if (passwd != '') {
        // enable this translation and store passwd
        cms.translation[lang].enabled = true;
        cms.translation[lang].passwd  = passwd;

        // update the table
        self.updateTable();
      }
    });

  },

  disableBtnHandler: function () {
    var lang = $(this).attr('data-lang');

    // update the setting for this translation
    cms.translation[lang].enabled = false;
    // update the translations table
    self.updateTable();
  },

  getTranslatorPasswd: function (lang, callback) {
    var data = new FormData();

    data.append('get_passwd', true);

    var onSuccessHandler = function (passwd){
      if (typeof callback == 'function') callback(passwd);
    }

    var onErrorHandler = function (result){
      // if not translation passwd found, create one as the translation was just enabled
      self.createTranslatorPasswd(lang, function (passwd){
        // enable this translation and store passwd
        cms.translation[lang].enabled = true;
        cms.translation[lang].passwd  = passwd;
        // update the table
        self.updateTable();
      });
    }

    cms.ajax.create('POST', 'cms/api/passwds/'+lang+'.php');
    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
    cms.ajax.send(data);
  },

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

    cms.ajax.create('POST', 'cms/api/translation.php');
    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
    cms.ajax.send(data);
  },

  exitModal: function () {
    $('.cms-translation-btn-enable').off('click',  self.enableBtnHandler);
    $('.cms-translation-btn-disable').off('click', self.disableBtnHandler);
  },

}