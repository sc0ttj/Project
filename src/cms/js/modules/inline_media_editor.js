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
    var $imgs = $('picture:not(.cms-editable-img)').addClass('cms-editable-img');
    $imgs.on('click', this.onImageClickHandler);
  },

  onImageClickHandler: function (e) {
    var el = this,
        $el = $(this),
        img = '';
        $images = $el.children('source, img');

    var sourceImages = self.getImageSourceFiles($images);
    self.showMediaChooser(sourceImages);
  },

  getImageSourceFiles: function ($images) {
    var sourceImages = [];

    for (var i=0; i < $images.length; i++){
      var $img = $($images[i]),
          src = '';

      if ($images[i].tagName === 'SOURCE'){
        src = $img.attr('srcset');
        media = $img.attr('media');
        sourceImages[i] = '<img src="' + src + '"></img>';
      } else if ($images[i].tagName === 'IMG'){
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
    <center><h2>Image Manager</h2>\n\
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
