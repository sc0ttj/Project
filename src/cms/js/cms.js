"use strict";

var cms = {

  init: function() {
    console.log('cms js initialised');

    var Model = require('./models/model');
    console.log('Model:', Model.family.kids);

    var Controller = require('./controllers/controller');
    Controller.init();

  }
};

module.exports = cms;