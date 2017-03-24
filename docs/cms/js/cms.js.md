# cms.js

This file is called by [index.html]() and needs a config object.
If no config object is passed to `init()` then a default config will be used.

First, we require in the dependencies
```js
var $         = require('cash-dom');             /* enables a lightweight jQuery alternative */
var languages = require('modules/languages.js')  /* provides list of languages (for translations) */
var loadCSS   = require('modules/loadcss').init; /* enables load CSS on the fly */
var store     = require('store');                /* enables cross-browser localStorage solution */
var zenscroll = require('zenscroll');            /* enables click to smooth scroll to anchor */
```

## Default Config
This JSON object defines the classes, containers, elements and server side URLs that the CMS should look for.  
The values in this config match values defined in the [app templates](https://github.com/sc0ttj/Project/tree/jdi/src/app/templates)
```js
  config: {
    
    /* localStorage is used to make CMS page changes persistent,
     *  you can disable it if it is causing issues like slow page loads/edits
     */
    'localStorage' : true,
    
    /* The list of template files to make available in the Section Manager.  
     * These files are in https://github.com/sc0ttj/Project/tree/jdi/src/app/templates
     */
    'templates' : [ 
      '_hero-center.tmpl',
      '_article-full-width.tmpl',
      '_article-left.tmpl',
      '_article-right.tmpl',
      '_image-center.tmpl',
      '_image-fixed.tmpl',
      '_scrollmation-text-left.tmpl',
      '_stat-text.tmpl',
      '_youtube-full-width.tmpl',
      '_video.tmpl',
      '_video-full-width.tmpl'
    ],
    
    /* The selector of the element which contains the added sections/templates. */
    'sectionSelector' : 'body .section',
    
    /* The HTML to use as the section/template container element */
    'sectionContainer' : '<div class="section"></div>', 
    
    /* The elements the CMS will make editable (using `contenteditable`) */
    'editableItems' : [
      'h1',
      'h2',
      'p',
      'blockquote',
      'li'
    ],
    
    /* The class to add to editable elements (used by the CMS to find editable items) */
    'editableClass' : 'cms-editable',
    
    /* The class given to elements which contain multiple editable items.
     * These elements are defined in the templates, and would usually contain 
     * paragraphs or list items.
     */
    'editableRegionClass' : 'cms-editable-region',
    
    /* The elements to which the CMS should add a 'ADD MEDIA' button, 
     * which, when clicked, adds an image after the currently 
     * highlighted element */
    'inlineMediaRegionSelector' : '.scrollmation-container p[contenteditable],.article:not(.article-right):not(.article-left) p[contenteditable]',
    
    /* The selector to use for making image elements clickable and editable (via the CMS Image Manager) */
    'responsiveImageSelector' : 'picture, .scrollmation-container, .inline-image',
    
    /* The selector to use for making video elements clickable and editable (via the CMS Video Manager) */
    'videoSelector' : 'video',
    
    /* The classes to add to the `<body>` tag if the browser is HTML5 and modern JS capable.
     * We can use these classes in the app CSS to enable CSS animations for modern browsers, for example.
     */
    'mustardClass' : 'html5 js',
    
    /* The server-side URLs which the CMS will use to POST and GET data (for uploads, etc) */
    'api': {
    
      /* The file to which images, videos and vocab files are uploaded */
      'upload' : 'cms/api/upload.php',
    
      /* The file which writes POSTed html to a .html file */
      'preview' : 'cms/api/preview.php',
    
      /* The file which saves, enables and disables page translations */
      'translate' : 'cms/api/translation.php',
    
      /* This file saves the current dir to a zip file */
      'save' : 'cms/api/save.php',
    
      /* Logout and destroy the PHP session */
      'logout' : 'cms/api/logout.php'
    }
  },

```
## Methods

#### getConfig()
```js
  getConfig: function (){
    return this.config;
  },

```
#### setConfig()
@param `config` - a JSON object like the default one above
```js
  setConfig: function (config){
    this.config = config || this.config;
  },

```
#### init()
@param `config` - a JSON object like the default one above
```js
  init: function(config){
    this.setConfig(config);
    this.pageConfig = app.pageConfig;
    this.pageDir    = window.location.pathname.split('/').slice(0, -1).join('/');

    this.restoreProgress();
    if (this.cutsTheMustard()) this.addMustard();
    this.loadStylesheets();
    this.setupSmoothScrolling();
    /* set lang info */
    this.setLang();
    /* this.autoSave(); // not used */

    /* Require in all the CMS modules that we need */
    this.ajax           = require('modules/ajaxer');
    this.modal          = require('modules/modal');
    this.editor         = require('modules/page_editor');
    this.videoManager   = require('modules/video_manager');
    this.imageManager   = require('modules/image_manager');
    this.sectionManager = require('modules/section_manager');
    this.metaManager    = require('modules/meta_manager');
    this.previewManager = require('modules/preview_manager');
    this.exportManager  = require('modules/export_manager');
    this.templater      = require('modules/templater');
    this.translationManager = require('modules/translation_manager');
    this.vocabEditor    = require('modules/vocab_editor');
    this.fileManager    = require('modules/file_manager');
    this.ui             = require('modules/ui');

    /* Initialise the modules required by the translation manager.  */
    this.modal.init();
    this.vocabEditor.init();
    this.previewManager.init();
    this.exportManager.init();

    /* NOTE: var 'translateOnly' was set either true or false by 
     * our PHP backend.. if true, the CMS should disable editing 
     * of the page, and only allow editing of translations.
     * So, we will only load the other modules if not in translation mode.
     */
    if (!cms.showTranslation() && !translateOnly){
      this.editor.init();
      this.videoManager.init();
      this.imageManager.init();
      this.sectionManager.init();
      this.metaManager.init();
      this.fileManager.init();
      this.templater.init();
      this.translationManager.init();
      this.ui.init();
    }

    /* If the URL contains `?translate=XX`, where `XX` is a valid 2 letter    
     * ISO language code, then show the translation manager immediately.
     */
    if (this.showTranslation()) this.vocabEditor.translatePage();

    return true /* if we loaded up ok */
  },


```
#### setLang()
```js
  setLang: function () {
    var lang = this.getLang();

    this.lang      = this.getLangInfo(lang),
    this.lang.code = lang;
  },

```
#### getLang()
```js
  getLang: function () {
    var lang = $('html')[0].getAttribute('lang');

    lang.code = lang;
    return lang || 'en';
  },

```
#### getLangInfo()
@param `lang` - a 2 letter language ISO code
```js
  getLangInfo: function (lang) {
    return languages[lang];
  },

```
#### getLanguages()
```js
  getLanguages: function () {
    return languages;
  },

```
#### setupSmoothScrolling()
```js
  setupSmoothScrolling: function () {
    var defaultDuration = 400; // ms
    var edgeOffset = 0; // px
    zenscroll.setup(defaultDuration, edgeOffset);
  },

```
#### reload()
```js
  reload: function (){
    if (this.showTranslation()) return false;
    cms.editor.setEditableItems(this.config.editableItems);
    cms.editor.setEditableRegions(this.config.editableRegionClass);
    cms.editor.setEventHandlers();
    cms.videoManager.addVideoClickHandlers();
    cms.imageManager.init();
    app.reload();
  },

```
#### cutsTheMustard()
```js
  cutsTheMustard: function () {
    var cutsTheMustard = (
      'querySelector' in document
      && 'localStorage' in window
      && 'addEventListener' in window);
    return cutsTheMustard;
  },

```
#### addMustard()
```js
  addMustard: function (){
    document.getElementsByTagName('body')[0].classList.add('cms-html5');
  },

```
#### loadStylesheets()
```js
  loadStylesheets: function (){
    var stylesheets = [ 'cms/css/vendor.css', 'cms/css/cms.css' ];
    stylesheets.forEach(function(val){
      loadCSS(val);
    });
  },

```
#### showTranslation()
```js
  showTranslation: function (){
    if (this.getQueryVariable('preview') != '') return true;
    return false;    
  },

```
#### autoSave()
```js
  autoSave: function () {
    if (this.showTranslation()) return false;
    setInterval(this.saveProgress, 30000);
  },

```
#### saveProgress()
Get the current HTML of the page being edited and save that HTML to localStorage
```js
  saveProgress: function(){
    if (cms.showTranslation()) return false;
    if (!cms.config.localStorage) return false;

    var $html = $('body').clone(),
        $head = $('head').clone(),
        html  = '';

    /* Here we clean up the HTML we got from the page, by 
     * removing any CMS elems, classes etc. Then we reset various 
     * things to their initial page load state.
     */
    $html.find('.cms-menu-container, .cms-menu, .cms-modal, .cms-media-btn, .cms-menu-btn').remove();
    $html.find('#cms-init, link[href^="cms"]').remove();
    /* reset page to defaults */
    $html.find('body').removeClass('js');
    $html.find('.video-overlay').removeClass('hidden');
    $html.find('.video-overlay-button').html('▶');
    $html.find('*').removeClass('scrollmation-image-container-fixed');
    /* get cleaned up html */
    html = $html.html();
    html = cms.exportManager.cleanupWhitespace(html);

    /* save cleaned up html to localstorage */
    store.set(this.pageDir + '__head', $head.html());
    store.set(this.pageDir, html);
    /* console.log('Saved progress..'); */
  },

```
#### restoreProgress()
Get HTML for this page from localStorage if it exists, then replace the page HTML with the saved version.
```js
  restoreProgress: function(){
    var html = store.get(this.pageDir), // our namespaced HTML in storage
        head = store.get(this.pageDir + '__head'), // our namespaced head HTML in storage
        restored = false;

    if (!cms.config.localStorage) return false;

    if (html) {
      $('body').html(html);
      restored = true;
    }
    if (head) {
      $('head').html(head);
      restored = true;
    }
    if (restored) app.reload();
  },

```
#### getQueryVariable()
```js
  getQueryVariable: function (variable) {
    /* https://css-tricks.com/snippets/javascript/get-url-variables/ */
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){return pair[1];}
    }
    return(false);
  },

};
```
------------------------
Generated _Tue Mar 21 2017 18:57:07 GMT+0000 (GMT)_ from [&#x24C8; cms.js](cms.js "View in source")

