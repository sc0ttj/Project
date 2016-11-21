"use strict";

var cms = {

  templater: require('modules/templater'),

  init: function() {
    
    // cut the mustard here

    console.log('cms js initialised');
    $('body').addClass('with-js');

    // get markup already in page and add json
    this.setTemplate_Example('#container1');
    this.setTemplateFromFile_Example('#container2', 'article-left');
    // get both markup and json from elsewhere and add both to page
    this.setTemplateFromString_Example('#container3', 'article-left');
    this.setTemplateFromTmpFile_Example('#container4', 'article-left');
    this.setTemplateFromHtmlImports_Example('#container5', 'article-left');
  },

  // Example methods below need template markup in the page already

  setTemplate_Example: function (elem){
    var container = document.querySelector(elem);
    var data = {
      header: 'New Header Added by CMS',
      paras: [
        {para: 'We used a var containing JSON.' },
        {para: 'Lorem ipsumthing dolor sit about.' }
      ]
    };
    this.templater.render(container, data);
  },

  setTemplateFromFile_Example: function(elem, tmplName){
    var container = document.querySelector(elem);
    this.applyJsonToTmpl(tmplName, container);
  },

  // the example methods do not need template markup in the page

  setTemplateFromString_Example: function(elem, tmplName){
    var html = this.getTmplFromString(tmplName);
    var container = this.setContainer(elem, html);
    this.applyJsonToTmpl(tmplName, container);
  },

  setTemplateFromTmpFile_Example: function(elem, tmplName){
    var self = this;
    this.getTmplFile(tmplName, function(html){
      var container = self.setContainer(elem, html);
      self.applyJsonToTmpl(tmplName, container);
    }); 
  },

  //https://www.html5rocks.com/en/tutorials/webcomponents/imports/
  //http://www.hongkiat.com/blog/html-import/
  setTemplateFromHtmlImports_Example: function(elem, tmplName){
    var container = document.querySelector(elem);
    var tmpl = this.getTmplFromHMTLImport(tmplName);
    container.appendChild(tmpl);
    this.applyJsonToTmpl(tmplName, container);
  },

  // helpers

  setContainer: function (elem, contents) {
    var container = document.querySelector(elem);
    var wrapper = document.createElement('div');
    wrapper.innerHTML = contents;
    container.appendChild(wrapper);
    return container;
  },

  getTmplFromString: function (tmplName) {
    var html = '';
    switch(tmplName){
      case 'article-left':
        html = '<div class="' + tmplName + '-tmpl-div"><h1 class="header"></h1><div class="paras"><p class="para"></p></div></div>';
        break;
    }
    return html;
  },

  getTmplFile: function (tmplName, callback) {
    this.templater.getTmplFile(tmplName, function(html){
      callback(html);
    });
  },

  getTmplFromHMTLImport: function (tmplName) {
    if (!this.hasHTMLImports()) {
      console.log('html imports will NOT work');
      // Use other libraries/require systems to load files.
      return false;
    }
    var templateLink = document.querySelector('#' + tmplName + '-tmpl');
    var tmpl = templateLink.import.querySelector('.' + tmplName + '-tmpl');
    return tmpl;
  },

  applyJsonToTmpl: function (tmplName, container){
    var self = this;
    this.templater.getJsonFile(tmplName, function (txt){
      var json = JSON.parse(txt);
      self.templater.render(container, json);
      console.log('rendering: ', container, json);
    });
  },

  hasHTMLImports: function(){
    return 'import' in document.createElement('link');
  },

};

module.exports = cms;