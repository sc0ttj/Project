var $ = require('cash-dom');
// console.log($)

"use strict";

module.exports = {
  init: function(config){
    this.setConfig(config);
    
    if (this.pageHasNoSections()) this.createSections();
    
    return true // if we loaded ok
  },

  getConfig: function (){
    return this.config;
  },

  setConfig: function (config){
    this.config = config || this.config;
  },

  pageHasNoSections: function(){
    if (this.getSections.length < 1) return true;
  },

  getSections: function(){
    return $(this.config.sectionSelector);
  },

  createSections: function (){
    var self = this;
    function addSectionToPage(){
      $('body').prepend(self.config.sectionContainer);
    }
    function numberTheSections(elem, i){
      $(elem).addClass('section' + (i+1));
    }
    this.config.templates.forEach(addSectionToPage);
    var sections = this.getSections();
    sections.each(numberTheSections);
    return sections;
  },

  getTemplates: function(){
    return this.config.templates;
  },

  processTemplates: function (templates, templateProcessor){
    var sections = $(this.config.sectionSelector);
    for (var i=0; i<templates.length; i++){
      var url = this.config.templatesDir + templates[i];
      this.getTemplateFromUrl(url, templateProcessor, sections[i]);
    }
  },

  getTemplateFromUrl: function(templateUrl, templateProcessor, container){
    var opts = {url:templateUrl};
    function ajaxResponder(respCode, html, xmlhttp){
      if (respCode === 200) templateProcessor(html, container, templateUrl);
    }
    ajax.ajax(opts, ajaxResponder);
  },

  renderTemplate: function(templateHtml, container, templateUrl){
    $(container).html(templateHtml);
    var templateHasJs = (templateHtml.indexOf('<!-- js -->')> -1);

    if (templateHasJs) {
      var templateScript = templateUrl.substr(0, templateUrl.lastIndexOf(".")) + ".js";
      var script  = document.createElement('script');
      script.type = 'text/javascript'; 
      script.src  = templateScript;
      $('body').append(script);
    }
  },

}