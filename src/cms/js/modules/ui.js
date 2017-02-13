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
    self.$menuBtnMeta = $('.cms-menu-item-meta');
    self.$menuBtnFiles = $('.cms-menu-item-files');
    self.$menuBtnLogout = $('.cms-menu-item-logout');
    self.$menuBtnTranslations = $('.cms-menu-item-translations');
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
    self.$menuBtnMeta.on('click', self.menuBtnMetaClickHandler);
    self.$menuBtnFiles.on('click', self.menuBtnFilesClickHandler);
    self.$menuBtnLogout.on('click', self.menuBtnLogoutClickHandler);
    self.$menuBtnTranslations.on('click', self.menuBtnTranslationsClickHandler);
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
    self.$menuBtnMeta.off('click', self.menuBtnMetaClickHandler);
    self.$menuBtnFiles.off('click', self.menuBtnFilesClickHandler);
    self.$menuBtnLogout.off('click', self.menuBtnLogoutClickHandler);
    self.$menuBtnTranslations.off('click', self.menuBtnTranslationsClickHandler);
  },

  getMenuHtml: function () {
    var menu = '\
        <div class="cms-menu-bg cms-ui-hidden"></div>\
        <ul class="cms-menu cms-ui-hidden">\
        <li class="cms-menu-top"></li>\
        <li \
          class="cms-menu-item cms-menu-item-logout">\
          <span class="cms-menu-item-text">Logout</span>\
          <span class="cms-menu-item-icon cms-menu-item-icon-logout cms-anim-fade-250ms cms-unselectable"></span>\
        </li>\
        <li \
          class="cms-menu-item cms-menu-item-files">\
          <span class="cms-menu-item-text">File Manager</span>\
          <span class="cms-menu-item-icon cms-menu-item-icon-files cms-anim-fade-250ms cms-unselectable"></span>\
        </li>\
        <li \
          class="cms-menu-item cms-menu-item-meta">\
          <span class="cms-menu-item-text">Edit Meta Info</span>\
        </li>\
        <li \
          class="cms-menu-item cms-menu-item-preview">\
          <span class="cms-menu-item-text">Preview</span>\
          <span class="cms-menu-item-icon cms-menu-item-icon-preview cms-anim-fade-250ms cms-unselectable">👁</span>\
        </li>\
        <li \
          class="cms-menu-item cms-menu-item-translations">\
          <span class="cms-menu-item-text">Translations</span>\
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
      var sectionName = $sections.children()[i].getAttribute('data-name') || 'section'+(i+1),
          sectionDesc = $(elem).children().find('[contenteditable]:not(:empty)')[0];

      if (sectionDesc) {
        sectionDesc = sectionDesc.innerText.substring(0, 100);
      } else {
        sectionDesc = '...';
      }

      menuItems += '\
      <li \
        id="menu-item-'+(i+1)+'" \
        class="cms-menu-item cms-menu-section-item">\
        <span class="cms-menu-item-text"><a href="#section'+(i+1)+'">'+sectionName+'</a></span>\
        <p class="cms-menu-section-item-desc">'+sectionDesc+'</p>\
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
      cms.sectionManager.moveSectionUp(index);
      cms.sectionManager.reIndexSections();
    }
  },

  menuItemDownClickHandler: function (e) {
    var $this = $(this.parentNode),
        $next = $($this).next(),
        index = $this.attr('id').replace('menu-item-', '');

    $next.after($this);
    self.reIndexMenuItems();
    cms.sectionManager.moveSectionDown(index);
    cms.sectionManager.reIndexSections();
  },

  menuItemDeleteClickHandler: function (e) {
    var $this = $(this.parentNode),
        index = $this.attr('id').replace('menu-item-', '');

    $this.remove();
    self.reIndexMenuItems();
    cms.sectionManager.removeSection(index);
    cms.sectionManager.reIndexSections();
  },

  menuBtnSaveClickHandler: function (e) {
    cms.exportManager.savePage();
  },

  menuBtnPreviewClickHandler: function (e) {
    cms.previewManager.previewPage();
  },

  menuBtnAddSectionClickHandler: function (e) {
    cms.sectionManager.showUI();
  },

  menuBtnMetaClickHandler: function (e) {
    cms.metaManager.showUI();
  },

  menuBtnFilesClickHandler: function (e) {
    cms.fileManager.showUI();
  },

  menuBtnLogoutClickHandler: function (e) {
    window.location.href = 'cms/api/logout.php';
  },

  menuBtnTranslationsClickHandler: function () {
    cms.translationManager.showUI();
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
    cms.saveProgress();
    self.updateUI();
    $('.cms-menu, .cms-menu-bg').addClass('cms-anim-fade-250ms ');
    self.$menu.removeClass('cms-ui-hidden');
    self.$menuBg.removeClass('cms-ui-hidden');
    self.$menuBtn.addClass('cms-menu-btn-on');
    $('body').addClass('cms-noscroll');
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
    $('body').removeClass('cms-noscroll');
    $sections.css('pointer-events', 'all');
    self.$menu.addClass('cms-ui-hidden');
    self.$menuBg.addClass('cms-ui-hidden');
    self.$menuBtn.removeClass('cms-menu-btn-on');
    cms.saveProgress();
  },
}