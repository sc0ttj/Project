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

      var $uploadBtn = $('#file-upload-'+i),
          $image    = $('#image-'+i);
      self.addUploadMediaBtnEvents($uploadBtn, $image);
    });
  },

  addUploadMediaBtnEvents: function (fileBtn, image) {
    fileBtn.on('change', function uploadBtnChangeHandler(e){
      var file     = this.files[0],
          $uploadBtn = $(this).prev('label'),
          $uploadBtns = $('.cms-media-chooser-upload-label');

      if (!file) return false;
      // update preview in media manager with base64 data
      self.updatePreviewImage(file, image);
      // upload image
      fileBtn.prop('disabled', true);
      self.uploadImage(e, file, $uploadBtn, $uploadBtns);
      fileBtn.prop('disabled', false);
    });
  },

  updatePreviewImage: function (file, image){
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      image.attr('src', reader.result)
    }, false);
    if (file) reader.readAsDataURL(file);
  },

  uploadImage: function (e, file, $uploadBtn, $uploadBtns){
    var formData = new FormData(this);

    formData.append('image', file, file.name);
    //prevent redirect and do ajax upload
    e.preventDefault();
    var xhr = new XMLHttpRequest()
    xhr.open('POST', 'upload.php', true);
    self.updateBtns($uploadBtn, $uploadBtns);
    self.updateBtnOnProgress(xhr, $uploadBtn);
    self.updateBtnsOnFinish(xhr, $uploadBtn, $uploadBtns);
    // send
    xhr.send(formData);
  },

  updateBtns: function(btn, btns){
      btn.addClass('cms-media-chooser-upload-label-uploading');
      btns.css('pointer-events', 'none');
  },

  updateBtnOnProgress: function(xhr, btn){
    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        var ratio = Math.floor((e.loaded / e.total) * 100) + '%';
        btn.html('Uploading '+ratio);
      }
    }
  },

  updateBtnsOnFinish: function(xhr, btn, btns){
    xhr.onload = function() {
      if (xhr.status === 200) {
        // upload finished!
        // add img to src or srcset in main page
        //reset btn
        setTimeout(function() {
          btn.html('Upload image');
          btn.removeClass('cms-media-chooser-upload-label-uploading');
          btns.css('pointer-events', 'all');
        }, 3000);
      } else {
        btn.html('Upload error');
        btn.addClass('cms-media-chooser-upload-label-uploading-error');
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
