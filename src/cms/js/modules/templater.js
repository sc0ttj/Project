var $  = require('cash-dom');
var m  = require('mustache');
// console.log($)

"use strict";

module.exports = {
  init: function(config){
    this.setConfig(config);
    
    var sections = this.getSections();

    sections.each(this.numberTheSections);

    return true // if we loaded ok
  },

  getConfig: function (){
    return this.config;
  },

  setConfig: function (config){
    this.config = config || this.config;
  },

  getSections: function(){
    return $(this.config.sectionSelector);
  },

  numberTheSections: function(elem, i){
    $(elem).addClass('section' + (i+1));
    $(elem).attr('id', 'section'+(i+1));
  },

  renderTemplate: function(template, data){
    m.parse(template); // caching
    return m.render(template, data);
  },
}