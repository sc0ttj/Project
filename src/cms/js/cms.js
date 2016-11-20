"use strict";

var cms = {

  templater: require('modules/templater'),

  init: function() {
    console.log('cms js initialised');
    $('body').addClass('with-js');
    this.setLayoutInElem();
  },

  setLayoutInElem: function (){
    var data = {
      header: 'New Header',
      paras: [
        {para: 'Lorem ipsumthing dolor sit about.' },
        {para: 'Double lorem ipsumthing dolor sit.'}
      ]
    };

    var elem = $("#template");
    this.templater.setLayoutInElem(elem, data);
  }
};

module.exports = cms;