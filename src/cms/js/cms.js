"use strict";

var cms = {

  templater: require('modules/templater'),

  init: function() {
    console.log('cms js initialised');
    $('body').addClass('with-js');
    // Do JSON + template HTML = output HTML
    this.setTemplateExample('#template1');
    this.setTemplateFromFileExample('#template2', "article-left");
    this.setTemplateFrominlineScriptExample('#template3', "article-left");
    this.setTemplateFromHtmlImportsExample('#template4', "article-left");
  },

  // Example methods below

  setTemplateExample: function (elem){
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

  setTemplateFromFileExample: function(elem, templateName){
    var self = this;
    var container = document.querySelector(elem);
    var data = this.templater.getJsonFile(templateName, function (txt){
      var json = JSON.parse(txt);
      self.templater.render(container, json);
    });
  },

  setTemplateFrominlineScriptExample: function(elem, templateName){
    var self = this;
    var container = document.querySelector(elem);
    var tmpl = document.getElementById(templateName + '-tmpl-script').innerHTML;

    var wrapper = document.createElement('div');
    wrapper.innerHTML = tmpl;

    container.appendChild(wrapper);
    var data = this.templater.getJsonFile(templateName, function (txt){
      var json = JSON.parse(txt);
      self.templater.render(container, json);
    });
  },

  //https://www.html5rocks.com/en/tutorials/webcomponents/imports/
  //http://www.hongkiat.com/blog/html-import/
  setTemplateFromHtmlImportsExample: function(elem, templateName){
    var self = this;
    var container = document.querySelector(elem);
    var tmplFile = this.getTmplFromHMTLImport(templateName);
    container.appendChild(tmplFile);
    var data = this.templater.getJsonFile(templateName, function (txt){
      var json = JSON.parse(txt);
      self.templater.render(container, json);
    });
  },

  // helpers

  getTmplFromHMTLImport: function (templateName) {
    var self = this;
    if (!self.hasHTMLImports()) {
      console.log('html imports will NOT work');
      // Use other libraries/require systems to load files.
      return false;
    }
    var templateLink = document.querySelector('#' + templateName + '-tmpl');
    var tmpl = templateLink.import.querySelector('.' + templateName + '-tmpl');
    return tmpl;
  },

  hasHTMLImports: function(){
    return 'import' in document.createElement('link');
  },

};

module.exports = cms;