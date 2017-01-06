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
    this.addMediaChooser();
  },

  addImageEditors: function () {
    var $imgs = $(this.config.responsiveImageSelector).not('.cms-editable-img');
    if ($imgs.length > 0) {
      $imgs.addClass('cms-editable-img');
      $imgs.on('click', this.onImageClickHandler);
    }
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
    $mediaChooserCloseBtn.on('click', this.mediaChooserCloseBtnClickHandler);
  },

  mediaChooserCloseBtnClickHandler: function (e) {
    $('body').css('overflow', 'auto');
    $mediaChooser.css('display', 'none');
    $(mediaChooserContainer).html('');
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
    if (images.length < 1) return '';
    var sourceImages = [];

    for (var i=0; i < images.length; i++){
      var $img     = $(images[i]),
          tag      = images[i].tagName,
          data     = $img.data('name') || '',
          dataAttr = (data) ? dataAttr = 'data-name="'+data+'"' : dataAttr = '',
          src      = '';

      if (tag === 'IMG')    src = $img.attr('src');
      if (tag === 'SOURCE') src = $img.attr('srcset');
      sourceImages[i] = '<img id="image-' + i + '"' + dataAttr + ' src="' + src + '" />';
    }
    return sourceImages;
  },

  showMediaChooser: function (sourceImages) {
    $('body').css('overflow', 'hidden');
    $mediaChooser.css('display', 'block');

    sourceImages.forEach(function (imgHtml, i){
      var imgDimensions  = $(imgHtml).data('name'),
          uploadMediaBtn = self.createUploadMediaBtn(i),
          imageHeaderTxt = '<p class="cms-media-chooser-image-title">' + imgDimensions + '</p>';
      
      if (imgDimensions) $(mediaChooserContainer).append(imageHeaderTxt);
      $(mediaChooserContainer).append(imgHtml);
      $(mediaChooserContainer).append(uploadMediaBtn);
    });
  },

  createUploadMediaBtn: function (i) {
    window.inputFileChangeHandler = function(el) {
      var preview = $(el).prev().prev()[0],
          file    = el.files[0];
          reader  = new FileReader();
      reader.addEventListener('load', function () {
        $(preview).attr('src', reader.result);
      }, false);
      if (file) reader.readAsDataURL(file);

      // upload file to 'www/images/'
      // update srcset in image on page with uploaded img url
    }
    var uploadMediaBtn = '\
      <label for="file-upload-' + i + '" class="custom-file-upload">Choose a file...</label>\n\
      <input  id="file-upload-' + i + '" type="file" onchange="inputFileChangeHandler(this)" />';
    
    return uploadMediaBtn;
  },

}
