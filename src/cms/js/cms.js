var $ = require('cash-dom');

"use strict";

module.exports = {

  templater: '',

  init: function() {
    console.log('cms loaded');
    
    // cut the mustard here
    $('body').addClass('with-cms');

    // this.doExampleTemplating();
  },

  doExampleTemplating: function () {
    this.setupTemplater();
    // needs markup in page
    this.setTemplate('#container1', 'article-left');
    // gets markup from external .tmpl file
    this.setTemplateFromFile('#container2', 'article-left');
  },

  setupTemplater: function (){
    this.templater = require('modules/templater');
    this.templater.init();
  },

  getTemplate: function (template) {
    var data = require('templates/' + template);
    return data;
  },

  setTemplate: function (elem, template){
    var container = document.querySelector(elem);
    var data = this.getTemplate(template);
    this.templater.render(container, data);
  },

  getTemplateMarkup: function (template, callback){
    this.templater.getTmplFile(template, function(html){
      callback(template, html);
    }); 
  },

  setTemplateFromFile: function (elem, template){
    var self = this;
    this.getTemplateMarkup(template, function(template, html){
      self.setContainer(elem, html);
      self.setTemplate(elem, template);
    });
  },

  setContainer: function (elem, html) {
    var container = document.querySelector(elem);
    var wrapper = document.createElement('div');
    wrapper.id = container.id;
    container.id = '';
    wrapper.innerHTML = html;
    container.appendChild(wrapper);
  },

};