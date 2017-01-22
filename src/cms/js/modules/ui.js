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

    $('body').append('<div class="cms-menu-container">' + menu + '</div>');
    $('body').append(menuBtn);

    self.getUIComponents();
    self.setUIEventHandlers();
  },

  getUIComponents: function () {
    self.$menu         = $('.cms-menu');
    self.$menuBg       = $('.cms-menu-bg');
    self.$menuBtn      = $('.cms-menu-btn');
    self.$menuItems    = $('.cms-menu-item'),
    self.$menuItemUp   = $('.cms-menu-item-icon-up');
    self.$menuItemDown = $('.cms-menu-item-icon-down');
    self.$menuItemDelete = $('.cms-menu-item-icon-delete');
    self.$menuBtnSave = $('.cms-menu-item-save');
    self.$menuBtnPreview = $('.cms-menu-item-preview');
    self.$menuBtnAddSection = $('.cms-menu-item-add-section');
  },

  setUIEventHandlers: function () {
    self.$menuBg.on('click', self.menuBgClickHandler);
    self.$menuBtn.on('click', self.menuBtnClickHandler);
    self.$menuItemUp.on('click', self.menuItemUpClickHandler);
    self.$menuItemDown.on('click', self.menuItemDownClickHandler);
    self.$menuItemDelete.on('click', self.menuItemDeleteClickHandler);
    self.$menuBtnPreview.on('click', self.menuBtnPreviewClickHandler);
    self.$menuBtnSave.on('click', self.menuBtnSaveClickHandler);
    self.$menuBtnAddSection.on('click', self.menuBtnAddSectionClickHandler);
  },

  setUIEventHandlersOff: function () {
    self.$menuBg.off('click', self.menuBgClickHandler);
    self.$menuBtn.off('click', self.menuBtnClickHandler);
    self.$menuItemUp.off('click', self.menuItemUpClickHandler);
    self.$menuItemDown.off('click', self.menuItemDownClickHandler);
    self.$menuItemDelete.off('click', self.menuItemDeleteClickHandler);
    self.$menuBtnPreview.off('click', self.menuBtnPreviewClickHandler);
    self.$menuBtnSave.off('click', self.menuBtnSaveClickHandler);
    self.$menuBtnAddSection.off('click', self.menuBtnAddSectionClickHandler);
  },

  getMenuHtml: function () {
    var menu = '\
        <div class="cms-menu-bg cms-anim-fade-250ms cms-ui-hidden"></div>\
        <ul class="cms-menu cms-anim-fade-250ms cms-ui-hidden">\
        <li class="cms-menu-top"></li>\
        <li \
          class="cms-menu-item cms-menu-item-preview">\
          <span class="cms-menu-item-text">Preview</span>\
          <span class="cms-menu-item-icon cms-menu-item-icon-preview cms-anim-fade-250ms cms-unselectable">👁</span>\
        </li>\
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

    menu += self.getSectionsAsMenuItems();
    menu += '</ul>';
    
    return menu;
  },

  getSectionsAsMenuItems: function () {
    var menuItems = '',
    $sections = self.getSections();

    $sections.each(function addSectionToMenu(elem, i){
      var sectionName = $sections.children()[i].getAttribute('data-name') || 'section'+(i+1);
      menuItems += '\
      <li \
        id="menu-item-'+(i+1)+'" \
        class="cms-menu-item cms-menu-section-item">\
        <span class="cms-menu-item-text"><a href="#section'+(i+1)+'">'+sectionName+'</a></span>\
        <span class="cms-menu-item-icon  cms-menu-item-icon-up      cms-anim-fade-250ms cms-unselectable">ᐃ</span>\
        <span class="cms-menu-item-icon  cms-menu-item-icon-down    cms-anim-fade-250ms cms-unselectable">ᐁ</span>\
        <span class="cms-menu-item-icon  cms-menu-item-icon-delete  cms-anim-fade-250ms cms-unselectable">ⅹ</span>\
      </li>';
    });

    return menuItems;
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
      cms.sectionEditor.moveSectionUp(index);
      cms.sectionEditor.reIndexSections();
    }
  },

  menuItemDownClickHandler: function (e) {
    var $this = $(this.parentNode),
        $next = $($this).next(),
        index = $this.attr('id').replace('menu-item-', '');

    $next.after($this);
    self.reIndexMenuItems();
    cms.sectionEditor.moveSectionDown(index);
    cms.sectionEditor.reIndexSections();
  },

  menuItemDeleteClickHandler: function (e) {
    var $this = $(this.parentNode),
        index = $this.attr('id').replace('menu-item-', '');

    $this.remove();
    self.reIndexMenuItems();
    cms.sectionEditor.removeSection(index);
    cms.sectionEditor.reIndexSections();
  },

  menuBtnSaveClickHandler: function (e) {
    cms.savePage();
  },

  menuBtnPreviewClickHandler: function (e) {
    cms.previewPage();
  },

  menuBtnAddSectionClickHandler: function (e) {
    cms.sectionEditor.showUI();
  },

  reIndexMenuItems: function (){
    $('.cms-menu-section-item').each(function(el, i){
      var $el = $(el);
      $el.attr('id', 'menu-item-'+(i+1));
      $el.find('a').attr('href', '#section'+(i+1));
    });
  },

  toggleMenu: function(){
    if (self.$menu.hasClass('cms-ui-hidden')){
      self.showMenu();
    } else {
      self.hideMenu();
    }
  },

  showMenu: function(){
    var $sections = self.getSections();
   
    self.updateUI();
    self.$menu.removeClass('cms-ui-hidden');
    self.$menuBg.removeClass('cms-ui-hidden');
    self.$menuBtn.addClass('cms-menu-btn-on');
    $('body').css('overflow', 'cms-ui-hidden');
    $sections.css('pointer-events', 'none');
  },

  updateUI: function () {
    var menu = this.getMenuHtml();
    self.setUIEventHandlersOff();
    $('.cms-menu-container').html(menu);
    self.reIndexMenuItems();
    self.getUIComponents();
    self.setUIEventHandlers();
  },

  hideMenu: function(){
    var $sections = self.getSections();
    $('body').css('overflow', 'auto');
    $sections.css('pointer-events', 'all');
    self.$menu.addClass('cms-ui-hidden');
    self.$menuBg.addClass('cms-ui-hidden');
    self.$menuBtn.removeClass('cms-menu-btn-on');
  },
}