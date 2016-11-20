"use strict";

var cms = {

  init: function() {
    console.log('cms js initialised');

    var Model = require('./models/model');
    var Controller = require('./controllers/controller');

    Controller.init();

    console.log('Model:', Model.family.kids);
    console.log('Controller:', Controller);

  }
};

module.exports = cms;