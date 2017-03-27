// # ui.js
// The module provides the main CMS menu. It has buttons for editing the page 
// sections, meta info, translations and more.

// Let's start. Get our dependencies
var $ = require('cash-dom'); // like jquery

// Create a persistent self reference
var self;

// Use strict setting
"use strict";

// Define the CommonJS module 
module.exports = {

  // ## Module Methods

  // ### init()
  // On init, make `self` available as reference to this module in all methods, 
  // then run addUI() to add the menu button to the page.
  init: function(){
    self = this;
    self.addUI();
    return true // if we loaded ok
  },

  // ### addUI()
  //  Define the menu and menu button HTML, then add them to the page. The menu 
  // will be hidden by default.
  addUI: function(){
    var menu     = this.getMenuHtml(),
        menuBtn  = '<button class="cms-menu-btn cms-unselectable clear">☰</button>';

    $('body').append('<div class="cms-menu-container">' + menu + '</div>');
    $('body').append(menuBtn);

    self.getUIComponents();    // register all menu elements as cashJS objects
    self.setUIEventHandlers(); // now assign event handlers to them
  },

  // ### getUIComponents()
  // Get all the menu elements as cashJS objects and bind them to this module as 
  // properties which can be accessed across this module.
  getUIComponents: function () {
    self.$menu         = $('.cms-menu');
    self.$menuBg       = $('.cms-menu-bg');
    self.$menuBtn      = $('.cms-menu-btn');
    self.$menuItems    = $('.cms-menu-item');
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

  // ### setUIEventHandlers()
  // Define which functions to execute when clicking the various menu items
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

  // ### setUIEventHandlersOff()
  // Unregister all the event handlers - useful if rebuilding the menu
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

  // ### getMenuHtml()
  // Returns the CMS menu as a string of HTML.
  //  
  // @return `menu` - string, the menu HTML
  getMenuHtml: function () {
    var menu = '\
        <div class="cms-menu-bg cms-ui-hidden"></div>\
        <ul class="cms-menu cms-ui-hidden">\
        <li class="cms-menu-top"></li>\
        <li \
          class="cms-menu-item cms-menu-item-logout">\
          <span class="cms-menu-item-text">Logout</span>\
          <span class="cms-menu-item-icon cms-menu-item-icon-logout cms-anim-fade-250ms cms-unselectable">↳</span>\
        </li>\
        <li \
          class="cms-menu-item cms-menu-item-files">\
          <span class="cms-menu-item-text">File Manager</span>\
          <span class="cms-menu-item-icon cms-menu-item-icon-files cms-anim-fade-250ms cms-unselectable">📂</span>\
        </li>\
        <li \
          class="cms-menu-item cms-menu-item-meta">\
          <span class="cms-menu-item-text">Meta Info</span>\
          <span class="cms-menu-item-icon cms-menu-item-icon-meta cms-anim-fade-250ms cms-unselectable">📝</span>\
        </li>\
        <li \
          class="cms-menu-item cms-menu-item-preview">\
          <span class="cms-menu-item-text">Preview</span>\
          <span class="cms-menu-item-icon cms-menu-item-icon-preview cms-anim-fade-250ms cms-unselectable">👁</span>\
        </li>\
        <li \
          class="cms-menu-item cms-menu-item-translations">\
          <span class="cms-menu-item-text">Translations</span>\
          <span class="cms-menu-item-icon cms-menu-item-icon-translations cms-anim-fade-250ms cms-unselectable">🌎</span>\
        </li>\
        <li \
          class="cms-menu-item cms-menu-item-save">\
          <span class="cms-menu-item-text">Save to zip</span>\
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

  // ### getSectionsAsMenuItems()
  // Create a menu item for each section on the (index.html) page  and 
  // returns these items as a string of HTML.
  //  
  // @return `menuItems` - string, the HTML of the menu buttons for each section.
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

  // ### getSections()
  // Get all page sections (reads index.html) and returns as an HTML Collection
  //  
  // @return `sections` - an HTML COllection of the sections currently on the page
  getSections: function () {
    var sections = $(cms.config.sectionSelector);
    return sections;
  },

  // ### menuBgClickHandler()
  // On clicking the menu background, hide the CMS menu
  menuBgClickHandler: function (e) {
    self.hideMenu();
  },

  // ### menuBtnClickHandler()
  // On clicking the menu button, hide or show the CMS menu
  menuBtnClickHandler: function (e) {
    self.toggleMenu();
  },

  // ### menuItemUpClickHandler()
  // Moves a section up the page and moves the related menu item up the menu.
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

  // ### menuItemDownClickHandler()
  // Moves a section down the page and moves the related menu item down the menu.
  menuItemDownClickHandler: function (e) {
    var $this = $(this.parentNode),
        $next = $($this).next(),
        index = $this.attr('id').replace('menu-item-', '');

    $next.after($this);
    self.reIndexMenuItems();
    cms.sectionManager.moveSectionDown(index);
    cms.sectionManager.reIndexSections();
  },

  // ### menuItemDeleteClickHandler()
  // Deletes the chosen section from the page and menu.
  menuItemDeleteClickHandler: function (e) {
    var $this = $(this.parentNode),
        index = $this.attr('id').replace('menu-item-', '');

    $this.remove();
    self.reIndexMenuItems();
    cms.sectionManager.removeSection(index);
    cms.sectionManager.reIndexSections();
  },

  // ### menuBtnSaveClickHandler()
  // Process and save the contents of the current folder to a .tar.gz file. 
  // This method is used to exprt the page created as a bundled, self-contained 
  // archive file.
  menuBtnSaveClickHandler: function (e) {
    cms.exportManager.savePage();
  },

  // ### menuBtnPreviewClickHandler()
  // Show the Preview Manager, which displays preview.html (or index.LANG.html) 
  // in a resizable iframe.
  menuBtnPreviewClickHandler: function (e) {
    cms.previewManager.previewPage();
  },

  // ### menuBtnAddSectionClickHandler()
  // Show the Section Manager, which lets users add new sections to the page.
  menuBtnAddSectionClickHandler: function (e) {
    cms.sectionManager.showUI();
  },

  // ### menuBtnMetaClickHandler()
  // Show the META Manager - lets users edit the meta info of the page.
  menuBtnMetaClickHandler: function (e) {
    cms.metaManager.showUI();
  },

  // ### menuBtnFilesClickHandler()
  // show the file manager - lets users edit, rename, add, remove files from 
  // the current directory.
  menuBtnFilesClickHandler: function (e) {
    cms.fileManager.showUI();
  },

  // ### menuBtnLogoutClickHandler()
  // Will logout the user out and redirect them to the login page. They will 
  // need to be logged in to edit the page.
  menuBtnLogoutClickHandler: function (e) {
    window.location.href = cms.config.api.logout;
  },

  // ### menuBtnTranslationsClickHandler()
  // show the Translation Manager - where users can create translated versions 
  // of their page.
  menuBtnTranslationsClickHandler: function () {

    /* hide the CMS menu */
    cms.ui.hideMenu();

    /* the translation manager needs preview.html to exist, so let's 
     * create it, to be safe - get the latest page HTML as a string */
    var html = cms.exportManager.getPageHTMLWithoutCMS();

    /* make it a string containing a proper HTML doc */
    html = cms.exportManager.addDocType(html);

    /* save the HTML to preview.html, then 
     * load up the Translation Manager */
    cms.exportManager.saveHtmlToFile(html, cms.translationManager.showUI);
  },

  // ### reIndexMenuItems()
  // Fix the index numbers of the menu items (needed after moving items up or down)
  reIndexMenuItems: function (){
    $('.cms-menu-section-item').each(function(el, i){
      var $el = $(el);
      $el.attr('id', 'menu-item-'+(i+1));
      $el.find('a').attr('href', '#section'+(i+1));
    });
  },

  // ### toggleMenu()
  // Hides or shows the CMS menu.
  toggleMenu: function(){
    if (self.$menu.hasClass('cms-ui-hidden')){
      self.showMenu();
    } else {
      self.hideMenu();
    }
  },

  // ### showMenu()
  // Save the page to localStorage, then update the menu contents, then 
  // add the classes needed to show the menu.
  showMenu: function(){
    cms.saveProgress();
    self.updateUI();
    $('.cms-menu, .cms-menu-bg').addClass('cms-anim-fade-250ms ');
    self.$menu.removeClass('cms-ui-hidden');
    self.$menuBg.removeClass('cms-ui-hidden');
    self.$menuBtn.addClass('cms-menu-btn-on');
    $('body').addClass('cms-noscroll');
  },

  // ### updateUI()
  // Get the latest menu HTML, remove event handlers from the existing menu 
  // items, then replace the menu HTML then re-index them and, finally, 
  // re-register the menu items with their event handlers.
  updateUI: function () {
    var menu = this.getMenuHtml();
    self.setUIEventHandlersOff();
    $('.cms-menu-container').html(menu);
    self.reIndexMenuItems();
    self.getUIComponents();
    self.setUIEventHandlers();
  },

  // ### hideMenu()
  // Hides the CMS meu, saves the latest pag eHTML to localStorage.
  hideMenu: function(){
    $('body').removeClass('cms-noscroll');
    self.$menu.addClass('cms-ui-hidden');
    self.$menuBg.addClass('cms-ui-hidden');
    self.$menuBtn.removeClass('cms-menu-btn-on');
    cms.saveProgress();
  },

//  
// End of module
};
