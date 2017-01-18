var $ = require('cash-dom');
var self;

"use strict";

module.exports = {
  init: function(){
    self = this;
    self.addUI();
    return true // if we loaded ok
  },

  addUI: function(){
    var menu     = this.getMenuHtml(),
        menuBtn  = '<button class="cms-menu-btn cms-unselectable clear">☰</button>';

    $('body').append(menu);
    $('body').append(menuBtn);

    self.$menu         = $('.cms-menu');
    self.$menuBg       = $('.cms-menu-bg');
    self.$menuBtn      = $('.cms-menu-btn');
    self.$menuItems    = $('.cms-menu-item'),
    self.$menuItemUp   = $('.cms-menu-item-icon-up');
    self.$menuItemDown = $('.cms-menu-item-icon-down');
    self.$menuItemDelete = $('.cms-menu-item-icon-delete');

    self.$menuBg.on('click', self.menuBgClickHandler);
    self.$menuBtn.on('click', self.menuBtnClickHandler);
    self.$menuItemUp.on('click', self.menuItemUpClickHandler);
    self.$menuItemDown.on('click', self.menuItemDownClickHandler);
    self.$menuItemDelete.on('click', self.menuItemDeleteClickHandler);

    self.$menuBtnSave = $('.cms-menu-item-save');
    self.$menuBtnSave.on('click', self.menuBtnSaveClickHandler);

    self.$menuBtnAddSection = $('.cms-menu-item-add-section');
    self.$menuBtnAddSection.on('click', self.menuBtnAddSectionClickHandler);

  }, 

  getMenuHtml: function () {
    var $sections = self.getSections(),
        menu = '\
        <div class="cms-menu-bg cms-anim-fade-250ms hidden"></div>\
        <ul class="cms-menu cms-anim-fade-250ms hidden">';

    menu += '<li class="cms-menu-top"></li>';
    menu += '\
    <li \
      class="cms-menu-item cms-menu-item-save">\
      <span class="cms-menu-item-text">Save</span>\
      <span class="cms-menu-item-icon cms-menu-item-icon-save cms-anim-fade-250ms cms-unselectable">💾</span>\
    </li>\
    <li id="menu-header-sections" class="cms-menu-header cms-menu-header-sections">\
      <span class="cms-menu-item-text">Sections:</span>\
    </li>\
    <li id="menu-item-add-section" class="cms-menu-header cms-menu-item-add-section cms-unselectable">\
      Add Section +\
    </li>';
    $sections.each(function addMenuItem(elem, i){
      var sectionName = $sections.children()[i].getAttribute('data-name') || 'section'+(i+1);
      menu += '\
      <li \
        id="menu-item-'+(i+1)+'" \
        class="cms-menu-item cms-menu-section-item">\
        <span class="cms-menu-item-text"><a href="#section'+(i+1)+'">'+sectionName+'</a></span>\
        <span class="cms-menu-item-icon  cms-menu-item-icon-up      cms-anim-fade-250ms cms-unselectable">ᐃ</span>\
        <span class="cms-menu-item-icon  cms-menu-item-icon-down    cms-anim-fade-250ms cms-unselectable">ᐁ</span>\
        <span class="cms-menu-item-icon  cms-menu-item-icon-delete  cms-anim-fade-250ms cms-unselectable">ⅹ</span>\
      </li>';
    });
    menu += '</ul>';
    
    return menu;
  },

  getSections: function () {
    var sections = $(cms.config.sectionSelector);
    return sections;
  },

  menuBgClickHandler: function (e) {
    self.hideMenu();
  },

  menuBtnClickHandler: function (e) {
    self.toggleMenu();
  },

  menuItemUpClickHandler: function (e) {
    var $this = $(this.parentNode),
        $prev = $($this).prev(),
        index = $this.attr('id').replace('menu-item-', '');

    if ($this.attr('id') !== 'menu-item-1'){
      $this.after($prev);
      self.reIndexMenuItems();  
      cms.editor.moveSectionUp(index);
      cms.editor.reIndexSections();
    }
  },

  menuItemDownClickHandler: function (e) {
    var $this = $(this.parentNode),
        $next = $($this).next(),
        index = $this.attr('id').replace('menu-item-', '');

    $next.after($this);
    self.reIndexMenuItems();
    cms.editor.moveSectionDown(index);
    cms.editor.reIndexSections();
  },

  menuItemDeleteClickHandler: function (e) {
    var $this = $(this.parentNode),
        index = $this.attr('id').replace('menu-item-', '');

    $this.remove();
    self.reIndexMenuItems();
    cms.editor.removeSection(index);
    cms.editor.reIndexSections();
  },

  menuBtnSaveClickHandler: function (e) {
    cms.savePage();
  },

  menuBtnAddSectionClickHandler: function (e) {
    cms.sectionEditor.showUI();
    self.hideMenu();
  },

  reIndexMenuItems: function (){
    $('.cms-menu-section-item').each(function(elem, i){
      $(elem).attr('id', 'menu-item-'+(i+1));
      $(elem).find('a').attr('href', '#section'+(i+1));
    });
  },

  toggleMenu: function(){
    if (self.$menu.hasClass('hidden')){
      self.showMenu();
    } else {
      self.hideMenu();
    }
  },

  showMenu: function(){
    var $sections = self.getSections();
    
    self.$menu.remove();
    self.$menuBg.remove();
    self.$menuBtn.remove();
    self.addUI();

    $('body').css('overflow', 'hidden');
    $sections.css('pointer-events', 'none');
    self.$menu.removeClass('hidden');
    self.$menuBg.removeClass('hidden');
    self.$menuBtn.addClass('cms-menu-btn-on');
  },

  hideMenu: function(){
    var $sections = self.getSections();
    $('body').css('overflow', 'auto');
    $sections.css('pointer-events', 'all');
    self.$menu.addClass('hidden');
    self.$menuBg.addClass('hidden');
    self.$menuBtn.removeClass('cms-menu-btn-on');
  },
}