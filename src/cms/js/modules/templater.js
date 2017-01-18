var $ = require('cash-dom');
var m = require('mustache');

"use strict";

module.exports = {
  init: function(){
    var sections = this.getSections();
    sections.each(this.numberTheSections);
    return true // if we loaded ok
  },

  getSections: function(){
    var sections = $(cms.config.sectionSelector);
    return sections;
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