// # vocab_editor.js

// This module provides a form that allows users to create and edit vocab files, 
// as well as translating HTML using the vocab files available. 
// The vocab files created/updated are in the `vocabs` directory.  

// This module to creates, edits and get values from the vocab files, 
// so it can build its UI, and the translated page(s).

// Vocab files are named after the 2 letter language code they are 
// associated with.  
//Examples: French will be `fr.json`, Arabic is `ar.json`.  

// The vocab files are JSON files which contain the text values of the 
// page being edited, as a JSON object.


// ## Begin script

// Get our dependencies
var $ = require('cash-dom'); // jquery alternative

// Set a persistent self reference for this module
var self;

// Use strict setting
"use strict";

// Define the CommonJS module
module.exports = {

  // ## Module Methods

  // ### init()
  // Disable editable content on the main page, then check if we 
  // should load the vocab editor, and if so, load it.
  init: function(){
    self = cms.vocabEditor;
    $('[contenteditable]').attr('contenteditable', false);
    if (self.shouldShowUI()) self.showUI();
    return true // if we loaded ok
  },

  // ### shouldShowUI()
  // If `?translate=LANG` is present in the current URL, then show 
  // the Vocab Editor. (LANG must be a valid 2 letter ISO language code).
  shouldShowUI: function () {
    var lang      = self.getCurrentService(),
        langInfo  = cms.getLangInfo(lang),
        validLang = (self.getQueryVariable('translate') && langInfo.code != 'undefined');

    if (validLang) return true;
    return false;
  },

  // ### showUI()
  // shows the vocab editor UI.
  showUI: function (){
    /* the funcs below will:
     * - get preview page html,
     * - then build the 'en' vocab for left side of UI
     * - then get vocab file contents for LANG
     * - finally add LANG vocab contents to right side of UI */
    self.getPreviewPageHtml(self.getEnVocabFromPreview);
  },

  // ### getCurrentService()
  // Check the current URL, getthe translate param from the query string, 
  // the CMS settings or the page HTML.
  //  
  // @return `service` - string, a 2 letter country code (A.K.A the name of the service)  
  getCurrentService: function () {
    var service = self.getQueryVariable('translate') || self.getQueryVariable('preview') || cms.lang.code || $('html').attr('lang');
    return service;
  },

  // ### getPreviewPageHtml()
  // Get the page HTML as a string from the preview.html file
  //  
  // @param `callback` - the function to execute after success, 
  // it will get the page HTML as param `html`  
  getPreviewPageHtml: function (callback) {
    var lang = self.getCurrentService();

    var onSuccessHandler = function (html){
      callback(html);
      return html;
    };
    var onErrorHandler = function (errorText){
      console.log(errorText);
      return false;
    };

    cms.ajax.create('GET', 'preview.html');
    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
    cms.ajax.send(null);
  },

  // ### getEnVocabFromPreview()
  // Create the default/english vocab file (called `pageVocab`) from 
  // the given HTML string.
  //  
  // @param `html` - string, the HTML from which we will build the vocab file
  getEnVocabFromPreview: function (html){
    /* create an empty vocab file and get html to build it from */
    var lang      = self.getCurrentService(),
        pageVocab = self.createNewVocab(lang), //create an empty vocab object
        $html     = $(html), // the html from which we will build the vocab JSON
        sectionSelector    = cms.config.sectionSelector,
        /* get the page meta values */
        metaSelector       = 'meta[name^="title"], meta[name^="description"], meta[name^="author"], meta[name^="keywords"], meta[name^="news_keywords"], meta[name^="copyright"], meta[name^="twitter"], meta[property], meta[itemprop]',
        /* a list of the elements we will get values from */
        vocabElemsSelector = 'h1, h2, p, blockquote, li, video source, picture source, img',
        i = 0; // used to make 'section1', 'section2', etc

    /* process the html we chose and build the vocab file */
    $html.each(function processPreviewHTML(elem){
      var isMetaElem = ($.matches(elem, metaSelector)),
          isSection  = ($.matches(elem, sectionSelector));

      if (elem.nodeType != Node.TEXT_NODE){

        /* get values for META section of vocab file */
        if (isMetaElem){
          /* console.log('meta', elem); */
          var key   = $(elem).attr('itemprop') || $(elem).attr('property') || $(elem).attr('name'),
              value = $(elem).attr('content'),
              item = {};

          item[key] = value;

          pageVocab['meta'].push(item);
        }

        /* get values for page sections part of vocabs */
        if (isSection){
          var sectionName = 'section' + (i+1);

          /* create { 'section1' : [] } etc */
          pageVocab[sectionName] = [];

          $(elem).each(function getVocabElems(el, q){
            var vocabItems = $(el).find(vocabElemsSelector);

            /* get all items to be added to vocab */
            vocabItems.each(function getVocabValuesFromElem(pageElem){
              var key   = pageElem.tagName.toLowerCase(),
                  value = pageElem.innerText || $(pageElem).attr('src')  || $(pageElem).attr('srcset') || pageElem.innerHTML,
                  vocabItem  = {};

              /* add the item to the vocab object, if value found */
              if (value) {
                vocabItem[key] = value.trim();
                pageVocab[sectionName].push(vocabItem);
              }
            });

          });
          i++; /* increment section name */
        } /* end if isSection */

      } /* end if !== TEXT_NODE */

    }); /* end $html.each() */

    /*
     * we now have the latest preview page as a vocab file - 
     * later we will show it in the left side of the vocab editor UI,
     * so lets assign to `self`, to make it available to all methods */
    self.pageVocab = pageVocab;

    /* 
     * we now have the default text to translate, 
     * so we can get a translation for it */
    self.getVocabFileContents(function vocabReturnedOK(vocab){

      /* make the vocab contents available to all methods */
      self.vocab = JSON.parse(vocab);

      /* 
       * now populate the form with the contents of self.pageVocab (en) 
       * and self.vocab (vocab of current LANG) */
      self.buildTranslatorUI();
    });

  },

  // ### getVocabFileContents()
  // Read the vocab JSON fro ma JSON file, the vocab checked will be the 
  // one that matches the current language/service.
  //  
  // @param `callback` - the function to run after attempting to 
  // get the contents of the vocab file  
  // @return `responseText` - string, the vocab JSON as a string  
  getVocabFileContents: function (callback) {
    
    /* get the current language */
    var lang = self.getCurrentService();

    var onSuccessHandler = function (responseText){
      /* we now have the vocab contents, so lets make it available 
       * to all methods, to re-use it later */
      self.vocab = responseText;

      /* run the given callback function */
      callback(responseText);
      
      /* return the vocab contents */
      return responseText;
    };

    var onErrorHandler = function (responseText){
      /* return default page vocab */
      callback(JSON.stringify(self.pageVocab));
      return self.pageVocab;
    };

    cms.ajax.create('GET', 'vocabs/'+lang+'.json');
    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
    cms.ajax.send(null);
  },

  // ### buildTranslatorUI()
  // Create a modal dialog containing a form for editing vocab files.
  buildTranslatorUI: function () {
    /* get the current language, and build our form HTML */
    var lang      = self.getCurrentService(),
        langInfo  = cms.getLangInfo(lang),
        form      = self.createVocabEditorForm();

    /* load modal */
    cms.modal.create({
      title: 'Translate to '+langInfo.name,
      contents: form
    });
    cms.modal.show();
    
    /* rename the back button text to 'Preview' */
    $('.cms-modal-back-btn').html('Preview');
    
    /* add event handlers to modal dialgo ocntents */
    self.addEventHandlers();
  },

  // ### createNewVocab()
  // Create an empty vocab object, contaning only the given language.
  //  
  // @param `lang` - string, a 2 letter ISO language code (see [languages.js](https://github.com/sc0ttj/Project/blob/master/src/cms/js/modules/languages.js))   
  // @return `vocab` - object, the new vocab object  
  createNewVocab: function (lang) {
    var vocab = {};
    vocab['html'] = [ { 'lang': lang } ];
    vocab['meta'] = [];
    return vocab;
  },

  // ### createVocabEditorForm()
  // Create the form used to edit the contents of the current 
  // vocab file. The form HTML will be returned.
  //  
  // @return `form` - string, the form HTML  
  createVocabEditorForm: function () {
    var lang      = self.getCurrentService(),
        form      = '<form class="cms-vocab-form" data-lang="'+lang+'" action="'+cms.config.api.upload+'" method="post">\n',
        fields    = self.createVocabEditorFormFields(); // get fields based on vocab contents

    /* append the rest of th eform HTML */
    form += fields;
    form += '<button class="cms-modal-btn">Preview Translation</button>\n';
    form += '</form>\n';

    return form;
  },

  // ### createVocabEditorFormFields()
  // Get the contents of the vocab file for the current language, and 
  // for each item in the vocab, build the vocab editor form fields HTML.
  //  
  // return `form` - string, the form fields HTML  
  createVocabEditorFormFields: function (){
    var lang      = self.getCurrentService(),
        langInfo  = cms.getLangInfo(lang),
        pageVocab = self.pageVocab,
        vocab     = self.vocab || self.pageVocab,
        form      = '',
        textDirection = langInfo.direction;

    /* build form from self.pageVocab */
    Object.keys(pageVocab).forEach(function createFormSections(key) {
      var section = pageVocab[key];
          sectionName = key;

      form += '<h3>'+key+'</h3>';
      section.forEach(function createSectionFormFields(elem, i) {
        /* get form fiel values */
        var key   = Object.keys(section[i]),
            value = Object.values(section[i]),
            valFromVocabFile = pageVocab[sectionName][i][key];

        /* replace editable values with the values from the vocab file */
        if (vocab.hasOwnProperty(sectionName)){
          /* set to value from vocab file, or default back to value from preview page */
          valFromVocabFile = pageVocab[sectionName][i][key];
          if (typeof vocab[sectionName][i] !== 'undefined') {
            valFromVocabFile = vocab[sectionName][i][key] || pageVocab[sectionName][i][key];
          }

        } 

        if (key == 'lang') value='en';

        /* create the form section */
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

  // ### addEventHandlers()
  // Add the event handlers to the form inputs and textareas.
  addEventHandlers: function () {
    $('.cms-modal-viewport .cms-vocab-form').find('textarea').each (function setTextareaHeights(){
      /* auto grow the textareas based on content */
      /* http://stackoverflow.com/a/24676492 */
      this.style.height = '8px';
      this.style.height = (this.scrollHeight)+'px';
    });

    $('.cms-vocab-input').on('keypress', function (e){
      /* auto grow the textareas based on content */
      this.style.height = '8px';
      this.style.height = (this.scrollHeight)+'px';
      /* prevent newlines */
      if (e.which === 13) e.preventDefault();
      /* clear ajax notification stylings */
      $(this).removeClass('cms-vocab-uploaded');
      $('.cms-vocab-input').removeClass('cms-upload-label-error');
    });

    /* upload vocab after each change */
    $('.cms-vocab-input').on('blur', function(e){
      self.uploadVocab(e);
    });

    /* button at bottom of page */
    $('.cms-modal-btn').on('click', function (e) {
      e.preventDefault();
      /* get preview.html contents, use current vocab to perform translation,
       * then save to index.[lang].html and then preview it */
      self.translatePage();
    });

    /* back button, top left */
    $('.cms-modal-back-btn').on('click', function(e){
      e.preventDefault();
      /* get preview.html contents, use current vocab to perform translation, 
       * then save to index.[lang].html and then preview it */
      self.translatePage();
    });
  },

  // ### uploadVocab()
  // Get the translations in the Vocab Editor form (right hand side of the UI), 
  // create a vocab from those values, then upload as a new vocab file (or 
  // update a vocab file if it already exists for that language).
  //  
  // @param `e` - the upload event, we cancel it in this method to prevent 
  // a redirect, and we use AJAX instead  
  uploadVocab: function (e) {
    var lang          = self.getCurrentService(),
        vocab         = self.getFormVocab(),
        vocabFile     = self.createVocabFile(vocab),
        vocabFilename = lang+'.json',
        formData = new FormData(this);

    /* add the vocab to the upload data */
    formData.append('vocab', vocabFile, vocabFilename);
    
    /* prevent redirect and do ajax upload */
    e.preventDefault();
 
    /*
     * functions to handle the success/failure of the vocab upload - 
     * they simply update the UI accordingly */
     var onSuccessHandler = function (responseText){
      console.log(responseText);
      $('.cms-vocab-input').addClass('cms-vocab-uploaded');
    };

    var onErrorHandler = function (responseText){
      console.log(responseText);
      $('.cms-vocab-input').addClass('cms-upload-label-error');
    };

    /* now let's do our AJAX request, and upload the vocab */
    cms.ajax.create('POST', cms.config.api.upload);
    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
    cms.ajax.send(formData);
  },

  // ### getFormVocab()
  // Get the contents of the Vocab Editor form, and convert it to a vocab file 
  // (in the form of a string, which can be converted to a JSON object later).
  getFormVocab: function() {
    var vocabString = '{ ',
        prevSection;

    /* for each form field */
    $('.cms-vocab-input').each(function getVocabValue(){
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

      /* Build a string of JSON:
       * 
       * Here is where we create our vocab file, as a string, after
       * having gotten the values needed from the Vocab Editor form.
       */
      
      /* if starting a new section, start a new array */
      if (section != prevSection) vocabString += '"' + section + '" : [ ';
      /* add key value obj pairs into the array */
      vocabString += '{ "' + key + '": ' + JSON.stringify(value) + ' }';
      /* if next item is button, we are at last item in last group */
      if(nextItem[0].tagName == 'BUTTON'){
        /* end last array */
        vocabString += ' ] ';
      /* else next item is not button */
      } else {
        /* if not last item in section, and section is not none */
        if (section != nextSection) {
          /* and array */
          vocabString += ' ], ';
        }
      }
      /* if we are not at the last item, add a comma */
      if (section == nextSection) vocabString += ', ';

      /* prepare next loop */
      prevSection = section;
    });
    vocabString +='}';
    return vocabString;
   },

  // ### createVocabFile()
  // Create a vocab file from a JSON object
  createVocabFile: function (vocabJSON) {
    return new Blob([vocabJSON], {type: 'text/plain'});
  },

  // ### getVocabAsJSON()
  getVocabAsJSON: function (vocab) {
    return JSON.stringify(vocab, undefined, 2);
  },
    
  // ### downloadVocabAsFile()
  // Takes JSON as the file contents, and a file name, and 
  // forces the browser to offer the file as a download.
  //  
  // @param `vocabJSON` - the JSON to put into the file   
  // @param `filename` - the filename to use for the file created  
  downloadVocabAsFile: function (vocabJSON, filename) {
    /* http://stackoverflow.com/a/18197511 */
    var a = document.createElement('a');
    var file = self.createVocabFile(vocabJSON);
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
  },

  // ### getQueryVariable(0
  // Gets variable values from a query string
  //  
  // @param `variable` - the var to get the value of
  getQueryVariable: function (variable) {
    /* https://css-tricks.com/snippets/javascript/get-url-variables/ */
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){return pair[1];}
    }
    return(false);
  },

  // ### translatePage()
  // Translates `preview.html`, using the vocab file for the current 
  // language, then sends the new, translated HTML to the CMS export 
  // module, to be saved as `index.LANG.html`.
  translatePage: function(){
    
    /* define our vars */
    var tmpHtml = '',
        html = '',
        $html = '',
        editableItemSelector='',
        metaSelector = 'meta[name^="title"], meta[name^="description"], meta[name^="author"], meta[name^="keywords"], meta[name^="news_keywords"], meta[name^="copyright"], meta[name^="twitter"], meta[property], meta[itemprop]';

    /* create a holder for our HTML */
    tmpHtml = document.createElement('HTML');

    /*
     * Get the HTML of `preview.html`, then translate that HTML 
     */
     self.getPreviewPageHtml(function translateHtml(html){
      
      /* we have the preview page HTML now, so lets assign it 
       * to the tmp HTML we created earlier */
      tmpHtml.innerHTML = html;
      $html = $(tmpHtml);

      /* if 'vocabs/[lang].json exists, add contents of vocab file to $html, then run saveTranslatedHMTL */
      self.getVocabFileContents(function updateHtmlUsingVocab(vocab){
        
        /* get html of preview page (in the iframe) */
        var vocab = JSON.parse(vocab),
            index = '';

        /* replace meta items */
        $html.find(metaSelector).each(function(el, i){
          el.content = Object.values(vocab['meta'][i])[0];
          /* console.log(Object.values(vocab['meta'][i])[0]); */
          index = i;
        });

        /* update <title> tag as well */
        $html.find('title').html(vocab.meta[0].title);

        /* get editable items selector as a string */
        cms.config.editableItems.forEach(function (el) {
          editableItemSelector += el + ',';
        });
        editableItemSelector = editableItemSelector.slice(0, -1); /* remove trailing comma */

        var sectionIndex =1;
        
        /* 
         * Begin translating the HTML - replace editables with values 
         * from vocab file */
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

              /* count each elem type, so we can reference the right ones in the vocab */
              count[tag]++;
              /* if tag not same as last, either set to zero if first time, or increment */
              if (prevTag != tag) {
                count[tag] = count[tag]++ || 0;
              }
              /* set to a var, so we can include in elemToUpdate */
              elemCount = count[tag];

              /* get the elem to update .. we will replace its values with values from vocab */
              /* find the elem using its details from vocab (section name, tag type, index) */
              elemToUpdate = $html.find('.'+sectionName).find(tag)[elemCount];

              /* console.log(sectionName, tag, elemCount, count[tag], value, elemToUpdate); */

              /* if we got an elem to update */
              if (elemToUpdate) {
                /* get the tag type and update the correct attribute */
                if (tag == 'img'     && elemToUpdate.src)    elemToUpdate.src    = Object.values(vocabItem)[0];
                if (tag == 'source'  && elemToUpdate.srcset) elemToUpdate.srcset = Object.values(vocabItem)[0];
                if (tag !== 'source' && tag !== 'source' &&  elemToUpdate.innerHTML) elemToUpdate.innerHTML = Object.values(vocabItem)[0];
              }

              /* get ready for next loop */
              prevTag = tag;

            });
            sectionIndex++;
          }

        });

        /* We now have $html - which contains our translated HTML.
         * So let's update the meta and CSS to match LANG
         */

        /* get lang details for current translation LANG */
        var lang     = self.getCurrentService(),
            langInfo = cms.getLangInfo(lang);

        langInfo.code = lang;

        /* workaround for chrome contenteditable bug */
        $html.find('*').removeAttr('style');

        /* remove from page all of the lang info that will be replaced */
        $html.find('html, body').removeClass('en');
        $html.find('html, body').removeAttr('dir');
        $html.find('html, body').removeClass('rtl');

        /* now add the correct values for lang to page */
        if (langInfo.direction === 'rtl') {
          $html.find('html, body').attr('dir', langInfo.direction);
          $html.find('html, body').addClass(langInfo.direction);
        }

        /* get the HTML as a string */
        html = $html.html();
        
        /* 
         * Finally, send to export managaer, which wil save as 
         * index.[lang].html, then preview it using preview manager
         */
        cms.exportManager.saveTranslatedHTML(html);
      });

    });

  }

//  
// End of module
};
