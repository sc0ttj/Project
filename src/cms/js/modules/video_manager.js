var $ = require('cash-dom');
var self;

"use strict";

module.exports = {
  init: function(){
    self = this;
    self.addVideoClickHandlers();
  },

  addVideoClickHandlers: function () {
    var $videos = $(cms.config.videoSelector);
    $videos.off('click', self.videoClickHandler);
    if ($videos.length > 0) {
      $videos.addClass('cms-editable-video');
      $videos.on('click',  self.videoClickHandler);
    }
  },

  videoClickHandler: function (e) {
    var video = this,
        videoSrcElems   = self.getVideoSourceElems(video),
        sourceInputFields = [],
        sourceInputFields = self.createFieldsFromVideoSrcElems(videoSrcElems);

    if (sourceInputFields.length > 0) {
      self.currentVideo = video;
      self.showUI(sourceInputFields);
    }
  },

  getVideoSourceElems: function (video) {
    var videoSourceElems = $(video).children('source, img');
    return videoSourceElems;
  },

  createFieldsFromVideoSrcElems: function (videoSrcElems) {
    if (videoSrcElems.length < 1) return '';
    var fields = [];
    // create html for each src elem
    for (var i=0; i < videoSrcElems.length; i++){
      var $source  = $(videoSrcElems[i]),
          tag      = videoSrcElems[i].tagName,
          type     = $source.attr('type'),
          src      = $source.attr('src');

      if (tag === 'IMG'){
        fields[i] = '<img class="cms-modal-input" id="video-poster" src="' + src + '" />';
      } else {
        fields[i] = '<input class="cms-modal-input" id="video-source-' + i + '" data-type="'+type+'" data-index="'+i+'" value="' + src + '" />';
      }
    }
    return fields;
  },

  showUI: function (sourceInputFields) {
    var modalContent = '';
    // for each video source src file
    sourceInputFields.forEach(function (formItem, i){
      var headerTxt        = $(formItem).data('type'),
          tagName          = $(formItem)[0].tagName,
          uploadBtn        = self.createUploadBtn(i),
          uploadPosterBtn  = self.createUploadPosterBtn(i),
          headerHtml       = '<p class="cms-modal-title">' + headerTxt + '</p>';
      
      //build file list
      if (headerTxt) modalContent += headerHtml;
      modalContent += formItem;

      if (tagName === 'IMG')   modalContent += uploadPosterBtn;
      if (tagName === 'INPUT') modalContent += uploadBtn;
    });

    // load modal
    cms.modal.create({
      title: 'Video Manager',
      contents: modalContent
    });
    cms.modal.show();

    // add event handlers for input buttons
    var $fileBtns = $('.cms-modal-upload-btn');
    $fileBtns.each(function (fileBtn){
      var $fileBtn = $(fileBtn);
      self.fileBtnClickHandler($fileBtn);
    });

    // add handler for uplaod poster btn
    self.posterImgBtnClickHandler($('.cms-modal-upload-poster-btn'));
  },

  fileBtnClickHandler: function (fileBtn) {
    //force upload on choosing a file
    fileBtn.on('change', function uploadBtnChangeHandler(e){
      var file = this.files[0];

      if (!file) return false;

      var filename = this.files[0].name,
          videoUrl = 'videos/'+filename,
          $input   = $(this).parent().prev('input'),
          $inputId = $input.attr('id'),
          videoSrcIndex = $('#'+$inputId).data('index');

      // set current file info
      self.currentVideoUrl = videoUrl;
      self.currentSrcElem = videoSrcIndex;
      // set current upload button info
      self.$currentBtn  = $(this).prev('label');
      self.$currentBtns = $('.cms-modal-upload-label');

      self.updateUploadBtns(self.$currentBtn, self.$currentBtns);

      // upload the file
      fileBtn.prop('disabled', true);
      self.uploadFile(e, file);
      fileBtn.prop('disabled', false);
    });
  },

  updateUploadBtns: function(btn, btns){
    btn.removeClass('cms-modal-upload-label-error');
    btn.addClass('cms-modal-upload-label-uploading');
    $(btn).parent().children('.cms-loader').removeClass('cms-loader-hidden');
    btns.css('pointer-events', 'none');
  },

  uploadFile: function (e, file){
    var formData = new FormData(this);
    formData.append('video', file, file.name);
    //prevent redirect and do ajax upload
    e.preventDefault();
    cms.ajax.create('POST', 'cms/api/upload.php');
    self.setUploadEventHandlers();
    cms.ajax.send(formData);
  },

  setUploadEventHandlers: function () {
    var btn  = self.$currentBtn,
        btns = self.$currentBtns;
    
    var onProgressHandler = function (e) {
      var ratio = Math.floor((e.loaded / e.total) * 100) + '%';
      btn.html('Uploading '+ratio);
    }
    var onSuccessHandler = function (responseText){
      console.log(responseText);
      self.updateVideoOnPage();
      $('#video-source-' + self.currentSrcElem).val(self.currentVideoUrl);
      btn.html('Upload video');
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

  updateVideoOnPage: function(){
    // add img to src or srcset in main page
    var videoToUpdate = $(self.currentVideo),
        $videoToUpdate = $(videoToUpdate),
        srcVideoToUpdate = $videoToUpdate.children('source').eq(self.currentSrcElem)[0];

    if (!srcVideoToUpdate) srcVideoToUpdate = $videoToUpdate.children('source').eq(self.currentSrcElem);
    $(srcVideoToUpdate).attr('src', self.currentVideoUrl);
  },


  posterImgBtnClickHandler: function (posterImgBtn) {
    //force upload on choosing a file
    posterImgBtn.on('change', function uploadBtnChangeHandler(e){
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
      posterImgBtn.prop('disabled', true);
      self.uploadImage(e, file);
      posterImgBtn.prop('disabled', false);
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
    cms.ajax.create('POST', 'cms/api/upload.php');
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
      self.updateposterImage();
      btn.html('Upload poster image');
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

  updateposterImage: function(){
    var $imgToUpdate = $(self.currentVideo).children('img');

    $imgToUpdate.attr('src', self.currentImgUrl);
    $(self.currentVideo).attr('poster', self.currentImgUrl);
  },

  createUploadBtn: function (i) {
    var uploadBtn = '\
      <form id="cms-upload-form-'+i+'" action="/api/upload.php" method="post" class="cms-upload-form cms-upload-form-'+i+'" enctype="multipart/form-data">\n\
        <div class="cms-loader cms-loader-hidden"></div>\n\
        <label for="file-upload-'+i+'" id="file-upload-label-'+i+'" class="cms-modal-upload-label">Upload a video</label>\n\
        <input name="video" type="file" id="file-upload-'+i+'" class="cms-modal-upload-btn"  />\n\
      </form>';
    
    return uploadBtn;
  },

  createUploadPosterBtn: function (i) {
    var uploadBtn = '\
      <form id="cms-upload-form-'+i+'" action="/api/upload.php" method="post" class="cms-upload-form cms-upload-form-'+i+'" enctype="multipart/form-data">\n\
        <div class="cms-loader cms-loader-hidden"></div>\n\
        <label for="file-upload-'+i+'" id="file-upload-label-'+i+'" class="cms-modal-upload-label">Upload poster image</label>\n\
        <input name="image" type="file" id="file-upload-'+i+'" class="cms-modal-upload-poster-btn"  />\n\
      </form>';
    
    return uploadBtn;
  },

}
