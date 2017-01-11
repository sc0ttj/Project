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

    ui.$menu         = $('.cms-menu');
    ui.$menuBg       = $('.cms-menu-bg');
    ui.$menuBtn      = $('.cms-menu-btn');
    ui.$menuItems    = $('.cms-menu-item'),
    ui.$menuItemUp   = $('.cms-menu-item-icon-up');
    ui.$menuItemDown = $('.cms-menu-item-icon-down');

    ui.$menuBg.on('click', ui.menuBgClickHandler);
    ui.$menuBtn.on('click', ui.menuBtnClickHandler);

    ui.$menuItemUp.on('click', ui.menuItemUpClickHandler);
    ui.$menuItemDown.on('click', ui.menuItemDownClickHandler);
  }, 

  getMenuHtml: function () {
    var $sections = ui.getSections(),
        menu = '\
        <div class="cms-menu-bg transition-fast hidden"></div>\
        <ul class="cms-menu transition-fast hidden">';

    menu += '<li class="cms-menu-header"></li>';
    $sections.each(function addMenuItem(elem, i){
      var sectionName = $sections.children()[i].getAttribute('data-name') || 'section'+(i+1);
      menu += '\
      <li \
        id="menu-item-'+(i+1)+'" \
        class="cms-menu-item">\
        '+sectionName+'\
        <span class="cms-menu-item-icon cms-menu-item-icon-up   cms-unselectable">↑</span>\
        <span class="cms-menu-item-icon cms-menu-item-icon-down cms-unselectable">↓</span>\
      </li>';
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

  menuItemUpClickHandler: function (e) {
    var $this = $(this.parentNode),
        $prev = $($this).prev(),
        index = $this.attr('id').replace('menu-item-', '');

    if ($this.attr('id') !== 'menu-item-1'){
      $this.after($prev);
      ui.reIndexMenuItems();  
      editor.moveSectionUp(index);
      editor.reIndexSections();
    }
  },

  menuItemDownClickHandler: function (e) {
    var $this = $(this.parentNode),
        $next = $($this).next(),
        index = $this.attr('id').replace('menu-item-', '');

    $next.after($this);
    ui.reIndexMenuItems();
    editor.moveSectionDown(index);
    editor.reIndexSections();
  },

  reIndexMenuItems: function (){
    $('.cms-menu-item').each(function(elem, i){
      $(elem).attr('id', 'menu-item-'+(i+1));
    });
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