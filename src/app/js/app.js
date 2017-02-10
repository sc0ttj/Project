var languages  = require('modules/languages.js')
var loadCSS    = require('modules/loadcss').init;
var loadJS     = require('modules/loadjs');
var pageConfig = require('page_config.js');

//http://stackoverflow.com/a/31133401
// add a playing property to media stuff
// we can use this to check if a video is playing or not
Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
})


"use strict";

module.exports = {

  init: function(){
    //set page defaults
    this.pageConfig = pageConfig;
    // we know js is enabled now, mark it
    $('body').addClass('js');
     // set lang info
     this.setLang();
    // add html5 extras
    if (this.cutsTheMustard()){
      // add mustard
      $('body').addClass('html5');
      //load 'nice-to-haves'
      this.loadStylesheet('css/full.css');
      this.loadModules(['test', 'test1']);
      // init the various templates that use js
      this.fixedImage.init();
      this.scrollmation.init();
      this.statText.init();
      this.video.init();
    }
  },

  setLang: function () {
    var lang = this.getLang();

    this.lang      = this.getLangInfo(lang),
    this.lang.code = lang;
  },

  getLang: function () {
    var lang = $('html')[0].getAttribute('lang');

    lang.code = lang;
    return lang || 'en';
  },

  getLangInfo: function (lang) {
    return languages[lang];
  },

  reload: function () {
    this.fixedImage.init();
    this.scrollmation.init();
    this.statText.init();
    this.video.init();
    scrollMonitor.update();
    scrollMonitor.recalculateLocations();
  },

  cutsTheMustard: function () {
    var cutsTheMustard = (
      'querySelector' in document
      && 'localStorage' in window
      && 'addEventListener' in window);
    return cutsTheMustard;
  },

  loadStylesheet: function (file) {
    loadCSS(file);
  },

  loadModules: function (modules) {
    loadJS('js/enhancements.js', function(){
      modules.forEach(function(val, i){
        require('enhancements/' + val).init();
      });
    });
  },

  //below: for each template that uses JS, we have an object with init() method..

  fixedImage: {
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

  scrollmation: {
    init : function (){
      $('.scrollmation-text').removeClass('article');
      $('.scrollmation-text:not(.scrollmation-text-js)').addClass('scrollmation-text-js');

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

  statText: {
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

  video: {
    init: function(){
      var $videos = $('video'),
          $videoBtns = $('.video-overlay-button');

      $videos.forEach(this.setupVideoEvents);
      $videoBtns.forEach(this.setupVideoBtnEvents);
    },

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

    setupVideoBtnEvents: function(btn, i){
      var videoBtnClickHandler = function(){
        var video = this.parentNode.previousElementSibling,
            videoOverlay = this.parentNode;

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

  //https://css-tricks.com/snippets/javascript/get-url-variables/
  getQueryVariable: function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){return pair[1];}
    }
    return(false);
  },

}