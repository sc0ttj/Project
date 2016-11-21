"use strict";

var cms = {

  templater: require('modules/templater'),

  init: function() {
    console.log('cms js initialised');
    $('body').addClass('with-js');
    // Do JSON + template HTML = output HTML
    this.setTemplate_Example('#container1');
    this.setTemplateFromFile_Example('#container2', "article-left");
    this.setTemplateFrominlineScript_Example('#container3', "article-left");
    this.setTemplateFromHtmlImports_Example('#container4', "article-left");
  },

  // Example methods below

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
    var self = this;
    var container = document.querySelector(elem);
    var data = this.templater.getJsonFile(tmplName, function (txt){
      var json = JSON.parse(txt);
      self.templater.render(container, json);
    });
  },

  setTemplateFrominlineScript_Example: function(elem, tmplName){
    this.addInlineTemplateToPage(tmplName);
    var self = this;
    var container = document.querySelector(elem);
    var tmpl = document.getElementById(tmplName + '-script').innerHTML;
    var wrapper = document.createElement('div');
    wrapper.innerHTML = tmpl;
    container.appendChild(wrapper);
    var data = this.templater.getJsonFile(tmplName, function (txt){
      var json = JSON.parse(txt);
      self.templater.render(container, json);
    });
  },

  //https://www.html5rocks.com/en/tutorials/webcomponents/imports/
  //http://www.hongkiat.com/blog/html-import/
  setTemplateFromHtmlImports_Example: function(elem, tmplName){
    var self = this;
    var container = document.querySelector(elem);
    var tmplFile = this.getTmplFromHMTLImport(tmplName);
    container.appendChild(tmplFile);
    var data = this.templater.getJsonFile(tmplName, function (txt){
      var json = JSON.parse(txt);
      self.templater.render(container, json);
    });
  },

  // helpers

  getTemplateHtmlString: function (tmplName) {
    var html = '';
    switch(tmplName){
      case 'article-left':
        html = '<div class="' + tmplName + '-tmpl-div"><h1 class="header"></h1><div class="paras"><p class="para"></p></div></div>';
        break;
    }
    return html;
  },

  addInlineTemplateToPage: function(tmplName){
    var html = this.getTemplateHtmlString(tmplName);
    var script = document.createElement("script");
    script.id = tmplName + '-script';
    script.type = "text/tmpl"
    script.innerHTML = html;
    document.body.appendChild(script);
  },

  getTmplFromHMTLImport: function (tmplName) {
    var self = this;
    if (!self.hasHTMLImports()) {
      console.log('html imports will NOT work');
      // Use other libraries/require systems to load files.
      return false;
    }
    var templateLink = document.querySelector('#' + tmplName + '-tmpl');
    var tmpl = templateLink.import.querySelector('.' + tmplName + '-tmpl');
    return tmpl;
  },

  hasHTMLImports: function(){
    return 'import' in document.createElement('link');
  },

};

module.exports = cms;