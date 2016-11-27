var foo = true;
if (foo){
  var m  = require('mustache');
  var db = require('modules/data');
  var $  = require('cash-dom');
}

module.exports = {

  config: { "name": "def template opts" },

  getConfig: function (){
    return this.config;
  },

  setConfig: function (config){
    if (config){
      this.config = config || this.config;
    }
  },

  init: function(config){

    this.setConfig(config); 
    console.log('templater_config:', this.config.name);

    //example 
    var page = db.get('page');

    // do hero template
    var template = this.getTemplate("#hero-center-template");
    var target = $("#target1");
    var data = db.get('hero-center');
    // this.renderTemplate(template, target, data);
    // update page data
    page.title = data.title;
    page.section1 = data;


    // do article template
    var template = this.getTemplate("#article-center-template");
    var target = $("#target2");
    var data = db.get('article-center');
    // this.renderTemplate(template, target, data);
    // update page data again
    page.section2 = data;


    console.log('page:', page);
    console.log('page title:', page.title);
    console.log('article heading:', page.section2.heading);
  },

  getTemplate: function(template){
    //get from dom for now
    return $(template).html();
  },

  renderTemplate: function(template, target, data){
    
    m.parse(template); // caching
    var rendered = m.render(template, data);
    $(target).html(rendered);
  }

};
