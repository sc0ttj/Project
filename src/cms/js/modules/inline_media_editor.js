var $ = require('cash-dom');
var mediaEditor;

"use strict";

module.exports = {
  init: function(){
    mediaEditor = this;
    mediaEditor.addResponsiveImageClickHandlers();
    mediaEditor.addMediaChooser();
  },

  addResponsiveImageClickHandlers: function () {
    var $imgs = $(cms.config.responsiveImageSelector).not('.cms-editable-img');
    if ($imgs.length > 0) {
      $imgs.addClass('cms-editable-img');
      $imgs.on('click', mediaEditor.onImageClickHandler);
    }
  },

  addMediaChooser: function (){
    var mediaChooserHtml = mediaEditor.createMediaChooser();
    
    $('div.cms-media-chooser').remove();
    $('body').append(mediaChooserHtml);

    mediaEditor.$mediaChooser = $('div.cms-media-chooser');
    mediaEditor.$mediaChooserContainer = mediaEditor.$mediaChooser.children('.cms-media-chooser-container');
    
    var $closeBtn = $('.cms-media-chooser-close-btn');
    $closeBtn.on('click', mediaEditor.mediaChooserCloseBtnClickHandler);
  },

  mediaChooserCloseBtnClickHandler: function (e) {
    $('.cms-menu-btn').removeClass('cms-menu-btn-white');
    $('body').css('overflow', 'auto');
    mediaEditor.$mediaChooserContainer.html('');
    mediaEditor.$mediaChooser.css('display', 'none');
  },

  onImageClickHandler: function (e) {
    var img = this,
        imgSrcElems = mediaEditor.getImgSourceElems(img),
        previewImages = [],
        previewImages = mediaEditor.createImgsFromImgSrcElems(imgSrcElems);
    
    mediaEditor.setCurrentImage(img);
    if (previewImages.length > 0) mediaEditor.showMediaChooser(previewImages);
  },

  setCurrentImage: function (img){
    mediaEditor.currentImage = img;
    var imgIsNotAnImage = (mediaEditor.currentImage.tagName != 'IMG' && mediaEditor.currentImage.tagName != 'PICTURE');
    if (imgIsNotAnImage){
      mediaEditor.currentImage = $(img).find('picture, img');
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
    mediaEditor.$mediaChooser.css('display', 'block');

    // for each preview image src file
    previewImages.forEach(function (imgHtml, i){
      var imgHeaderTxt  = $(imgHtml).data('name'),
          uploadMediaBtn = mediaEditor.createUploadMediaBtn(i),
          imageHeaderHtml = '<p class="cms-media-chooser-image-title">' + imgHeaderTxt + '</p>';
      
      //build image list
      if (imgHeaderTxt) mediaEditor.$mediaChooserContainer.append(imageHeaderHtml);
      mediaEditor.$mediaChooserContainer.append(imgHtml);
      mediaEditor.$mediaChooserContainer.append(uploadMediaBtn);

      // setup file input and image preview
      var $fileBtn = $('#file-upload-'+i);
      mediaEditor.fileBtnClickHandler($fileBtn);

      $('.cms-menu-btn').addClass('cms-menu-btn-white');
    });
  },

  fileBtnClickHandler: function (fileBtn) {
    //force upload on choosing a file
    fileBtn.on('change', function uploadBtnChangeHandler(e){
      var file = this.files[0];

      if (!file) return false;

      var filename = this.files[0].name,
          imgUrl = '/images/'+filename,
          $previewImg = $(this).parent().prev('img'),
          $previewImgId = $previewImg.attr('id'),
          imageSrcIndex = $('#'+$previewImgId).data('index');

      // set current image info
      mediaEditor.currentImgUrl = imgUrl;
      mediaEditor.currentImgSrcElem = imageSrcIndex;
      // set current upload button info
      mediaEditor.$currentBtn  = $(this).prev('label');
      mediaEditor.$currentBtns = $('.cms-media-chooser-upload-label');

      mediaEditor.updateUploadBtns(mediaEditor.$currentBtn, mediaEditor.$currentBtns);
      mediaEditor.updatePreviewImage($previewImg, file);

      // upload image
      fileBtn.prop('disabled', true);
      mediaEditor.uploadImage(e, file);
      fileBtn.prop('disabled', false);
    });
  },

  updateUploadBtns: function(btn, btns){
    btn.removeClass('cms-media-chooser-upload-label-error');
    btn.addClass('cms-media-chooser-upload-label-uploading');
    $(btn).parent().children('.cms-loader').removeClass('cms-loader-hidden');
    btns.css('pointer-events', 'none');
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
    cms.ajax.create('POST', 'upload.php');
    mediaEditor.setImageUploadEventHandlers();
    cms.ajax.send(formData);
  },

  setImageUploadEventHandlers: function () {
    var btn  = mediaEditor.$currentBtn,
        btns = mediaEditor.$currentBtns;
    
    var onProgressHandler = function (e) {
      var ratio = Math.floor((e.loaded / e.total) * 100) + '%';
      btn.html('Uploading '+ratio);
    }
    var onSuccessHandler = function (){
      mediaEditor.updateImgOnPage();
      btn.html('Upload image');
      btn.removeClass('cms-media-chooser-upload-label-uploading');
      $(btn).parent().children('.cms-loader').addClass('cms-loader-hidden');
      btns.css('pointer-events', 'all');
    }
    var onErrorHandler = function (){
      btn.html('Upload error');
      btn.addClass('cms-media-chooser-upload-label-error');
      $(btn).parent().children('.cms-loader').addClass('cms-loader-hidden');
    }

    cms.ajax.onProgress(onProgressHandler);
    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
  },

  updateImgOnPage: function(){
    // add img to src or srcset in main page
    var imgToUpdate = $(mediaEditor.currentImage),
        $imgToUpdate = $(imgToUpdate),
        srcImgToUpdate = $imgToUpdate.children('img, source').eq(mediaEditor.currentImgSrcElem)[0],
        srcAttr = 'srcset';

    if (!srcImgToUpdate) srcImgToUpdate = $imgToUpdate.children('source').eq(mediaEditor.currentImgSrcElem);
    if (!srcImgToUpdate) srcImgToUpdate = $imgToUpdate.children('img');

    if (srcImgToUpdate.tagName === 'IMG') srcAttr = 'src';
    $(srcImgToUpdate).attr(srcAttr, mediaEditor.currentImgUrl);
  },

  createMediaChooser: function () {
    var mediaChooser = '<div class="cms-media-chooser">\n\
      <div class="cms-media-chooser-header">\n\
        <button class="cms-media-chooser-btn cms-media-chooser-close-btn">Back</button>\n\
        <center><h3>Media Manager</h3>\n\
        </center>\n\
      </div>\n\
      <div class="cms-media-chooser-container"></div>\n\
      \n\
    </div>';
    return mediaChooser;
  },

  createUploadMediaBtn: function (i) {
    var uploadMediaBtn = '\
      <form id="cms-upload-form-'+i+'" action="upload.php" method="post" class="cms-upload-form cms-upload-form-'+i+'" enctype="multipart/form-data">\n\
        <div class="cms-loader cms-loader-hidden"></div>\n\
        <label for="file-upload-'+i+'" id="file-upload-label-'+i+'" class="cms-media-chooser-upload-label">Upload image</label>\n\
        <input name="image" type="file" id="file-upload-'+i+'" class="cms-media-chooser-upload-btn"  />\n\
      </form>';
    
    return uploadMediaBtn;
  },

}
