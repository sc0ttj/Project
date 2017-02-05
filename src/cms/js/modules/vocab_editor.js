var $ = require('cash-dom');
var self;

"use strict";

module.exports = {
  init: function(){
    self = this;

    self.getVocabFromFile(function vocabReturnedOK(vocab){
      // console.log('got content from vocab file OK', vocab);
      self.vocab = JSON.parse(vocab);
      // self.downloadVocabFile();
      if(self.shouldShowTranslator()) self.showTranslatorUI();
    });

    return true // if we loaded ok
  },

  shouldShowTranslator: function () {
    if (self.getQueryVariable('translation')) return true;
    return false;
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

  showTranslatorUI: function () {
    var lang      = self.getCurrentService(),
        form      = self.createVocabEditorForm();

    // load modal
    cms.modal.create({
      title: 'Translation Manager - '+lang,
      contents: form
    });
    cms.modal.show();
    $('.cms-modal-back-btn').addClass('cms-hidden');
    self.addEventHandlers();
  },

  getCurrentService: function () {
    var service = self.getQueryVariable('translation') || $('html').attr('lang');
    return service;
  },

  createVocabEditorForm: function () {
    var lang      = self.getCurrentService(),
        form      = '<form class="cms-vocab-form" data-lang="'+lang+'" action="cms/api/upload.php" method="post">\n',
        fields    = self.createVocabEditorFormFields();

    form += fields;
    form += '<button class="cms-modal-btn">Update Translation</button>\n';
    form += '</form>\n';

    return form;
  },

  getVocabFromFile: function (callback) {
    var lang      = self.getCurrentService();

    cms.ajax.create('GET', 'vocabs/'+lang+'.json');

    var onSuccessHandler = function (responseText){
      // console.log(responseText);
      self.vocab = responseText;
      callback(responseText);
      return responseText;
    }

    var onErrorHandler = function (responseText){
      console.log(responseText);
      return false;
    }

    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
    cms.ajax.send(null);
  },

  getPageVocab: function () {
    var lang  = self.getCurrentService(),
        vocab = self.createVocab(lang),

    vocab = self.populateVocab(vocab);
    return vocab;
  },

  createVocab: function (lang) {
    var vocab = {};
    vocab['html'] = [ { 'lang': lang } ];
    vocab['meta'] = [];
    return vocab;
  },

  populateVocab: function(vocab){
    self.addMetaToVocab(vocab);
    self.addEditablesToVocab(vocab);
    return vocab;
  },

  createVocabEditorFormFields: function (){
    var lang      = self.getCurrentService(),
        pageVocab = self.getPageVocab(),
        vocab     = self.vocab,
        form      = '';

    Object.keys(pageVocab).forEach(function (key) {
      var section = pageVocab[key];
          sectionName = key;
      form += '<h3>'+key+'</h3>';
      section.forEach(function (elem, i) {
        
        var key   = Object.keys(section[i]),
            value = Object.values(section[i]),
            valFromVocabFile = pageVocab[sectionName][i][key];

        //replace page vocab value with value from vocab file!!
        if (vocab.hasOwnProperty(sectionName)){
          valFromVocabFile = vocab[sectionName][i][key];  // !!! deletions in page break ui building herre!!!
        } 

        form += '<table>\n\
        <tr>\n\
        <td>\n\
          <label class="cms-modal-title cms-vocab-title">'+key+'</label>\n\
          <textarea disabled />'+value+'</textarea>\n\
        </td>\
        <td>\n\
          <label class="cms-modal-title cms-vocab-title">&nbsp;</label>\n\
          <textarea \
            class="cms-modal-input \
            cms-vocab-input" \
            data-name="'+key+'" \
            data-lang="'+lang+'" \
            data-section="'+sectionName+'" \
            name="'+key+'" />'+valFromVocabFile+'</textarea>\n\
        </td>\n\
        </tr>\n\
        </table>\n';
      });
    });
    return form;
  },

  addMetaToVocab: function (vocab) {
    var $metaElems = $('meta[name^="title"], meta[name^="description"], meta[name^="author"], meta[name^="keywords"], meta[name^="news_keywords"], meta[name^="copyright"], meta[name^="twitter"], meta[property], meta[itemprop]');
    
    $metaElems.each(function(elem){
      var key   = $(elem).attr('itemprop') || $(elem).attr('property') || $(elem).attr('name'),
          value = $(elem).attr('content');

      var pair = {};
      pair[key] = value;

      vocab['meta'].push(pair);
    });
  },

  addEditablesToVocab: function (vocab) {
    var $sectionElems      = $(cms.config.sectionSelector),
        vocabElemsSelector = '[contenteditable]:not(.cms-editable-region):not(.cms-media-btn), video source, picture source, img';

    $sectionElems.each(function (sectionElem, sectionIndex){
      var template     = $(this).children()[0],
          section = 'section' + (sectionIndex+1);

      //create vocab obect for this section/template
      vocab[section] = [];

      $(sectionElem).find(vocabElemsSelector).each(function(elem, i){
        var $elem = $(elem).clone(),
            tag   = elem.tagName.toLowerCase(),
            value = '';
  
        $elem.find('.cms-media-btn').remove()
        //get rid of trailing whitespace
        $elem[0].innerText.trim();
        //assign clean up elem html to value
        value = $elem[0].innerText.trim() || $elem.attr('srcset') || $elem.attr('src') || '';
        
        var pair = {};
        pair[tag] = value;

        //add tags to current section of the vocab object if not empty
        vocab[section].push(pair);
      });
    });
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

  createVocabFile: function (vocabJSON) {
    return new Blob([vocabJSON], {type: 'text/plain'});
  },

  addEventHandlers: function () {
    $('.cms-vocab-input').on('keypress', function (e){
      if (e.which === 13) {
        e.preventDefault();
      }
      $(this).removeClass('cms-vocab-uploaded');
      $('.cms-vocab-input').removeClass('cms-upload-label-error');
    });

    $('.cms-vocab-input').on('blur', function(e){
      self.uploadVocab(e);
    });

    $('.cms-modal-btn').on('click', function (e) {
      e.preventDefault();
      self.uploadVocab(e);
    });
  },

  uploadVocab: function (e) {
    var lang          = self.getCurrentService(),
        vocab         = self.getFormVocab(),
        vocabFile     = self.createVocabFile(vocab),
        vocabFilename = lang+'.json';

    self.uploadFile(e, vocabFile, vocabFilename);
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

  uploadFile: function (e, file, filename){
    var formData = new FormData(this);
    formData.append('vocab', file, filename);
    //prevent redirect and do ajax upload
    e.preventDefault();
    cms.ajax.create('POST', 'cms/api/upload.php');

    var onSuccessHandler = function (responseText){
      console.log(responseText);
      $('.cms-vocab-input').addClass('cms-vocab-uploaded');
    }
    var onErrorHandler = function (responseText){
      console.log(responseText);
      $('.cms-vocab-input').addClass('cms-upload-label-error');
    }

    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);

    cms.ajax.send(formData);
  },

}