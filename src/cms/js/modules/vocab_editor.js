var $ = require('cash-dom');
var self;

"use strict";

module.exports = {
  init: function(){
    self = cms.vocabEditor;

    if (self.shouldShowTranslator()) self.getPreviewPageHtml(self.getVocabFromPreview);

    return true // if we loaded ok
  },

  shouldShowTranslator: function () {
    var lang      = self.getCurrentService(),
        langInfo  = app.getLangInfo(lang),
        validLang = (self.getQueryVariable('translate') && langInfo.code != 'undefined');

    if (validLang) return true;
    return false;
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

  getVocabFromPreview: function (html){
    // create an empty vocab file and get html to build it from
    var lang      = self.getCurrentService(),
        pageVocab = self.createNewVocab(lang),
        $html     = $(html),
        sectionSelector    = cms.config.sectionSelector,
        metaSelector       = 'meta[name^="title"], meta[name^="description"], meta[name^="author"], meta[name^="keywords"], meta[name^="news_keywords"], meta[name^="copyright"], meta[name^="twitter"], meta[property], meta[itemprop]',
        vocabElemsSelector = 'h1, h2, p, li, video source, picture source, img',
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
                  value = pageElem.innerText || $(pageElem).attr('src')  || $(pageElem).attr('srcset') || pageElem.innerHMTL,
                  vocabItem  = {};

              // add the item to the vocab object
              vocabItem[key] = value.trim();
              pageVocab[sectionName].push(vocabItem);
            });

          });
          i++; // increment section name
        } // end if isSection

      } // end if !== TEXT_NODE

    }); //end $html.each()

    // we now have the latest preview page as a vocab file, will show in left side of form
    self.pageVocab = pageVocab;

    // we now have the default text to translate, so we can get a translation for it

    // lets populate the right side of form with the contents of the vocab file for this LANG
    self.getVocabFileContents(function vocabReturnedOK(vocab){
      self.vocab = JSON.parse(vocab);
      self.showTranslatorUI();
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

  showTranslatorUI: function () {
    var lang      = self.getCurrentService(),
        langInfo  = app.getLangInfo(lang),
        form      = self.createVocabEditorForm();

    // load modal
    cms.modal.create({
      title: 'Translation Manager - '+langInfo.name,
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
      cms.translatePage();
    });

    // back button, top left
    $('.cms-modal-back-btn').on('click', function(e){
      e.preventDefault();
      cms.translatePage();
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

}