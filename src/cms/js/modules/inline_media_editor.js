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
    <button class="cms-media-chooser-btn cms-media-chooser-close-btn">Back</button>\n\
    </div>';
    $('body').append(mediaChooser);

    $mediaChooser = $('div.cms-media-chooser');
    mediaChooserContainer = $mediaChooser.children('.cms-media-chooser-container');
    
    var $mediaChooserCloseBtn = $('.cms-media-chooser-close-btn');
    $mediaChooserCloseBtn.on('click', this.mediaChooserCloseBtnClickHandler);
  },

  mediaChooserCloseBtnClickHandler: function (e) {
    $('.cms-media-chooser-upload-btn').off('change', this.inputFileChangeHandler);
    $('body').css('overflow', 'auto');
    $(mediaChooserContainer).html('');
    $mediaChooser.css('display', 'none');
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

    // for each image src file
    sourceImages.forEach(function (imgHtml, i){
      var imgDimensions  = $(imgHtml).data('name'),
          uploadMediaBtn = self.createUploadMediaBtn(i),
          imageHeaderTxt = '<p class="cms-media-chooser-image-title">' + imgDimensions + '</p>';
      
      //build image list
      if (imgDimensions) $(mediaChooserContainer).append(imageHeaderTxt);
      $(mediaChooserContainer).append(imgHtml);
      $(mediaChooserContainer).append(uploadMediaBtn);
      self.addUploadMediaBtnEvents(i);
    });
  },

  addUploadMediaBtnEvents: function (i) {
    var $uploadBtn = $('#file-upload-'+i);
    // create event handler for each upload media button
    $uploadBtn.on('change', function uploadBtnChangeHandler(e){
      var file     = this.files[0],
          image    = $('#image-'+i),
          $uploadLabel = $(this).prev('label'),
          $uploadLabels = $('.cms-media-chooser-upload-label');

      if (!file) return false;

      // update preview in media manager with base64 data
      self.updatePreviewImage(file, image);
      // upload image
      $uploadBtn.prop('disabled', true);
      self.uploadImage(e, file, $uploadLabel, $uploadLabels);
      $uploadBtn.prop('disabled', false);
    });
  },

  updatePreviewImage: function (file, image){
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      image.attr('src', reader.result)
    }, false);
    if (file) reader.readAsDataURL(file);
  },

  uploadImage: function (e, file, $uploadLabel, $uploadLabels){
    var formData = new FormData(this);

    formData.append('image', file, file.name);
    //prevent redirect and do ajax upload
    e.preventDefault();

    var xhr = new XMLHttpRequest()
    xhr.open('POST', 'upload.php', true);

    self.updateLabel($uploadLabel, $uploadLabels);
    self.updateLabelOnProgress(xhr, $uploadLabel);
    self.updateLabelOnFinish(xhr, $uploadLabel, $uploadLabels);

    // send
    xhr.send(formData);
  },

  updateLabel: function(elem, elems){
      elem.addClass('cms-media-chooser-upload-label-uploading');
      elems.css('pointer-events', 'none');
  },

  updateLabelOnProgress: function(xhr, elem){
    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        var ratio = Math.floor((e.loaded / e.total) * 100) + '%';
        elem.html('Uploading '+ratio);
      }
    }
  },

  updateLabelOnFinish: function(xhr, elem, elems){
    xhr.onload = function() {
      if (xhr.status === 200) {
        // upload finished!
        // add img to src or srcset in main page
        //reset btn
        setTimeout(function() {
          elem.html('Upload image');
          elem.removeClass('cms-media-chooser-upload-label-uploading');
          elems.css('pointer-events', 'all');
        }, 3000);
      } else {
        elem.html('Upload error');
        elem.addClass('cms-media-chooser-upload-label-uploading-error');
      }
    }
  },

  createUploadMediaBtn: function (i) {
    var uploadMediaBtn = '\
      <form action="upload.php" method="post" class="cms-upload-form" enctype="multipart/form-data">\n\
        <label for="file-upload-'+i+'" class="cms-media-chooser-upload-label">Upload image</label>\n\
        <input name="image" type="file" id="file-upload-'+i+'" class="cms-media-chooser-upload-btn"  />\n\
      </form>';
    
    return uploadMediaBtn;
  },

}
