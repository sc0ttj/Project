"use strict";

var cms = {

  templater: require('modules/templater'),

  init: function() {
    console.log('cms js initialised');
    $('body').addClass('with-js');
    // Do JSON + template HTML = output HTML
    this.applyTemplateExample();
    this.applyTemplateFromFileExample();
  },

  // Example methods below

  applyTemplateExample: function (){
    var elem1 = "template1";
    var data1 = {
      header: 'New Header Added by CMS',
      paras: [
        {para: 'We used a var containing JSON.' },
        {para: 'Lorem ipsumthing dolor sit about.' },
        {para: 'Double lorem ipsumthing dolor sit.'}
      ]
    };
    this.templater.setTemplateOnElem(elem1, data1);
  },

  applyTemplateFromFileExample: function(){
    var self = this;
    var elem2 = 'template2';
    var data2 = this.templater.getTemplateFromJsonFile("article-left", function (txt){
      var data = JSON.parse(txt);
      self.templater.setTemplateOnElem(elem2, data);
    });
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