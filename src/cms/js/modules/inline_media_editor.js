var $ = require('cash-dom');
var ajax  = require('modules/ajaxer');
var self, $mediaChooser, $mediaChooserContainer;

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
    var mediaChooser = self.createMediaChooser();
    $('body').append(mediaChooser);

    $mediaChooser = $('div.cms-media-chooser');
    $mediaChooserContainer = $mediaChooser.children('.cms-media-chooser-container');
    
    var $mediaChooserCloseBtn = $('.cms-media-chooser-close-btn');
    $mediaChooserCloseBtn.on('click', this.mediaChooserCloseBtnClickHandler);
  },

  mediaChooserCloseBtnClickHandler: function (e) {
    $('.cms-media-chooser-upload-btn').off('change', this.inputFileChangeHandler);
    $('body').css('overflow', 'auto');
    $mediaChooserContainer.html('');
    $mediaChooser.css('display', 'none');
  },

  onImageClickHandler: function (e) {
    var img = this,
        imgSrcElems = self.getImgSourceElems(img),
        previewImages = [],
        previewImages = self.createImgsFromImgSrcElems(imgSrcElems);
    
    self.setCurrentImage(img);
    if (previewImages.length > 0) self.showMediaChooser(previewImages);
  },

  setCurrentImage: function (img){
    self._currentImage = img;
    var imgIsNotAnImage = (self._currentImage.tagName != 'IMG' && self._currentImage.tagName != 'PICTURE');
    if (imgIsNotAnImage){
      self._currentImage = $(img).find('picture, img');
    }
  },

  getImgSourceElems: function (img) {
    return $(img).children('source, img');
  },

  createImgsFromImgSrcElems: function (imgSrcElems) {
    if (imgSrcElems.length < 1) return '';
    var images = [];
    // create html for each src image
    for (var i=0; i < imgSrcElems.length; i++){
      var $img     = $(imgSrcElems[i]),
          tag      = imgSrcElems[i].tagName,
          data     = $img.data('name') || '',
          dataAttr = (data) ? dataAttr = 'data-name="'+data+'"' : dataAttr = '',
          src      = '';

      if (tag === 'IMG')    src = $img.attr('src');
      if (tag === 'SOURCE') src = $img.attr('srcset');
      images[i] = '<img id="preview-image-' + i + '" ' + dataAttr + ' data-index="'+i+'" src="' + src + '" />';
    }
    return images;
  },

  showMediaChooser: function (previewImages) {
    $('body').css('overflow', 'hidden');
    $mediaChooser.css('display', 'block');

    // for each preview image src file
    previewImages.forEach(function (imgHtml, i){
      var imgDimensions  = $(imgHtml).data('name'),
          uploadMediaBtn = self.createUploadMediaBtn(i),
          imageHeaderTxt = '<p class="cms-media-chooser-image-title">' + imgDimensions + '</p>';
      
      //build image list
      if (imgDimensions) $mediaChooserContainer.append(imageHeaderTxt);
      $mediaChooserContainer.append(imgHtml);
      $mediaChooserContainer.append(uploadMediaBtn);

      // setup file input and image preview
      var $fileBtn = $('#file-upload-'+i);
      self.fileBtnClickHandler($fileBtn);
    });
  },

  fileBtnClickHandler: function (fileBtn) {
    //force upload on choosing a file
    fileBtn.on('change', function uploadBtnChangeHandler(e){
      var file = this.files[0],
          filename = this.files[0].name,
          imgUrl = '/images/'+filename;

      var $previewImg = $(this).parent().prev('img'),
          $previewImgId = $previewImg.attr('id'),
          imageSrcIndex = $('#'+$previewImgId).data('index');

      self._currentImgUrl = imgUrl;
      self._currentImgSrcElem = imageSrcIndex;

      if (!file) return false;
      // set current upload button labels, and all btns
      self._$currentBtn  = $(this).prev('label');
      self._$currentBtns = $('.cms-media-chooser-upload-label');
      self.updateUploadBtns(self._$currentBtn, self._$currentBtns);
      // update preview in media manager with base64 data
      self.updatePreviewImage($previewImg, file);
      // upload image
      fileBtn.prop('disabled', true);
      self.uploadImage(e, file);
      fileBtn.prop('disabled', false);
    });
  },

  updatePreviewImage: function ($previewImg, file){
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      $previewImg.attr('src', reader.result)
    }, false);
    if (file) reader.readAsDataURL(file);
  },

  uploadImage: function (e, file){
    var formData = new FormData(this);
    formData.append('image', file, file.name);
    //prevent redirect and do ajax upload
    e.preventDefault();
    ajax.create('POST', 'upload.php');
    self.setImageUploadEventHandlers();
    ajax.send(formData);
  },

  updateUploadBtns: function(btn, btns){
      btn.addClass('cms-media-chooser-upload-label-uploading');
      btns.css('pointer-events', 'none');
  },

  setImageUploadEventHandlers: function () {
    var btn = self._$currentBtn,
        btns = self._$currentBtns;
    
    var onProgressHandler = function (e) {
      var ratio = Math.floor((e.loaded / e.total) * 100) + '%';
      btn.html('Uploading '+ratio);
    }
    var onSuccessHandler = function (){
      self.updateImgOnPage();
      btn.html('Upload image');
      btn.removeClass('cms-media-chooser-upload-label-uploading');
      btns.css('pointer-events', 'all');
    }
    var onErrorHandler = function (){
      btn.html('Upload error');
      btn.addClass('cms-media-chooser-upload-label-uploading-error');
    }

    ajax.onProgress(onProgressHandler);
    ajax.onFinish(onSuccessHandler, onErrorHandler);
  },

  updateImgOnPage: function(){
    // add img to src or srcset in main page
    var imgToUpdate = $(self._currentImage),
        $imgToUpdate = $(imgToUpdate),
        srcImgToUpdate = $imgToUpdate.children('img, source').eq(self._currentImgSrcElem)[0],
        srcAttr = 'srcset';

    if (!srcImgToUpdate) srcImgToUpdate = $imgToUpdate.children('source').eq(self._currentImgSrcElem);
    if (!srcImgToUpdate) srcImgToUpdate = $imgToUpdate.children('img');

    if (srcImgToUpdate.tagName === 'IMG') srcAttr = 'src';
    $(srcImgToUpdate).attr(srcAttr, self._currentImgUrl);
  },

  createMediaChooser: function () {
    var mediaChooser = '<div class="cms-media-chooser">\n\
    <center><h3>Media Manager</h3>\n\
    <p>Edit the source images for this responsive image</p>\n\
    </center>\n\
    <div class="cms-media-chooser-container"></div>\n\
    <button class="cms-media-chooser-btn cms-media-chooser-close-btn">Back</button>\n\
    </div>';
    return mediaChooser;
  },

  createUploadMediaBtn: function (i) {
    var uploadMediaBtn = '\
      <form action="upload.php" method="post" class="cms-upload-form" enctype="multipart/form-data">\n\
        <label for="file-upload-'+i+'" id="file-upload-label-'+i+'" class="cms-media-chooser-upload-label">Upload image</label>\n\
        <input name="image" type="file" id="file-upload-'+i+'" class="cms-media-chooser-upload-btn"  />\n\
      </form>';
    
    return uploadMediaBtn;
  },

}
