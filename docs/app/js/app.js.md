# app.js
The main app file    
This file is included in [index.tmpl](https://github.com/sc0ttj/Project/blob/master/src/app/templates/index.tmpl)   
This file will do the following:
- include module loading deps
- add html5 and JS classes to page body, if those features detected
- initiliase the scrollMonitor (for animations, tracking)
- initialise the template JS behaviours (scroll anims, video auto-pause etc)

Let's begin:

Include our dependencies
```js
var loadCSS    = require('modules/loadcss').init;
var loadJS     = require('modules/loadjs');
var pageConfig = require('page_config.js');

"use strict";

module.exports = {

```
## Methods

#### init()
This func is executed in index.html (the main page) 
as soon as the page loads.
```js
  init: function(){
    /* set page defaults */
    this.pageConfig = pageConfig;
    /* we know js is enabled now, mark it */
    $('body').addClass('js');
    /* add html5 extras */
    if (this.cutsTheMustard()){
      /* add mustard (enables css animations) */
      $('body:not(.html5)').addClass('html5');
      /* init the various templates that use js */
      this.fixedImage.init();
      this.scrollmation.init();
      this.statText.init();
      this.video.init();
    }
  },

```
#### reload()
This func is called by the CMS after adding/removing a section.
```js
  reload: function () {
    this.fixedImage.init();
    this.scrollmation.init();
    this.statText.init();
    this.video.init();
    scrollMonitor.update();
    scrollMonitor.recalculateLocations();
  },

```
#### cutsTheMustard()
Checks if the users browser is up to scratch,
returns either true or false
```js
  cutsTheMustard: function () {
    var cutsTheMustard = (
      'querySelector' in document
      && 'localStorage' in window
      && 'addEventListener' in window);
    return cutsTheMustard;
  },

```
#### loadStylesheet()
This func is used to load stylesheets dynamically  
@param `file` - the relative path to the css file to load
```js
  loadStylesheet: function (file) {
    loadCSS(file);
  },

```
#### loadModules()
This func takes an array of module names. The names must match 
modules in [src/app/js/enhancements/](https://github.com/sc0ttj/Project/tree/master/src/app/js/_enhancements)   
NOTE: This func is disabled, to enable it, you need to remove the underscore from `_enhancements`   
@param `modules` - the array of module names to load
```js
  loadModules: function (modules) {
    loadJS('js/enhancements.js', function(){
      modules.forEach(function(val, i){
        require('enhancements/' + val).init();
      });
    });
  },

```
#### getQueryVariable()
```js
  /*https://css-tricks.com/snippets/javascript/get-url-variables/ */
  getQueryVariable: function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){return pair[1];}
    }
    return(false);
  },

```
## Template Objects
For each template that uses JS, create an object with an init() method:

### Fixed Image Object
####  Methods:
- init()
```js
  fixedImage: {
```
#### fixedImage::init()
```js
    init: function() {
      var fixedImages = $('.fixed-image-text:not(.transparent)');
      fixedImages.addClass('anim-fade-1s transparent');
      
      var watchers = $('.fixed-image-text').each(function addWatchers(el){
        var $el = $(el);
        var watcher = scrollMonitor.create(el);

        watcher.fullyEnterViewport(function(){
          $el.removeClass('transparent');
        });
        watcher.exitViewport(function(){
          $el.addClass('transparent');
        });
      });
    },
  },

```
### Scrollmation Object
####  Methods:
- init()
```js
  scrollmation: {
```
#### scrollmation::init()
```js
    init : function (){
      $('.scrollmation-text').removeClass('article');
      $('.scrollmation-text:not(.scrollmation-text-js)').addClass('scrollmation-text-js');
      $('.scrollmation-text-js').addClass('full-height');

      $('.scrollmation-image-container').removeClass('scrollmation-image-container-fixed');
      $('.scrollmation-image-container').addClass('scrollmation-image-container-top');

      var scrollmationStartTags = $('.scrollmation-start'),
          scrollmationTextTags  = $('.scrollmation-text'),
          scrollmationEndTags   = $('.scrollmation-end');

      var startWatchers = scrollmationStartTags.each(function addWatchers(el){
        var $el        = $(el),
            watcher    = scrollMonitor.create(el),
            $container = $(el.parentNode.getElementsByClassName('scrollmation-image-container'));

        watcher.enterViewport(function() {
          $container.removeClass('scrollmation-image-container-fixed');
          $container.removeClass('scrollmation-image-container-bottom');
          if (!$container.hasClass('scrollmation-image-container-top')) $container.addClass('scrollmation-image-container-top');
        });

      });

      var textWatchers = scrollmationTextTags.each(function addWatchers(el){
        var $el        = $(el),
            watcher    = scrollMonitor.create(el),
            $container = $(el.parentNode.getElementsByClassName('scrollmation-image-container'));

        watcher.fullyEnterViewport(function(){
          $container.removeClass('scrollmation-image-container-top');
          $container.removeClass('scrollmation-image-container-bottom');
          if (!$container.hasClass('scrollmation-image-container-fixed')) $container.addClass('scrollmation-image-container-fixed');
          
        });
      });

      var endWatchers = scrollmationEndTags.each(function addWatchers(el){
        var $el        = $(el),
            watcher    = scrollMonitor.create(el),
            $container = $(el.parentNode.getElementsByClassName('scrollmation-image-container'));

        watcher.enterViewport(function(){
          $container.removeClass('scrollmation-image-container-fixed');
          $container.removeClass('scrollmation-image-container-top');
          if (!$container.hasClass('scrollmation-image-container-bottom')) $container.addClass('scrollmation-image-container-bottom');
        });

      });
    },
  },

```
### statText Object
####  Methods:
- init()
```js
  statText: {
```
#### statText::init()
```js
    init: function() {
      var statTexts = $('.stat-text:not(.transparent)');
      statTexts.addClass('anim-fade-1s transparent');
     
      var watchers = $('.stat-text').each(function addWatchers(el){
        var $el = $(el),
            watcher = scrollMonitor.create(el);

        watcher.fullyEnterViewport(function(){
          $el.removeClass('transparent');
        });
        watcher.exitViewport(function(){
          $el.addClass('transparent');
        });
      });
    },
  },

```
### Video Object
####  Methods:
- init()
- setupVideoEvents()
- setupVideoBtnEvents()
```js
  video: {
```
#### video::init()
```js
    init: function(){
      var $videos = $('video'),
          $videoBtns = $('.video-overlay-button');

      $videos.each(this.setupVideoEvents);
      $videoBtns.each(this.setupVideoBtnEvents);

      /* add auto pause behaviour when video scrolls out of viewport */
      var watchers = $('video').each(function addWatchers(video){
        var watcher = scrollMonitor.create(video),
            videoOverlay = video.nextElementSibling;

        watcher.exitViewport(function(){
          video.pause();
          if (videoOverlay){
            $(videoOverlay).removeClass('hidden');
            $(videoOverlay.children[0]).html('▶');
          }
        });
      });

    },

```
#### video::setupVideoEvents()
```js
    setupVideoEvents: function (videoElem, i) {
      var videoOverlay = videoElem.nextElementSibling,
          overlayBtn   = videoOverlay.firstChild.nextSibling;

      $(videoOverlay).removeClass('hidden');

      $(videoElem).on('mouseover',  function (){
        $(videoOverlay).removeClass('hidden');
      });
      $(videoElem).on('mouseout',  function (){
        if (videoElem.playing) $(videoOverlay).addClass('hidden');
      });
      $(videoElem).on('ended',  function (){
        $(videoOverlay).removeClass('hidden');
        overlayBtn.innerHTML = '▶';
      });
    },

```
#### video::setupVideoBtnEvents()
```js
    setupVideoBtnEvents: function(btn, i){
      var videoBtnClickHandler = function(){
        var video = this.parentNode.previousElementSibling,
            videoOverlay = this.parentNode;

        /*http://stackoverflow.com/a/31133401
         * add a playing property to media stuff
         * we can use this to check if a video is playing or not
         */
        if (typeof video.playing == 'undefined'){
          Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
            get: function(){
              return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
            }
          });
        }

        if (video.playing) {
          video.pause();
          $(videoOverlay).removeClass('hidden');
          this.innerHTML = '▶';
        } else {
          video.play();
          $(videoOverlay).addClass('hidden');
          this.innerHTML = '⏸';
        }
      };
      $(btn).on('click',  videoBtnClickHandler);
    },

  },

}
```
------------------------
Generated _Mon Mar 20 2017 20:10:27 GMT+0000 (GMT)_ from [&#x24C8; app.js](app.js "View in source")

