var $ = require('cash-dom');

"use strict";

module.exports = {
  init: function(config){
    this.setConfig(config);

    this.addUI();

    this.makeItemsEditable(this.config.editableItems);

    this.startEvents();
    
    return true // if we loaded ok
  },

  startEvents: function(){
    function clickHandler(e){
      console.log(this, e);
    }
    function imgClickHandler(e){
      console.log(this, e);
    }
    function editableHandler(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        if (this.nextElementSibling){
          this.nextElementSibling.focus();
        } else if (this.parentElement.nextElementSibling){
          this.parentElement.nextElementSibling.querySelector('.cms-editable').focus();
        } else {
          var nextSection = $(this).closest('.section')[0].nextElementSibling;
          if ($(nextSection).find('.cms-editable')[0]){
            $(nextSection).find('.cms-editable')[0].focus();
          }
        }
        return false;
      }
    }

    $('.cms-ui-btn').on('click', clickHandler);
    $('.cms-editable').on('keypress', editableHandler);
    $('img').on('click', imgClickHandler);

  },

  addUI: function(){
    var uiHtml = '<button class="cms-ui-btn cms-txt-unselectable clear">☰</button>';
    $('body').prepend(uiHtml);
  },

  makeItemsEditable: function(items){
    items.forEach(function makeItemEditable(el, i){
      $(el).attr('contenteditable', true);
      $(el).addClass('cms-editable');
    });

  },

//

  getConfig: function (){
    return this.config;
  },

  setConfig: function (config){
    this.config = config || this.config;
  },
}