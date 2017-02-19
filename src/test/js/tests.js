// This module returns the array "tests" as soon as it is required.
// It is required by test_runner.js

module.exports = (function returnTests(){

  var tests = []; // the list of tests to return to test_runner

  /**
   * Helper funcs: test, describe, assert, expect
  */

    // creates the list of tests to return
    var test = function (name, cb) {
      tests.push({name: name, test: cb});
    };
    // alternative cmd
    var describe = test;

    // World's smallest assertion library @snuggsi (https://twitter.com/snuggsi/status/565531862895169536):
    var assert = function (condition, message) {
      if (!condition) {
        console.log('   ✘ '+message);
        throw new Error(message);
      }
      console.log('   ✔ '+message);
    };
    
    // alternative syntax
    var expect = function (message, condition) {
      assert(condition, message);
    };


  /**
   * Create tests here
   */
  test('page has valid HTML', function(done){
    expect('page <head> count to be more than zero', $('head').length > 0);
    expect('page <body> count to be more than zero', $('body').length > 0);
    expect('<body> has class "cms-html5"', $('body').hasClass('cms-html5') > 0);
    done();
  });
  

  test('page has 1 section', function(done){
    expect('page to have 1 section', $('.section').length === 1);
    done();
  });
  

  test('page has a CMS menu', function(done){
    expect('page to have 1 CMS menu button', $('.cms-menu-btn').length === 1);
    expect('CMS menu button to be visible', $('.cms-menu-btn').hasClass('cms-hidden') === false);
    done();
  });
  

  test('the CMS menu is hidden', function(done){
    expect('CMS menu is hidden on page load', $('.cms-menu').hasClass('cms-ui-hidden') === true);
    done();
  });
  

  test('show CMS menu', function(done){
    cms.ui.showMenu();
    expect('CMS menu to be visible', $('.cms-menu').hasClass('cms-ui-hidden') === false);
    done();
  });
  

  test('hide CMS menu', function(done){
    cms.ui.hideMenu();
    expect('CMS menu to be hidden', $('.cms-menu').hasClass('cms-ui-hidden') === true);
    done();
  });

  //Logout test should go here ... need to moc the cms/api/ stuff in test dir

  test('show the file manager', function(done){
    cms.fileManager.showUI();
    expect('the File Manager header to be visible', $('.cms-modal-viewport').hasClass('cms-modal-file-manager') === true);
    done();
  });
  

  test('show the META manager', function(done){
    cms.metaManager.showUI();
    expect('the META Manager header to be visible', $('.cms-meta-form')[0].length > 0);
    done();
  });
  

  test('show the Translation manager', function(done){
    cms.translationManager.showUI();
    expect('the Translation manager heading to be visible', $('.cms-modal-header')[0].innerText == 'Manage Translations');
    done();
  });
  

  test('show the Preview manager', function(done){
    cms.previewManager.showUI();
    expect('the Preview Manager header to be visible', $('.cms-modal-viewport').hasClass('cms-modal-viewport-previewer'));
    done();
  });
  

  test('the preview window resizes to given dimensions', function(done){
    var oldHeight, height;
    cms.previewManager.showUI();
    // get viewport height
    oldHeight = $('#pagePreview')[0].width;
    // resize it
    $('.cms-iframe-resizer-btn')[0].click();
    // get new height
    height = $('#pagePreview')[0].height;
    expect('height of iframe #pagePreview should have changed', oldHeight !== height);
    done();
  });
  

  test('the CMS shows the Section Manager', function(done){
    cms.sectionManager.showUI();
    assert($('.cms-modal-header')[0].innerText == 'Section Manager', 'the Section Manager should be visible');
    done();
  });
  

  test('the CMS adds a section', function(done){
    cms.sectionManager.showUI();
    cms.sectionManager.getTemplateFromFile('_article-full-width.tmpl');
    setTimeout(function asyncAssert(){
      assert($('.section').length == 2, 'the CMS should have 2 sections');
      done();
    }, 400);
  });
  

  test('the CMS adds an inline image', function(done){
    mediaBtnClickHandler($('.section2 p')[0]);
    expect('page added one inline-image', $('.section2 .inline-image').length === 1);
    expect('inline-image is not inside paragraph', $('.section2 p .inline-image').length === 0);
    expect('inline-image is inside editable-region', $('.section2 div.cms-editable-region img.inline-image').length === 1);
    done();
  });
  

  test('the CMS moves a section up', function(done){
    $('.cms-menu-item-icon-up')[1].click();
    assert($('.section1 .article-full-width').length > 0, 'the CMS should move a section up');
    done();
  });
  

  test('the CMS moves a section down', function(done){
    $('.cms-menu-item-icon-down')[0].click();
    assert($('.section2 .article-full-width').length > 0, 'the CMS should move a section down');
    done();
  });
  

  test('the CMS deletes a section', function(done){
    $('.cms-menu-item-icon-delete')[1].click();
    assert($('body .article-full-width').length === 0, 'the CMS should delete a section');
    done();
  });
  

  test('clicking images shows Image Manager', function(done){
    $('.hero-center picture')[0].click();
    assert($('.cms-modal-header')[0].innerText == 'Image Manager', 'images should be clickable and show Image Manager');
    done();
  });
  

  test('clicking video shows Video Manager', function(done){
    cms.sectionManager.showUI();
    cms.sectionManager.getTemplateFromFile('_video-full-width.tmpl');
    setTimeout(function asyncAssert(){
      $('video')[0].click();
      assert($('.cms-modal-header')[0].innerText == 'Video Manager', 'videos should be clickable and show Video Manager');
      done();
    }, 400);
  });
  

  // add more tests here



  // we have our tests, return them to test_runner.js
  return tests;

  /**
   * Examples below
  */

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

  /* Example tests, using expect() */

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