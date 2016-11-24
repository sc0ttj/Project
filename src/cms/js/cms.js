var $ = require('cash-dom');

"use strict";

module.exports = {

  config: { "name": "default opts" },

  getConfig: function (){
    return this.config;
  },

  setConfig: function (config){
    this.config = config || this.config;
  },

  init: function(config){

    this.setConfig(config); 
    console.log('cms_config:', this.config.name);    

    // cut the mustard here
    $('body').addClass('with-cms');

    t = require('modules/templater');
    var config = {'name': 'custom_templater_options'};
    t.init(config);

  },

};