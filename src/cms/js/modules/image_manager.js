var $ = require('cash-dom');
var self;

"use strict";

module.exports = {
  init: function(){
    self = this;
    self.addResponsiveImageClickHandlers();
  },

  addResponsiveImageClickHandlers: function () {
    var $imgs = $(cms.config.responsiveImageSelector);
    $imgs.off('click', self.onImageClickHandler);
    if ($imgs.length > 0) {
      $imgs.addClass('cms-editable-img');
      $imgs.on('click',  self.onImageClickHandler);
    }
  },

  onImageClickHandler: function (e) {
    var img = this,
        imgSrcElems   = self.getImgSourceElems(img),
        previewImages = [],
        previewImages = self.createImgsFromImgSrcElems(imgSrcElems);

    if (previewImages.length > 0) {
      self.currentImage = img;
      self.showUI(previewImages);
    }
  },

  getImgSourceElems: function (img) {
    var imgSourceElems = $(img).children('source, img');
    return imgSourceElems;
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

  showUI: function (previewImages) {
    var modalContent = '';
    // for each preview image src file
    previewImages.forEach(function (imgHtml, i){
      var imgHeaderTxt    = $(imgHtml).data('name'),
          uploadBtn       = self.createUploadBtn(i),
          imageHeaderHtml = '<p class="cms-modal-image-title">' + imgHeaderTxt + '</p>';
      
      //build image list
      if (imgHeaderTxt) modalContent += imageHeaderHtml;
      modalContent += imgHtml;
      modalContent += uploadBtn;
    });

    // load modal
    cms.modal.create({
      title: 'Image Manager',
      contents: modalContent
    });
    cms.modal.show();

    // add event handlers for input buttons
    var $fileBtns = $('.cms-modal-upload-btn');
    $fileBtns.each(function (fileBtn){
      var $fileBtn = $(fileBtn);
      self.fileBtnClickHandler($fileBtn);
    });
  },

  fileBtnClickHandler: function (fileBtn) {
    //force upload on choosing a file
    fileBtn.on('change', function uploadBtnChangeHandler(e){
      var file = this.files[0];

      if (!file) return false;

      var filename      = this.files[0].name,
          imgUrl        = 'images/'+filename,
          $previewImg   = $(this).parent().prev('img'),
          $previewImgId = $previewImg.attr('id'),
          imageSrcIndex = $('#'+$previewImgId).data('index');

      // set current image info
      self.currentImgUrl = imgUrl;
      self.currentImgSrcElem = imageSrcIndex;
      // set current upload button info
      self.$currentBtn  = $(this).prev('label');
      self.$currentBtns = $('.cms-modal-upload-label');

      self.updateUploadBtns(self.$currentBtn, self.$currentBtns);
      self.updatePreviewImage($previewImg, file);

      // upload image
      fileBtn.prop('disabled', true);
      self.uploadImage(e, file);
      fileBtn.prop('disabled', false);
    });
  },

  updateUploadBtns: function(btn, btns){
    btn.removeClass('cms-modal-upload-label-error');
    btn.addClass('cms-modal-upload-label-uploading');
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
    cms.ajax.create('POST', cms.config.api.upload);
    self.setImageUploadEventHandlers();
    cms.ajax.send(formData);
  },

  setImageUploadEventHandlers: function () {
    var btn  = self.$currentBtn,
        btns = self.$currentBtns;
    
    var onProgressHandler = function (e) {
      var ratio = Math.floor((e.loaded / e.total) * 100) + '%';
      btn.html('Uploading '+ratio);
    }
    var onSuccessHandler = function (responseText){
      console.log(responseText);
      self.updateImgOnPage();
      btn.html('Upload image');
      btn.removeClass('cms-modal-upload-label-uploading');
      $(btn).parent().children('.cms-loader').addClass('cms-loader-hidden');
      btns.css('pointer-events', 'all');
    }
    var onErrorHandler = function (responseText){
      console.log(responseText);
      btn.html('Upload error');
      btn.addClass('cms-modal-upload-label-error');
      $(btn).parent().children('.cms-loader').addClass('cms-loader-hidden');
    }

    cms.ajax.onProgress(onProgressHandler);
    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
  },

  updateImgOnPage: function(){
    // add img to src or srcset in main page
    var imgToUpdate = $(self.currentImage),
        $imgToUpdate = $(imgToUpdate),
        srcImgToUpdate = $imgToUpdate.children('img, source').eq(self.currentImgSrcElem)[0],
        srcAttr = 'srcset';

    if (!srcImgToUpdate) srcImgToUpdate = $imgToUpdate.children('source').eq(self.currentImgSrcElem);
    if (!srcImgToUpdate) srcImgToUpdate = $imgToUpdate.children('img');

    if (srcImgToUpdate.tagName === 'IMG') srcAttr = 'src';
    $(srcImgToUpdate).attr(srcAttr, self.currentImgUrl);
  },

  createUploadBtn: function (i) {
    var uploadBtn = '\
      <form id="cms-upload-form-'+i+'" action="/api/upload.php" method="post" class="cms-upload-form cms-upload-form-'+i+'" enctype="multipart/form-data">\n\
        <div class="cms-loader cms-loader-hidden"></div>\n\
        <label for="file-upload-'+i+'" id="file-upload-label-'+i+'" class="cms-modal-upload-label">Upload image</label>\n\
        <input name="image" type="file" id="file-upload-'+i+'" class="cms-modal-upload-btn"  />\n\
      </form>';
    
    return uploadBtn;
  },

}
