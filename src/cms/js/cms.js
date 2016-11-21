"use strict";

var cms = {

  templater: require('modules/templater'),

  init: function() {
    console.log('cms js initialised');
    $('body').addClass('with-js');
    // Do JSON + template HTML = output HTML
    this.example();
    this.fromFileExample();
    this.htmlImportsExample();
  },

  // Example methods below

  example: function (){
    var elem1 = document.querySelector('#template1');
    var data1 = {
      header: 'New Header Added by CMS',
      paras: [
        {para: 'We used a var containing JSON.' },
        {para: 'Lorem ipsumthing dolor sit about.' },
        {para: 'Double lorem ipsumthing dolor sit.'}
      ]
    };
    this.templater.setOnElem(elem1, data1);
  },

  fromFileExample: function(){
    var self = this;
    var elem2 = document.querySelector('#template2');
    var data2 = this.templater.getJsonFile("article-left", function (txt){
      var data = JSON.parse(txt);
      self.templater.setOnElem(elem2, data);
    });
  },

  //https://www.html5rocks.com/en/tutorials/webcomponents/imports/
  //http://www.hongkiat.com/blog/html-import/
  htmlImportsExample: function(){
    var self = this;
    var elem3 = document.querySelector('#template3');
    var tmplFile = this.getTmplFromHMTLImport();
    elem3.appendChild(tmplFile);
    var json = this.templater.getJsonFile("article-left", function (txt){
      var data = JSON.parse(txt);
      self.templater.setOnElem(elem3, data);
    });
  },

  hasHTMLImports: function(){
    return 'import' in document.createElement('link');
  },

  // setHtmlImports: function (){
  //   var link = document.createElement('link');
  //   link.id = 'article-left-tmpl';
  //   link.rel = 'import';
  //   link.href = '/cms/templates/layouts/article-left.tmpl';
  //   document.head.appendChild(link);
  // },

  getTmplFromHMTLImport: function () {
    var self = this;
    if (!self.hasHTMLImports()) {
      console.log('html imports will NOT work');
      // Use other libraries/require systems to load files.
      return false;
    }
    // this.setHtmlImports();
    var templateUrl = document.querySelector('#article-left-tmpl');
    var tmpl = templateUrl.import.querySelector('.article-left-tmpl');
    return tmpl;
  },


  // TO DO

  editPageText: function (){
    return true;
  },

  saveAsNewPage: function(){
    return true;
  }


};

module.exports = cms;