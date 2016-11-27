var $ = require('cash-dom');

"use strict";

module.exports = {
  init: function(config){
    this.setConfig(config);

    this.addUI();

    this.startEvents();
    
    return true // if we loaded ok
  },

  startEvents: function(){
    function clickHandler(e){
      console.log(e);
    }
    $('.cms-ui-btn').on('click', clickHandler);
  },

  addUI: function(){
    var uiHtml = '<button class="cms-ui-btn cms-txt-unselectable clear">☰</button>';
    $('body').prepend(uiHtml);
  },

//

  getConfig: function (){
    return this.config;
  },

  setConfig: function (config){
    this.config = config || this.config;
  },
}