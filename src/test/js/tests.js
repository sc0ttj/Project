//# Tests.js

// This file returns the array "tests" as soon as it is required.
// It is required by [test_runner.js](https://github.com/sc0ttj/Project/blob/master/src/test/js/test_runner.js)

// define the module as a self executing func, 
// so it runs as soon as it is required 
module.exports = (function returnTests(){

  // define the list of tests to return to test_runner
  var tests = []; 

    // #### test(name, cb)
    // creates the list (array) of tests to return:

    // @param name - the name of the test       
    // @param cb   - the test function to run
    var test = function (name, cb) {
      tests.push({name: name, test: cb});
    };

    // Use an alternative command
    var describe = test;

    // #### assert(condition, message)
    /* Based on "World's smallest assertion library" by @snuggsi 
     * (https://twitter.com/snuggsi/status/565531862895169536)
     */
    // @param condition - the code to execute and test        
    // @param message   - the message to print on error
    var assert = function (condition, message) {
      if (!condition) {
        console.error('   ✘ '+message);
        throw new Error(message);
      }
      /* if test is run by PhantomJS, dont style the console output */
      if (/PhantomJS/.test(window.navigator.userAgent)) {
        console.log('   ✔ '+message);
      } else {
        console.log('%c   ✔ '+message, 'color: #005500;');
      }
    };
    
    // #### expect(message, condition)
    // an alternative syntax for assert:
    
    // @param condition - the code to execute and test          
    // @param message   - the message to print on error
    var expect = function (message, condition) {
      assert(condition, message);
    };


  // ## Create the tests

  // Make sure the page has the correct number of objects and classes on init
  test('page has valid HTML', function(done){
    expect('page <head> count to be more than zero', $('head').length > 0);
    expect('page <body> count to be more than zero', $('body').length > 0);
    expect('<body> has class "cms-html5"', $('body').hasClass('cms-html5') > 0);
    done();
  });
  

  // Make sure the page has only 1 section on init
  test('page has 1 section', function(done){
    expect('page to have 1 section', $('.section').length === 1);
    done();
  });
  

  // Make sure the button for the CMS menu has loaded up and is visible
  test('page has a CMS menu', function(done){
    expect('page to have 1 CMS menu button', $('.cms-menu-btn').length === 1);
    expect('CMS menu button to be visible', $('.cms-menu-btn').hasClass('cms-hidden') === false);
    done();
  });
  

  // Make sure the CMS menu itself is hidden on page load
  test('the CMS menu is hidden', function(done){
    expect('CMS menu is hidden on page load', $('.cms-menu').hasClass('cms-ui-hidden') === true);
    done();
  });
  

  // Click the menu button to show the menu
  test('show CMS menu', function(done){
    cms.ui.showMenu();
    expect('CMS menu to be visible', $('.cms-menu').hasClass('cms-ui-hidden') === false);
    done();
  });
  

  // Click the button again to hide the menu
  test('hide CMS menu', function(done){
    cms.ui.hideMenu();
    expect('CMS menu to be hidden', $('.cms-menu').hasClass('cms-ui-hidden') === true);
    done();
  });

  /*Logout test should go here ... need to mock the cms/api/ stuff in test dir */

  // show the file manager using the CMS menu
  test('show the file manager', function(done){
    cms.fileManager.showUI();
    expect('the File Manager header to be visible', $('.cms-modal-viewport').hasClass('cms-modal-file-manager') === true);
    done();
  });
  

  // Check the meta manager pops up OK
  test('show the META manager', function(done){
    cms.metaManager.showUI();
    expect('the META Manager header to be visible', $('.cms-meta-form')[0].length > 0);
    done();
  });
  

  // Check the translation manager pops up OK
  test('show the Translation manager', function(done){
    cms.translationManager.showUI();
    expect('the Translation manager heading to be visible', $('.cms-modal-header')[0].innerText == 'Manage Translations');
    done();
  });
  

  // Check the preview manager pops up OK
  test('show the Preview manager', function(done){
    cms.previewManager.showUI();
    expect('the Preview Manager header to be visible', $('.cms-modal-viewport').hasClass('cms-modal-viewport-previewer'));
    done();
  });
  

  // Check the preview manager iframe window can be resized
  test('the preview window resizes to given dimensions', function(done){
    var oldHeight, height;
    cms.previewManager.showUI();
    /* get viewport height */
    oldHeight = $('#pagePreview')[0].width;
    /* resize it */
    $('.cms-iframe-resizer-btn')[0].click();
    /* get new height */
    height = $('#pagePreview')[0].height;
    expect('height of iframe #pagePreview should have changed', oldHeight !== height);
    done();
  });
  

  // check the section manager pops up OK
  test('the CMS shows the Section Manager', function(done){
    cms.sectionManager.showUI();
    assert($('.cms-modal-header')[0].innerText == 'Section Manager', 'the Section Manager should be visible');
    done();
  });
  

  // add a section to the page
  test('the CMS adds a section', function(done){
    cms.sectionManager.showUI();
    cms.sectionManager.getTemplateFromFile('_article-full-width.tmpl');
    setTimeout(function asyncAssert(){
      assert($('.section').length == 2, 'the CMS should have 2 sections');
      done();
    }, 400);
  });
  

  // add an inline image and make sure it appears in the correct place
  test('the CMS adds an inline image', function(done){
    mediaBtnClickHandler($('.section2 p')[0]);
    expect('page added one inline-image', $('.section2 .inline-image').length === 1);
    expect('inline-image is not inside paragraph', $('.section2 p .inline-image').length === 0);
    expect('inline-image is inside editable-region', $('.section2 div.cms-editable-region img.inline-image').length === 1);
    done();
  });
  

  // move a section up the page
  test('the CMS moves a section up', function(done){
    $('.cms-menu-item-icon-up')[1].click();
    assert($('.section1 .article-full-width').length > 0, 'the CMS should move a section up');
    done();
  });
  

  // move a section down the page
  test('the CMS moves a section down', function(done){
    $('.cms-menu-item-icon-down')[0].click();
    assert($('.section2 .article-full-width').length > 0, 'the CMS should move a section down');
    done();
  });
  

  // delete a section
  test('the CMS deletes a section', function(done){
    $('.cms-menu-item-icon-delete')[1].click();
    assert($('body .article-full-width').length === 0, 'the CMS should delete a section');
    done();
  });
  

  // check the image manager pops up OK
  test('clicking images shows Image Manager', function(done){
    $('.hero-center picture')[0].click();
    assert($('.cms-modal-header')[0].innerText == 'Image Manager', 'images should be clickable and show Image Manager');
    done();
  });
  

  // check the video manager pops up OK
  test('clicking video shows Video Manager', function(done){
    cms.sectionManager.showUI();
    cms.sectionManager.getTemplateFromFile('_video-full-width.tmpl');
    setTimeout(function asyncAssert(){
      $('video')[0].click();
      assert($('.cms-modal-header')[0].innerText == 'Video Manager', 'videos should be clickable and show Video Manager');
      done();
    }, 400);
  });
  

  /* add more tests here */

  // we have our tests, return them to test_runner.js and exit this script
  return tests;

  //  
  // Examples tests below

  // Example tests, using assert()
  /* normal test */
  test('1+1 equals 2', function runTest(done) {
    assert(1+1 === 2, '1+1 should be 2');
    done();
  });
  /* async test */
  test('1+1 equals 2', function runTest(done) {
    setTimeout(function asyncAssert(){
      assert(1+1 === 2, '1+1 should be 2');
      done();
    }, 400);
  });

  // Example tests, using expect()
  /* normal test */
  test('1+1 = 2', function runTest(done) {
    expect('1+1 to equal 2', 1+1 === 2);
    done();
  });
  /* async test */
  test('1+1 = 2', function runTest(done) {
    setTimeout(function asyncExpect(){
      expect('1+1 to equal 2', 1+1 === 2);
      done();
    }, 400);
  });


})();
