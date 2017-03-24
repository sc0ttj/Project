// # image_manager.js

// This CMS module loads up an Image Manager when a user clicks on an image in the page (index.html). 
// Users can replace images using the image manager - click the upload 
// button below the source file you want to change, and choose a new file.

// Clickable images are the ones the CMS can find using the `responsiveImageSelector` 
// option in the [CMS config](https://github.com/sc0ttj/Project/blob/jdi/src/cms/js/cms.js#L20-L102).

// Users can then upload and replace any images that they have clicked in the page.

// The images in the page may be responsive images 
// (see [templates](https://github.com/sc0ttj/Project/blob/master/src/app/templates/_image-center.tmpl) 
// for examples), and in this case, the Image Manager will show all source 
// images, and each can be replaced with a new uploaded image.

// ## Begin script

// Get our JS dependencies
var $ = require('cash-dom');  /* jQuery alternative */

// Create a persistent self reference to use across all module mthods
var self;

// Use strict setting
"use strict";

// Define othe CommonJS module
module.exports = {

  // ## Module Methods

  // ### init()
  // Makes this module available globally as cms.fileManager,  
  // then adds click handlers to all images the CMS can find
  init: function(){
    self = this;
    self.addResponsiveImageClickHandlers();
  },

  // ### addResponsiveImageClickHandlers()
  //Get all images on the page and assign a function to execute when they're clicked.
  addResponsiveImageClickHandlers: function () {
    var $imgs = $(cms.config.responsiveImageSelector);
    $imgs.off('click', self.onImageClickHandler);
    if ($imgs.length > 0) {
      $imgs.addClass('cms-editable-img');
      $imgs.on('click',  self.onImageClickHandler);
    }
  },

  // ### onImageClickHandler(e)
  // Get the source files for the clicked iamge, create form fields from those 
  // source files, then pass those form fields to the `showUI()` function.  
  // This is the function that is assigned to images on the page. 
  // This function is executed when images are clicked.
  //  
  // @param `e` - the event
  onImageClickHandler: function (e) {
    var img = this,
        imgSrcElems   = self.getImgSourceElems(img),
        previewImages = [],
        previewImages = self.createImgsFromImgSrcElems(imgSrcElems);

      /* if we got image srcs from <source> or <img> tags, then 
       * set the current working image to the one that 
       * was clicked, and show the Image Manager UI 
       */
      if (previewImages.length > 0) {
      self.currentImage = img;
      self.showUI(previewImages);
    }
  },

  // ### getImgSourceElems(img)
  // 
  // @param `img` - the image HTML object that was clicked  
  // @return `imgSourceElems` - an HTML Collection of the images 'src' elem(s)
  getImgSourceElems: function (img) {
    var imgSourceElems = $(img).children('source, img');
    return imgSourceElems;
  },

  // ### createImgsFromImgSrcElems(imgSrcElems)
  // Create an array of image HTML strings, from `<source>` or `<img>` tags.  
  // This method is used to create the HTML of the preview images which appear  
  // in the Image Manager.
  // 
  // @param `imgSrcElems` - an HTML Collection of `<source>` or `<img>` elems  
  // @return `images` - an array of image HTML strings  
  createImgsFromImgSrcElems: function (imgSrcElems) {
    if (imgSrcElems.length < 1) return '';
    var images = [];
    
    /* create html for each src image in imgSrcElems array */
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

  // ### showUI(previewImages)
  // Create the Image Manager modal popup contents, then show the modal, 
  // and add the event handler functions to the upload buttons.
  //  
  // @param `previewImages` - array of image HTML strings  
  showUI: function (previewImages) {
    var modalContent = '';

    /* for each preview image src file  - 
     * add a header (if data-name attr found) and 
     * add an upload button, so user can replace the image 
     */
    previewImages.forEach(function (imgHtml, i){
      var imgHeaderTxt    = $(imgHtml).data('name'),
          uploadBtn       = self.createUploadBtn(i),
          imageHeaderHtml = '<p class="cms-modal-image-title">' + imgHeaderTxt + '</p>';
      
      /* build image list */
      if (imgHeaderTxt) modalContent += imageHeaderHtml;
      modalContent += imgHtml;
      modalContent += uploadBtn;
    });

    /* load modal */
    cms.modal.create({
      title: 'Image Manager',
      contents: modalContent
    });
    cms.modal.show();

    /* add event handlers for input buttons */
    var $fileBtns = $('.cms-modal-upload-btn');
    $fileBtns.each(function (fileBtn){
      var $fileBtn = $(fileBtn);
      self.fileBtnClickHandler($fileBtn);
    });
  },

  // ### fileBtnClickHandler(fileBtn)
  // Assign an `onchange` event to the given button, which will:  
  // - check for a valid chosen file to upload  
  // - set the filename, relative URL of uploaded file  
  // - get the preview image to update, and update it  
  // - then upload the image to the server
  fileBtnClickHandler: function (fileBtn) {
    /* force upload on choosing a file */
    fileBtn.on('change', function uploadBtnChangeHandler(e){
      var file = this.files[0];

      if (!file) return false;

      /* set the filename, url, preview image */
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

      /* update the upload buttons in the UI */
      self.updateUploadBtns(self.$currentBtn, self.$currentBtns);
      /* update the preview of the image being replaced */
      self.updatePreviewImage($previewImg, file);

      /* upload the image */
      fileBtn.prop('disabled', true);
      self.uploadImage(e, file);
      fileBtn.prop('disabled', false);
    });
  },

  // ### updateUploadBtns(btn, btns)
  // Add progress info to current upload button, disable others
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

  // ### updatePreviewImage($previewImg, file)
  // Updates the preview images in the Image Manager
  //  
  // @param `$previewImg` - a cashJS object of the preview image to update  
  // @param `file` - an image file (chosen through a form upload button)
  updatePreviewImage: function ($previewImg, file){
    /* once the file data has been gathered, set the src attr of the current 
    * preview image to the image data, if the image exists */
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      $previewImg.attr('src', reader.result)
    }, false);
    if (file) reader.readAsDataURL(file);
  },

  // ### uploadImage(e, file)
  // Uploads an image file to the server.  
  //  
  // @param `e` - the event  
  // @param `file` - an image file (chosen through a form upload button)
  uploadImage: function (e, file){
    /* get data from the current form */
    var formData = new FormData(this);
    /* add the file to the form data to be POSTed */
    formData.append('image', file, file.name);
    /* prevent redirect and do ajax upload */
    e.preventDefault();
    /* set where to upload to */
    cms.ajax.create('POST', cms.config.api.upload);
    /* setup the progress info display, and success/error callbacks */
    self.setImageUploadEventHandlers();
    /* do the request */
    cms.ajax.send(formData);
  },

  // ### setImageUploadEventHandlers()
  // This functions defines the ajax and upload event handling functions  
  // so users can see progress and success/fail messages for their uploads.
  setImageUploadEventHandlers: function () {
    var btn  = self.$currentBtn,
        btns = self.$currentBtns;
    
    /* Define the handler funcs for our upload events: 
     * progress, success and error handlers.
     */
    var onProgressHandler = function (e) {
      var ratio = Math.floor((e.loaded / e.total) * 100) + '%';
      btn.html('Uploading '+ratio);
    }

    var onSuccessHandler = function (responseText){
      console.log(responseText);
      /* The upload was a success, so update the image in the page that was 
       * originally clicked with the new uploaded image. */
      self.updateImgOnPage();
      /* now reset the upload buttons */
      btn.html('Upload image');
      btn.removeClass('cms-modal-upload-label-uploading');
      $(btn).parent().children('.cms-loader').addClass('cms-loader-hidden');
      btns.css('pointer-events', 'all');
    }

    var onErrorHandler = function (responseText){
      console.log(responseText);
      /* reset buttons after upload cmpletes */
      btn.html('Upload error');
      btn.addClass('cms-modal-upload-label-error');
      $(btn).parent().children('.cms-loader').addClass('cms-loader-hidden');
    }

    /* now apply the handlers to this AJAX request */
    cms.ajax.onProgress(onProgressHandler);
    cms.ajax.onFinish(onSuccessHandler, onErrorHandler);
  },

  // ### updateImgOnPage()
  // Replace an image on the main page (index.html) with an uploaded image.  
  updateImgOnPage: function(){
    /* add img to src or srcset in main page */
    var imgToUpdate = $(self.currentImage),
        $imgToUpdate = $(imgToUpdate),
        srcImgToUpdate = $imgToUpdate.children('img, source').eq(self.currentImgSrcElem)[0],
        srcAttr = 'srcset';

    /* if the target is not a valid image element, search its children for the 
     * correct elem - makre sure we are working on a valid image elem
     */
    if (!srcImgToUpdate) srcImgToUpdate = $imgToUpdate.children('source').eq(self.currentImgSrcElem);
    if (!srcImgToUpdate) srcImgToUpdate = $imgToUpdate.children('img');

    /* We should now have a valid image elem, so set the correct  
     * attribute to update to 'src' if the elem is IMG, and leave 
     * as 'srcset' if it's not an IMG.
     */
    if (srcImgToUpdate.tagName === 'IMG') srcAttr = 'src';

    /* Now we have the correct elem and attribute, so let's
     * update the source image, and replace with our currentImgUrl
     */
    $(srcImgToUpdate).attr(srcAttr, self.currentImgUrl);
  },

  // ### createUploadBtn(i)
  // Returns an HTML string of a form with an upload button (input type file).
  // 
  // @param  `i`         - an index that will give the button a unique ID  
  // @return `uploadBtn` - an HTML form with upload button, as a string of HTML  
  createUploadBtn: function (i) {
    /* create the HTML for each upload button */
    var uploadBtn = '\
      <form id="cms-upload-form-'+i+'" action="/api/upload.php" method="post" class="cms-upload-form cms-upload-form-'+i+'" enctype="multipart/form-data">\n\
        <div class="cms-loader cms-loader-hidden"></div>\n\
        <label for="file-upload-'+i+'" id="file-upload-label-'+i+'" class="cms-modal-upload-label">Upload image</label>\n\
        <input name="image" type="file" id="file-upload-'+i+'" class="cms-modal-upload-btn"  />\n\
      </form>';
    
    return uploadBtn;
  },

}
