// # video_manager.js

// This CMS module loads up a Video Manager when a user clicks on a video in the page (index.html). 
// Users can replace any video using the video manager - click the upload 
// button below the source file you want to change, and choose a new file.


// Clickable videos are the ones the CMS can find using the `videoSelector` 
// option in the [CMS config](https://github.com/sc0ttj/Project/blob/master/src/cms/js/cms.js#L20-L102).

// Users can then upload and replace any videos that they have clicked in the page.

// The Video Manager will show all source videos, and each can be replaced with a new 
// uploaded video.  
// You can also replace the poster image with a new image.

// ## Begin script

// Get our JS dependencies
var $ = require('cash-dom');

// Create a persistent self reference to use across all module mthods
var self;

// Use strict setting
"use strict";

// Define the CommonJS module
module.exports = {

  // ## Module Methods

  // ### init()
  // Makes this module available globally as cms.fileManager,  
  // then adds click handlers to all videos that the CMS can find
  init: function(){
    self = this;
    self.addVideoClickHandlers();
  },

  // ### addVideoClickHandlers()
  //Get all videos on the page and assign a function to execute when they're clicked.
  addVideoClickHandlers: function () {
    var $videos = $(cms.config.videoSelector);
    $videos.off('click', self.videoClickHandler);
    if ($videos.length > 0) {
      $videos.addClass('cms-editable-video');
      $videos.on('click',  self.videoClickHandler);
    }
  },

  // ### videoClickHandler()
  // Get the source files for the clicked video, create form fields from those 
  // source files, then pass those form fields to the `showUI()` function.  
  // This is the function that is assigned to videos on the page. 
  // This function is executed when videos are clicked.
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

  // ### getVideoSourceElems()
  // Returns the source elements of the clicked video as an HTML Collection.
  //  
  // @param `video` - the video element that was clicked  
  // @return `videoSourceElems` - an HTML Collection of `<source>` and `<img>` elems.  
  getVideoSourceElems: function (video) {
    var videoSourceElems = $(video).children('source, img');
    return videoSourceElems;
  },

  // ### createFieldsFromVideoSrcElems()
  // Take an HTML Collection of the `<source>` and `<img>` elems associated 
  // with the clicked image, then builds and returns these elems as form fields, 
  // as an array of HTML strings.
  //  
  // @param  `videoSrcElems` - an HTML Collection of the `<source>`  and `<img>` elems within a `<video>` elem  
  // @return `fields`        - an array form fields, each as a string of HTML
  createFieldsFromVideoSrcElems: function (videoSrcElems) {
    if (videoSrcElems.length < 1) return '';
    var fields = [];
    /* create html for each src elem */
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

  // ### showUI()
  // Create the Video Manager modal popup contents, then show the modal, 
  // and add the event handler functions to the upload buttons.
  //  
  // @param `sourceInputFields` - array of HTML strings (each item is a form field)
  showUI: function (sourceInputFields) {
    var modalContent = '';
    /* for each video source src file */
    sourceInputFields.forEach(function (formItem, i){
      var headerTxt        = $(formItem).data('type'),
          tagName          = $(formItem)[0].tagName,
          uploadBtn        = self.createUploadBtn(i),
          uploadPosterBtn  = self.createUploadPosterBtn(i),
          headerHtml       = '<p class="cms-modal-title">' + headerTxt + '</p>';
      
      /* build file list */
      if (headerTxt) modalContent += headerHtml;
      modalContent += formItem;

      if (tagName === 'IMG')   modalContent += uploadPosterBtn;
      if (tagName === 'INPUT') modalContent += uploadBtn;
    });

    /* load modal */
    cms.modal.create({
      title: 'Video Manager',
      contents: modalContent
    });
    cms.modal.show();

    /* add event handlers for input buttons */
    var $fileBtns = $('.cms-modal-upload-btn');
    $fileBtns.each(function (fileBtn){
      var $fileBtn = $(fileBtn);
      self.fileBtnClickHandler($fileBtn);
    });

    /* add handler for uplaod poster btn */
    self.posterImgBtnClickHandler($('.cms-modal-upload-poster-btn'));
  },

  // ### fileBtnClickHandler()
  // Get the file chosen to be uploaded, get its attributes, then 
  // set the chosen file as  the current file to work on, 
  // then update the upload buttons and finally upload the chosen file.
  //  
  // @param `$fileBtn` - cashJS object, the button to assign the event handler
  fileBtnClickHandler: function ($fileBtn) {
    /* force upload on choosing a file */
    $fileBtn.on('change', function uploadBtnChangeHandler(e){
      var file = this.files[0];

      if (!file) return false;

      /* 
       * set the filename and URL of the file to upload, then  
       * get the video source index - this tells us which source file 
       * is being updated (0, 1, etc) */
      var filename = this.files[0].name,
          videoUrl = 'videos/'+filename,
          $input   = $(this).parent().prev('input'),
          $inputId = $input.attr('id'),
          videoSrcIndex = $('#'+$inputId).data('index');

      /* set current file info, make available to all methods */
      self.currentVideoUrl = videoUrl;
      self.currentSrcElem = videoSrcIndex;
      
      /* set current upload button info */
      self.$currentBtn  = $(this).prev('label');
      self.$currentBtns = $('.cms-modal-upload-label');

      /* update the buttons, cancel other buttons, show upload progress in 
       * the currently focused button */
      self.updateUploadBtns(self.$currentBtn, self.$currentBtns);

      /* upload the file */
      $fileBtn.prop('disabled', true);
      self.uploadFile(e, file);
      $fileBtn.prop('disabled', false);
    });
  },

  // ### updateUploadBtns()
  // Update the buttons during upload - disabled all buttons except the 
  // currently focused button, adds spinner to focused button
  //  
  // @param `$btn` - cashJS object, the current upload button 
  // (the one that was clicked)  
  // @param `$btns` - HTML Collection, all the upload buttons
  updateUploadBtns: function($btn, $btns){
    $btn.removeClass('cms-modal-upload-label-error');
    $btn.addClass('cms-modal-upload-label-uploading');
    $($btn).parent().children('.cms-loader').removeClass('cms-loader-hidden');
    $btns.css('pointer-events', 'none');
  },

  // ### uploadFile()
  // Upload the video - POST the video file to the server side
  uploadFile: function (e, file){
    var formData = new FormData(this);
    formData.append('video', file, file.name);
    /* prevent redirect and do ajax upload */
    e.preventDefault();
    cms.ajax.create('POST', cms.config.api.upload);
    self.setUploadEventHandlers();
    cms.ajax.send(formData);
  },

  // ### setUploadEventHandlers()
  // Add the onProgress, onSuccess and onError event handlers to the 
  // upload event. The onProgress handler displays the upload progress as a %, 
  // the onSuccess handler will update the video HTML on the page, and then reset 
  // the upload buttons.
  setUploadEventHandlers: function () {
    var btn  = self.$currentBtn,
        btns = self.$currentBtns;
    
    var onProgressHandler = function (e) {
      var ratio = Math.floor((e.loaded / e.total) * 100) + '%';
      btn.html('Uploading '+ratio);
    }

    var onSuccessHandler = function (responseText){
      console.log(responseText);
      /* update the video that was clicked on the page */ 
      self.updateVideoOnPage();
      /* update the form input value for the changed source elem  */
      $('#video-source-' + self.currentSrcElem).val(self.currentVideoUrl);
      /* reset the buttons */
      btn.html('Upload video');
      btn.removeClass('cms-modal-upload-label-uploading');
      $(btn).parent().children('.cms-loader').addClass('cms-loader-hidden');
      btns.css('pointer-events', 'all');
    }

    var onErrorHandler = function (responseText){
      console.log(responseText);
      /* reset the buttons */
      btn.html('Upload error');
      btn.addClass('cms-modal-upload-label-error');
      $(btn).parent().children('.cms-loader').addClass('cms-loader-hidden');
    }

    cms.ajax.onProgress(onProgressHandler);
    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
  },

  // ### updateVideoOnPage()
  // Get the video that we're editing in the page as a cashJS object, then 
  // get the specific `<source>` element to change, and finally update the 
  // video source elem with the URL of the newly uploaded video.
  updateVideoOnPage: function(){
    /* add img to src or srcset in main page */
    var videoToUpdate    = $(self.currentVideo),
        $videoToUpdate   = $(videoToUpdate),
        srcVideoToUpdate = $videoToUpdate.children('source').eq(self.currentSrcElem)[0];

    /* if we didn't find a <source> elem, look again for a lone one */
    if (!srcVideoToUpdate) srcVideoToUpdate = $videoToUpdate.children('source').eq(self.currentSrcElem);
    
    /* update the elem with the URL of the newly uploaded video */
    $(srcVideoToUpdate).attr('src', self.currentVideoUrl);
  },


  // ### posterImgBtnClickHandler()
  // 
  // Get the file chosen to be uploaded, get its attributes, then 
  // set the chosen file as  the current file to work on, 
  // then update the upload buttons and finally upload the chosen file.
  //  
  // @param `$posterImgBtn` - cashJS object, the button to assign the event handler
  posterImgBtnClickHandler: function ($posterImgBtn) {
    /* force upload on choosing a file */
    $posterImgBtn.on('change', function uploadBtnChangeHandler(e){
      var file = this.files[0];

      if (!file) return false;

      /* 
       * set the filename and URL of the file to upload, then  
       * get the image source index - this tells us which source file 
       * is being updated (0, 1, etc) */
      var filename      = this.files[0].name,
          imgUrl        = 'images/'+filename,
          $previewImg   = $(this).parent().prev('img'),
          $previewImgId = $previewImg.attr('id'),
          imageSrcIndex = $('#'+$previewImgId).data('index');

      /* set current image info */
      self.currentImgUrl = imgUrl;
      self.currentImgSrcElem = imageSrcIndex;
      
      /* set current upload button info */
      self.$currentBtn  = $(this).prev('label');
      self.$currentBtns = $('.cms-modal-upload-label');

      /* update the buttons, cancel other buttons, show upload progress in 
       * the currently focused button */
      self.updateUploadBtns(self.$currentBtn, self.$currentBtns);
      
      /* update the image in the Video Manager with the new one */
      self.updatePreviewImage($previewImg, file);

      /* upload image */
      $posterImgBtn.prop('disabled', true);
      self.uploadImage(e, file);
      $posterImgBtn.prop('disabled', false);
    });
  },

  // ### updatePreviewImage()
  // Updates the poster image shown in the Video Manager
  //  
  // @param `$previewImg` - a cashJS object of the poster image in the Video Manager  
  // @param `file` - the file to be uploaded (the one chosen by the user after clicking 
  // the upload button)  
  updatePreviewImage: function ($previewImg, file){
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      $previewImg.attr('src', reader.result)
    }, false);
    if (file) reader.readAsDataURL(file);
  },

  // ### uploadImage()
  // Uplaods in image to the server
  uploadImage: function (e, file){
    var formData = new FormData(this);
    formData.append('image', file, file.name);
    /* prevent redirect and do ajax upload */
    e.preventDefault();
    cms.ajax.create('POST', cms.config.api.upload);
    self.setImageUploadEventHandlers();
    cms.ajax.send(formData);
  },

  // ### setImageUploadEventHandlers()
  // Set the functions and events for image upload Success, Error and 
  // Progress events. On image upload success, the poster image on the main 
  // page itself is updated, and the uplaod buttons are reset to their 
  // default state.
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

  // ### updateposterImage()
  // Update the poster image (on the main page) of the video clicked
  updateposterImage: function(){
    var $imgToUpdate = $(self.currentVideo).children('img');

    $imgToUpdate.attr('src', self.currentImgUrl);
    $(self.currentVideo).attr('poster', self.currentImgUrl);
  },

  // ### createUploadBtn()
  // Returns an HTML string of a video upload button
  //  
  // @param  `i`         - an index that will give the button a unique ID  
  // @return `uploadBtn` - a string of HTML defining an upload form, with an 
  // input of type 'file'.
  createUploadBtn: function (i) {
    var uploadBtn = '\
      <form id="cms-upload-form-'+i+'" action="/api/upload.php" method="post" class="cms-upload-form cms-upload-form-'+i+'" enctype="multipart/form-data">\n\
        <div class="cms-loader cms-loader-hidden"></div>\n\
        <label for="file-upload-'+i+'" id="file-upload-label-'+i+'" class="cms-modal-upload-label">Upload a video</label>\n\
        <input name="video" type="file" id="file-upload-'+i+'" class="cms-modal-upload-btn"  />\n\
      </form>';
    
    return uploadBtn;
  },

  // ### createUploadPosterBtn()
  // Returns an HTML string of a form containing an upload button (input type file).
  //  
  // @param  `i`         - an index that will give the button a unique ID  
  // @return `uploadBtn` - a string of HTML defining an upload form, with an 
  // input of type 'file'.
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
