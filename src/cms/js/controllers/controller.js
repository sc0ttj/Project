module.exports = {

  view: require('../views/view.js'),

  init: function() {
    console.log('controller initialised by cms');
    this.setEvents();
    this.view.init();
  },
  
  setEvents: function(){
    this.makeHeaderClickable();
  },

  makeHeaderClickable: function() {
    this.view.clickOn('h2');
  }

};