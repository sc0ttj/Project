var $       = require('cash-dom');
var editor  = require('modules/inline_editor');

"use strict";

module.exports = {
  init: function(config){
    this.setConfig(config);

    this.addUI();

    editor.init(config);

    return true // if we loaded ok
  },

  addUI: function(){
    var uiHtml = '<button class="cms-ui-btn cms-txt-unselectable clear">☰</button>';
    $('body').append(uiHtml);
  },

  getConfig: function (){
    return this.config;
  },

  setConfig: function (config){
    this.config = config || this.config;
  },
}