var $ = require('cash-dom');
var self;

"use strict";

module.exports = {
  init: function(){
    self = cms.vocabEditor;
    if (self.shouldShowUI()) self.showUI();
    return true // if we loaded ok
  },

  shouldShowUI: function () {
    var lang      = self.getCurrentService(),
        langInfo  = app.getLangInfo(lang),
        validLang = (self.getQueryVariable('translate') && langInfo.code != 'undefined');

    if (validLang) return true;
    return false;
  },

  showUI: function (){
    // the funcs below will:
    // - get preview page html,
    // - then build the 'en' vocab for left side of UI
    // - then get vocab file contents for LANG
    // - finally add LANG vocab contents to right side of UI
    self.getPreviewPageHtml(self.getEnVocabFromPreview);
  },

  getCurrentService: function () {
    var service = self.getQueryVariable('translate') || self.getQueryVariable('preview') || app.lang.code || $('html').attr('lang');
    return service;
  },

  getPreviewPageHtml: function (callback) {
    var lang = self.getCurrentService();

    var onSuccessHandler = function (html){
      // console.log(html);
      callback(html);
      return html;
    }
    var onErrorHandler = function (errorText){
      console.log(errorText);
      return false;
    }

    cms.ajax.create('GET', 'preview.html');
    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
    cms.ajax.send(null);
  },

  getEnVocabFromPreview: function (html){
    // create an empty vocab file and get html to build it from
    var lang      = self.getCurrentService(),
        pageVocab = self.createNewVocab(lang),
        $html     = $(html),
        sectionSelector    = cms.config.sectionSelector,
        metaSelector       = 'meta[name^="title"], meta[name^="description"], meta[name^="author"], meta[name^="keywords"], meta[name^="news_keywords"], meta[name^="copyright"], meta[name^="twitter"], meta[property], meta[itemprop]',
        vocabElemsSelector = 'h1, h2, p, blockquote, li, video source, picture source, img',
        i = 0; // used to make 'section1', 'section2', etc

    // process the html we chose and build the vocab file
    $html.each(function processPreviewHTML(elem){
      var isMetaElem = ($.matches(elem, metaSelector)),
          isSection  = ($.matches(elem, sectionSelector));

      if (elem.nodeType != Node.TEXT_NODE){

        // get values for META section of vocab file

        if (isMetaElem){
          // console.log('meta', elem);
          var key   = $(elem).attr('itemprop') || $(elem).attr('property') || $(elem).attr('name'),
              value = $(elem).attr('content'),
              item = {};

          item[key] = value;

          pageVocab['meta'].push(item);
        }

        // get values for page sections part of vocabs

        if (isSection){
          var sectionName = 'section' + (i+1);

          // create { 'section1' : [] } etc
          pageVocab[sectionName] = [];

          $(elem).each(function getVocabElems(el, q){
            var vocabItems = $(el).find(vocabElemsSelector);

            // get all items to be added to vocab
            vocabItems.each(function getVocabValuesFromElem(pageElem){
              var key   = pageElem.tagName.toLowerCase(),
                  value = pageElem.innerText || $(pageElem).attr('src')  || $(pageElem).attr('srcset') || pageElem.innerHTML,
                  vocabItem  = {};

              // add the item to the vocab object, if value found
              if (value) {
                vocabItem[key] = value.trim();
                pageVocab[sectionName].push(vocabItem);
              }
            });

          });
          i++; // increment section name
        } // end if isSection

      } // end if !== TEXT_NODE

    }); //end $html.each()

    // we now have the latest preview page as a vocab file, will show in left side of form
    self.pageVocab = pageVocab;

    // we now have the default text to translate, so we can get a translation for it
    self.getVocabFileContents(function vocabReturnedOK(vocab){
      self.vocab = JSON.parse(vocab);
      // now populate the form with the contents of self.pageVocab (en) and self.vocab (vocab of current LANG)
      self.buildTranslatorUI();
    });

  },

  getVocabFileContents: function (callback) {
    var lang = self.getCurrentService();

    var onSuccessHandler = function (responseText){
      // console.log(responseText);
      self.vocab = responseText;
      callback(responseText);
      return responseText;
    }
    var onErrorHandler = function (responseText){
      // return default page vocab
      callback(JSON.stringify(self.pageVocab));
      return self.pageVocab;
    }

    cms.ajax.create('GET', 'vocabs/'+lang+'.json');
    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
    cms.ajax.send(null);
  },

  buildTranslatorUI: function () {
    var lang      = self.getCurrentService(),
        langInfo  = app.getLangInfo(lang),
        form      = self.createVocabEditorForm();

    // load modal
    cms.modal.create({
      title: 'Translate to '+langInfo.name,
      contents: form
    });
    cms.modal.show();
    $('.cms-modal-back-btn').html('Preview');
    self.addEventHandlers();
  },

  createNewVocab: function (lang) {
    var vocab = {};
    vocab['html'] = [ { 'lang': lang } ];
    vocab['meta'] = [];
    return vocab;
  },

  createVocabEditorForm: function () {
    var lang      = self.getCurrentService(),
        form      = '<form class="cms-vocab-form" data-lang="'+lang+'" action="cms/api/upload.php" method="post">\n',
        fields    = self.createVocabEditorFormFields();

    form += fields;
    form += '<button class="cms-modal-btn">Preview Translation</button>\n';
    form += '</form>\n';

    return form;
  },

  createVocabEditorFormFields: function (){
    var lang      = self.getCurrentService(),
        langInfo  = app.getLangInfo(lang),
        pageVocab = self.pageVocab,
        vocab     = self.vocab || self.pageVocab,
        form      = '',
        textDirection = langInfo.direction;

    // build form from self.pageVocab
    Object.keys(pageVocab).forEach(function createFormSections(key) {
      var section = pageVocab[key];
          sectionName = key;

      form += '<h3>'+key+'</h3>';
      section.forEach(function createSectionFormFields(elem, i) {
        // get form fiel values
        var key   = Object.keys(section[i]),
            value = Object.values(section[i]),
            valFromVocabFile = pageVocab[sectionName][i][key];

        //replace editable values with the values from the vocab file
        if (vocab.hasOwnProperty(sectionName)){
          // set to value from vocab file, or default back to value from preview page
          valFromVocabFile = pageVocab[sectionName][i][key];
          if (typeof vocab[sectionName][i] !== 'undefined') {
            valFromVocabFile = vocab[sectionName][i][key] || pageVocab[sectionName][i][key];
          }

        } 

        if (key == 'lang') value='en';

        // create the form section
        form += '<table>\n\
        <tr>\n\
        <td>\n\
          <label class="cms-modal-title cms-vocab-title cms-vocab-title-left">'+key+'</label>\n\
          <textarea disabled />'+value+'</textarea>\n\
        </td>\
        <td>\n\
          <label class="cms-modal-title cms-vocab-title cms-vocab-title-right">&nbsp;</label>\n\
          <textarea \
            class="cms-modal-input \
            cms-vocab-input" \
            data-name="'+key+'" \
            data-lang="'+lang+'" \
            data-section="'+sectionName+'" \
            dir="'+textDirection+'" \
            name="'+key+'" />'+valFromVocabFile.trim()+'</textarea>\n\
        </td>\n\
        </tr>\n\
        </table>\n';
      });
    });
    return form;
  },

  addEventHandlers: function () {
    $('.cms-modal-viewport .cms-vocab-form').find('textarea').each (function setTextareaHeights(){
      // auto grow the textareas based on content
      //http://stackoverflow.com/a/24676492
      this.style.height = '8px';
      this.style.height = (this.scrollHeight)+'px';
    });

    $('.cms-vocab-input').on('keypress', function (e){
      // auto grow the textareas based on content
      this.style.height = '8px';
      this.style.height = (this.scrollHeight)+'px';
      // prevent newlines
      if (e.which === 13) e.preventDefault();
      // clear ajax notification stylings
      $(this).removeClass('cms-vocab-uploaded');
      $('.cms-vocab-input').removeClass('cms-upload-label-error');
    });

    // upload vocab after each change
    $('.cms-vocab-input').on('blur', function(e){
      self.uploadVocab(e);
    });

    // button at bottom of page
    $('.cms-modal-btn').on('click', function (e) {
      e.preventDefault();
      // get preview.html contents, use current vocab to perform translation, 
      // then save to index.[lang].html and then preview it
      self.translatePage();
    });

    // back button, top left
    $('.cms-modal-back-btn').on('click', function(e){
      e.preventDefault();
      // get preview.html contents, use current vocab to perform translation, 
      // then save to index.[lang].html and then preview it
      self.translatePage();
    });
  },

  uploadVocab: function (e) {
    var lang          = self.getCurrentService(),
        vocab         = self.getFormVocab(),
        vocabFile     = self.createVocabFile(vocab),
        vocabFilename = lang+'.json',
        formData = new FormData(this);

    formData.append('vocab', vocabFile, vocabFilename);
    //prevent redirect and do ajax upload
    e.preventDefault();
 
    var onSuccessHandler = function (responseText){
      // console.log(responseText);
      $('.cms-vocab-input').addClass('cms-vocab-uploaded');
    }
    var onErrorHandler = function (responseText){
      console.log(responseText);
      $('.cms-vocab-input').addClass('cms-upload-label-error');
    }

    cms.ajax.create('POST', 'cms/api/upload.php');
    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
    cms.ajax.send(formData);
  },

  getFormVocab: function() {
    var vocabString = '{ ',
        prevSection;

    // for each form field
    $('.cms-vocab-input').each(function getVocabValue(){
      // console.log($(this).parents('table').next());
      var $this = $(this),
          section = $this.data('section'),
          nextItem = $(this).parents('table').next(),
          key = $this.data('name'),
          value = $this.val();

      var nextField = $(nextItem).find('.cms-vocab-input')[0];

      var nextSection = section;
      if (nextField) {
        nextSection = $(nextField).data('section');
      } else {
        nextSection = 'none';
      }

      //build a string of JSON
      
      // if starting a new section, start a new array
      if (section != prevSection) vocabString += '"' + section + '" : [ ';
      //add key value obj pairs into the array
      vocabString += '{ "' + key + '": ' + JSON.stringify(value) + ' }';
      // if next item is button, we are at last item in last group
      if(nextItem[0].tagName == 'BUTTON'){
        // end last array
        vocabString += ' ] ';
      // else next item is not button
      } else {
        // if not last item in section, and section is not none
        if (section != nextSection) {
          // and array
          vocabString += ' ], ';
        }
      }
      // if we are not at the last item, add a comma
      if (section == nextSection) vocabString += ', ';

      // prepare next loop
      prevSection = section;
    });
    vocabString +='}';
    return vocabString;
   },

  createVocabFile: function (vocabJSON) {
    return new Blob([vocabJSON], {type: 'text/plain'});
  },

  // downloadVocabFile: function () {
  //   var lang       = self.getCurrentService(),
  //       vocab      = self.getPageVocab(),
  //       vocabJSON  = '',
  //       vocabFilename  = lang+'.json';

  //   vocabJSON = self.getVocabAsJSON(vocab);

  //   self.downloadVocabAsFile(vocabJSON, vocabFilename);
  // },

  getVocabAsJSON: function (vocab) {
    return JSON.stringify(vocab, undefined, 2);
  },
    
  //http://stackoverflow.com/a/18197511
  downloadVocabAsFile: function (vocabJSON, filename) {
    var a = document.createElement('a');
    var file = self.createVocabFile(vocabJSON);
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
  },

  //https://css-tricks.com/snippets/javascript/get-url-variables/
  getQueryVariable: function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){return pair[1];}
    }
    return(false);
  },

  translatePage: function(){
    var tmpHtml = '',
        html = '',
        $html = '',
        editableItemSelector='',
        metaSelector = 'meta[name^="title"], meta[name^="description"], meta[name^="author"], meta[name^="keywords"], meta[name^="news_keywords"], meta[name^="copyright"], meta[name^="twitter"], meta[property], meta[itemprop]';

    tmpHtml = document.createElement('HTML');

    self.getPreviewPageHtml(function translateHtml(html){
      tmpHtml.innerHTML = html;
      $html = $(tmpHtml);

      // if 'vocabs/[lang].json exists, add contents of vocab file to $html, then run saveTranslatedHMTL
      self.getVocabFileContents(function updateHtmlUsingVocab(vocab){
        // get html of preview page (in the iframe)
        var vocab = JSON.parse(vocab),
            index = '';

        // replace meta items
        $html.find(metaSelector).each(function(el, i){
          el.content = Object.values(vocab['meta'][i])[0];
          // console.log(Object.values(vocab['meta'][i])[0]);
          index = i;
        });

        // update <title> tag as well
        $html.find('title').html(vocab.meta[0].title);

        // get editable items in page
        cms.config.editableItems.forEach(function (el) {
          editableItemSelector += el + ',';
        });
        editableItemSelector = editableItemSelector.slice(0, -1); // remove trailing comma

        var sectionIndex =1;
        // replace editables with values from vocab file
        $html.find(editableItemSelector).each(function(el, i){
          var sectionName = 'section'+sectionIndex,
              prevTag = '',
              elemCount = 0, 
              count = [];

          if (vocab[sectionName]){
            Object.values(vocab[sectionName]).forEach(function(vocabItem, i){
              var tag  = Object.keys(vocabItem)[0],
                  value = Object.values(vocabItem)[0],
                  elemToUpdate = '';

              // count each elem type, so we can reference the right ones in the vocab
              count[tag]++;
              // if tag not same as last, either set to zero if first time, or increment
              if (prevTag != tag) {
                count[tag] = count[tag]++ || 0;
              }
              // set to a var, so we can include in elemToUpdate
              elemCount = count[tag];

              // get the elem to update .. we will replace its values with values from vocab
              // find the elem using its details from vocab (section name, tag type, index)
              elemToUpdate = $html.find('.'+sectionName).find(tag)[elemCount];

              // console.log(sectionName, tag, elemCount, count[tag], value, elemToUpdate);

              // if we got an elem to update
              if (elemToUpdate) {
                // get the tag type and update the correct attribute
                if (tag == 'img'     && elemToUpdate.src)    elemToUpdate.src    = Object.values(vocabItem)[0];
                if (tag == 'source'  && elemToUpdate.srcset) elemToUpdate.srcset = Object.values(vocabItem)[0];
                if (tag !== 'source' && tag !== 'source' &&  elemToUpdate.innerHTML) elemToUpdate.innerHTML = Object.values(vocabItem)[0];
              }

              // get ready for next loop
              prevTag = tag;

            });
            sectionIndex++;
          }

        });

        // get lang details for current translation LANG
        var lang     = self.getCurrentService(),
            langInfo = app.getLangInfo(lang);

        langInfo.code = lang;

        // workaround for chrome contenteditable bug
        $html.find('*').removeAttr('style');
        // remove from page all of the lang info that will be replaced
        $html.find('html, body').removeClass('en');
        $html.find('html, body').removeAttr('dir');
        $html.find('html, body').removeClass('rtl');

        // now add the correct values for lang to page
        if (langInfo.direction === 'rtl') {
          $html.find('html, body').attr('dir', langInfo.direction);
          $html.find('html, body').addClass(langInfo.direction);
        }

        html = $html.html();
        // save as index.[lang].html, then preview it using preview manager
        cms.exportManager.saveTranslatedHTML(html);
      });

    });

  }

}