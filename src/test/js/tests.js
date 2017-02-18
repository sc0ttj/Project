// this module will simply return array "tests" as soon as it is required
// .. it will be required by test runner
module.exports = (function returnTests(){

  var tests = []; // the list of tests to return to test_runner

  // World's smallest assertion library by @snuggsi (https://twitter.com/snuggsi/status/565531862895169536): 
  function assert (condition, message) {
    if (!condition) {
      console.log('   ✘ '+message);
      throw new Error(message);
    }
    console.log('   ✔ '+message);
  };

  // alternative syntax
  function expect (message, condition) {
    if (!condition) {
      console.log('   ✘ '+message);
      throw new Error(message);
    }
    console.log('   ✔ '+message);
  };

  // creates the list of tests to return
  function test (name, cb) {
    tests.push({name: name, test: cb});
  };

  // // Example tests, using assert()

  // /* normal test */
  // test('1+1 equals 2', function runTest(done) {
  //   assert(1+1 === 2, '1+1 should be 2');
  //   done();
  // });

  // /* async test */
  // test('1+1 equals 2', function runTest(done) {
  //   setTimeout(function asyncAssert(){
  //     assert(1+1 === 2, '1+1 should be 2');
  //     done();
  //   }, 400);
  // });

  // /* Example tests, using expect() */

  // /* normal test */
  // test('1+1 = 2', function runTest(done) {
  //   expect('1+1 to equal 2', 1+1 === 2);
  //   done();
  // });

  // /* async test */
  // test('1+1 = 2', function runTest(done) {
  //   setTimeout(function asyncExpect(){
  //     expect('1+1 to equal 2', 1+1 === 2);
  //     done();
  //   }, 400);
  // });

  /**
   * Create tests here
   */

  
  test('page has valid HTML', function runTest__pageLoaded(done) {
    expect('page <head> count to be more than zero', $('head').length > 0);
    expect('page <body> count to be more than zero', $('body').length > 0);
    expect('<body> has class "cms-html5"', $('body').hasClass('cms-html5') > 0);
    done();
  });

  
  test('page has 1 section', function runTest__pageHasSection(done) {
    expect('page to have 1 section', $('.section').length === 1);
    done();
  });

  
  test('page has a CMS menu', function runTest__pageHasCMSMenu(done) {
    expect('page to have 1 CMS menu button', $('.cms-menu-btn').length === 1);
    expect('CMS menu button to be visible', $('.cms-menu-btn').hasClass('cms-hidden') === false);
    done();
  });

  
  test('the CMS menu is hidden', function runTest__CMSMenuIsHidden(done) {
    expect('CMS menu is hidden on page load', $('.cms-menu').hasClass('cms-ui-hidden') === true);
    done();
  });

  
  test('show CMS menu', function runTest__showMenu(done) {
    cms.ui.showMenu();
    expect('CMS menu to be visible"', $('.cms-menu').hasClass('cms-ui-hidden') === false);
    done();
  });

  
  test('hide CMS menu', function runTest__hideMenu(done) {
    cms.ui.hideMenu();
    expect('CMS menu to be hidden', $('.cms-menu').hasClass('cms-ui-hidden') === true);
    done();
  });


  //Logout test should go here ... need to moc the cms/api/ stuff in test dir

  
  test('show the file manager', function runTest__showFileManager(done) {
    cms.fileManager.showUI();
    expect('the File Manager header to be visible', $('.cms-modal-viewport').hasClass('cms-modal-file-manager') === true);
    done();
  });

  
  test('show the META manager', function runTest__showMetaManager(done) {
    cms.metaManager.showUI();
    expect('the META Manager header to be visible', $('.cms-meta-form')[0].length > 0);
    done();
  });

  
  test('show the Translation manager', function runTest__showTranslationManager(done) {
    cms.translationManager.showUI();
    expect('the Translation manager heading to be visible', $('.cms-modal-header')[0].innerText == 'Manage Translations');
    done();
  });

  
  test('show the Preview manager', function runTest__showPreviewManager(done) {
    cms.previewManager.showUI();
    expect('the Preview Manager header to be visible', $('.cms-modal-viewport').hasClass('cms-modal-viewport-previewer'));
    done();
  });

  
  test('the preview window resizes to given dimensions', function runTest__resizePreviewViewport(done) {
    var oldHeight, height;
    cms.previewManager.showUI();
    // get viewport height
    oldHeight = $('#pagePreview')[0].width;
    // resize it
    $('.cms-iframe-resizer-btn')[0].click();
    // get new height
    height = $('#pagePreview')[0].height;
    expect('the iframe height to have changed', oldHeight !== height);
    done();
  });

  
  test('the CMS shows the Section Manager', function runTest__showSectionManager(done) {
    cms.sectionManager.showUI();
    assert($('.cms-modal-header')[0].innerText == 'Section Manager', 'the Section Manager should be visible');
    done();
  });

  
  test('the CMS adds a section', function runTest__addSection(done) {
    cms.sectionManager.showUI();
    cms.sectionManager.getTemplateFromFile('_article-full-width.tmpl');
    setTimeout(function asyncAssert(){
      assert($('.section').length == 2, 'the CMS should have 2 sections');
      done();
    }, 400);
  });

  
  test('the CMS adds a inline images', function runTest__addInlineImage(done) {
    mediaBtnClickHandler($('.section2 p')[0]);
    assert($('.section2 .inline-image').length > 0, 'the CMS should have 1 inline image');
    done();
  });

  
  test('the CMS moves a section up', function runTest__moveSectionUp(done) {
    $('.cms-menu-item-icon-up')[1].click();
    assert($('.section1 .article-full-width').length > 0, 'the CMS should move a section up');
    done();
  });

  
  test('the CMS moves a section down', function runTest__moveSectionDown(done) {
    $('.cms-menu-item-icon-down')[0].click();
    assert($('.section2 .article-full-width').length > 0, 'the CMS should move a section down');
    done();
  });

  
  test('the CMS deletes a section', function runTest__deleteSection(done) {
    $('.cms-menu-item-icon-delete')[1].click();
    assert($('body .article-full-width').length === 0, 'the CMS should delete a section');
    done();
  });

  
  test('clicking images shows Image Manager', function runTest__showImageManager(done) {
    $('.hero-center picture')[0].click();
    assert($('.cms-modal-header')[0].innerText == 'Image Manager', 'images should be clickable and show Image Manager');
    done();
  });

  
  test('clicking video shows Video Manager', function runTest__showVideoManager(done) {
    cms.sectionManager.showUI();
    cms.sectionManager.getTemplateFromFile('_video-full-width.tmpl');
    setTimeout(function asyncAssert(){
      $('video')[0].click();
      assert($('.cms-modal-header')[0].innerText == 'Video Manager', 'videos should be clickable and show Video Manager');
      done();
    }, 400);
  });

  


  // more tests here




  return tests;

})();