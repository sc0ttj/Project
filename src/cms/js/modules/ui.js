var $       = require('cash-dom');
var editor  = require('modules/inline_editor');
var ui;

"use strict";

module.exports = {
  init: function(config){
    ui = this;
    
    ui.setConfig(config);
    ui.addUI();
    editor.init(config);

    return true // if we loaded ok
  },

  addUI: function(){
    var menu     = this.getMenuHtml(),
        menuBtn  = '<button class="cms-menu-btn cms-unselectable clear">☰</button>';

    $('body').append(menu);
    $('body').append(menuBtn);

    ui.$menu      = $('.cms-menu');
    ui.$menuBg    = $('.cms-menu-bg');
    ui.$menuBtn   = $('.cms-menu-btn');
    ui.$menuItems = $('.cms-menu-item');

    ui.$menuBg.on('click', ui.menuBgClickHandler);
    ui.$menuBtn.on('click', ui.menuBtnClickHandler);
    ui.$menuItems.on('click', ui.menuItemClickHandler);
  },

  getMenuHtml: function () {
    var itemList = [],
        $sections = ui.getSections(),
        menu = '<div class="cms-menu-bg transition-fast hidden"></div><ul class="cms-menu transition-fast cms-unselectable hidden">';

    menu += '<li class="cms-menu-header">&nbsp;</li>';

    $sections.each(function addMenuItem(elem, i){
      menu += '<li data-id="'+(i+1)+'" class="cms-menu-item">section '+(i+1)+' <span class="cms-menu-item-icon">↕</span></li>';
    });

    menu += '</ul>';
    
    return menu;
  },

  getSections: function () {
    return $(ui.config.sectionSelector);
  },

  menuBgClickHandler: function (e) {
    ui.hideMenu();
  },

  menuBtnClickHandler: function (e) {
    ui.toggleMenu();
  },

  menuItemClickHandler: function (e) {
    var sectionId = $(this).data('id'),
        sectionOnPage = $('.section'+sectionId);
    console.log(sectionId, sectionOnPage);
  },

  toggleMenu: function(){
    if (ui.$menu.hasClass('hidden')){
      ui.showMenu();
    } else {
      ui.hideMenu();
    }
  },

  showMenu: function(){
    var $sections = ui.getSections();
    $('body').css('overflow', 'hidden');
    $sections.css('pointer-events', 'none');
    ui.$menu.removeClass('hidden');
    ui.$menuBg.removeClass('hidden');
    ui.$menuBtn.addClass('cms-menu-btn-on');
  },

  hideMenu: function(){
    var $sections = ui.getSections();
    $('body').css('overflow', 'auto');
    $sections.css('pointer-events', 'all');
    ui.$menu.addClass('hidden');
    ui.$menuBg.addClass('hidden');
    ui.$menuBtn.removeClass('cms-menu-btn-on');
  },

  getConfig: function (){
    return ui.config;
  },

  setConfig: function (config){
    ui.config = config || ui.config;
  },
}