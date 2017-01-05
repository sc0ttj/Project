var $ = require('cash-dom');
var self, $mediaChooser, mediaChooserContainer;

// ⚙

"use strict";

module.exports = {
  getConfig: function (){
    return this.config;
  },

  setConfig: function (config){
    this.config = config || this.config;
  },

  init: function(config){
    this.setConfig(config);
    self = this;

    this.addImageEditors();
    self.addMediaChooser();
  },

  addImageEditors: function () {
    var $imgs = $(this.config.responsiveImageSelector).not('.cms-editable-img');
    if ($imgs.length > 0) {
      $imgs.addClass('cms-editable-img');
      $imgs.on('click', this.onImageClickHandler);
    }
  },

  onImageClickHandler: function (e) {
    var el = this,
        $el = $(this),
        img = '';
        images = $el.children('source, img');

    var sourceImages = self.getImageSourceFiles(images);
    if (sourceImages !== '') self.showMediaChooser(sourceImages);
  },

  getImageSourceFiles: function (images) {
    var sourceImages = [];

    if (images.length < 1) return '';

    for (var i=0; i < images.length; i++){
      var $img = $(images[i]),
          tag = images[i].tagName,
          src = '';

      if (tag === 'SOURCE'){
        src = $img.attr('srcset');
        media = $img.attr('media');
        sourceImages[i] = '<img src="' + src + '"></img>';
      } else if (tag === 'IMG'){
        src = $img.attr('src');
        sourceImages[i] = '<img src="' + src + '"></img>';
      }
    }
    return sourceImages;
  },

  showMediaChooser: function (sourceImages) {
    $('body').css('overflow', 'hidden');
    $mediaChooser.css('display', 'block');
    sourceImages.forEach(function (html){
      $(mediaChooserContainer).append(html);
      var uploadMediaBtn = '<button class="cms-media-chooser-upload-btn">Upload new image</button>';
      $(mediaChooserContainer).append(uploadMediaBtn);
    });
  },

  addMediaChooser: function (){
    var mediaChooser = '<div class="cms-media-chooser">\n\
    <center><h3>Media Manager</h3>\n\
    <p>Edit the source images for this responsive image</p>\n\
    </center>\n\
    <div class="cms-media-chooser-container"></div>\n\
    <button class="cms-media-chooser-btn cms-media-chooser-close-btn">✘</button>\n\
    <button class="cms-media-chooser-btn cms-media-chooser-save-btn">✔</button>\n\
    </div>';

    $('body').append(mediaChooser);
    $mediaChooser = $('div.cms-media-chooser');
    mediaChooserContainer = $mediaChooser.children('.cms-media-chooser-container');
    
    var $mediaChooserCloseBtn = $('.cms-media-chooser-close-btn');
    $mediaChooserCloseBtn.on('click', self.mediaChooserCloseBtnClickHandler);
  },

  mediaChooserCloseBtnClickHandler: function (e) {
    $('body').css('overflow', 'auto');
    $mediaChooser.css('display', 'none');
    $(mediaChooserContainer).html('');
  },

}
