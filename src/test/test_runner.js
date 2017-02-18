// World's smallest assertion library by @snuggsi (https://twitter.com/snuggsi/status/565531862895169536): 
function assert (condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * A Javascript test runner in 20 lines of code
 * From http://joakimbeng.eu01.aws.af.cm/a-javascript-test-runner-in-20-lines/
 * and https://gist.github.com/joakimbeng/8f57dae814a4802e2ae6
 */
(function testRunner() {
  // The test queue:
  var tests = [];

  // Function to add tests:
  this.beforeAll = function test () {
    console.log('Running tests...');
  };

  // Function to add tests:
  this.afterAll = function test () {
    console.log('Tests finished...')
  };

  this.beforeEach = function test () {
    cms.ui.hideMenu();
  };

  this.afterEach = function test () {
    $('.cms-modal').remove();
  };

  // Function to add tests:
  this.test = function test (name, cb) {
    tests.push({name: name, test: cb});
  };

  // the run function: will go through all tests
  this.run = function run () {
    var i = 0, testToRun;
    
    (function next (err) {
      this.beforeEach();
      // Log status for last test run:
      if (testToRun) console[err ? 'error' : 'log'](err ? '✘' : '✔', testToRun.name);
      // Abort if last test failed or out of tests:
      if (err || !(testToRun = tests[i++])) return done(err);
      this.afterEach();
      // Run test:
      try {
        testToRun.test.call(testToRun.test, next);
      } catch (err) {
        next(err);
      }
    })();
    
    function done (err) {
      // Show remaining tests as skipped:
      tests.slice(i).map(function showSkippedTest(skippedTest) { console.log('-', skippedTest.name); });
      // We're finished:
      console[err ? 'error' : 'log']('\nTests ' + (err ? 'failed!\n' + err.stack : 'succeeded!'));
      this.afterAll();
    }

  };
})();



/*
* 
* Run tests
* 
*/

beforeAll();

test('page has HTML', function runTest__pageLoaded(done) {
  assert($('head, body').length > 0, 'page should not be empty');
  done();
});

test('page has 1 section', function runTest__pageHasSection(done) {
  assert($('.section').length === 1, 'page should have 1 section');
  done();
});

test('page has a CMS menu', function runTest__pageHasCMSMenu(done) {
  assert($('.cms-menu').length === 1, 'page should have a CMS menu');
  done();
});

test('the CMS menu is hidden', function runTest__CMSMenuIsHidden(done) {
  assert($('.cms-menu').hasClass('cms-ui-hidden') === true, 'the CMS menu should be hidden');
  done();
});

test('show CMS menu', function runTest__showMenu(done) {
  cms.ui.showMenu();
  assert($('.cms-menu').hasClass('cms-ui-hidden') === false, 'the menu should show');
  cms.ui.hideMenu();
  done();
});

test('hide CMS menu', function runTest__hideMenu(done) {
  cms.ui.hideMenu();
  assert($('.cms-menu').hasClass('cms-ui-hidden') === true, 'the CMS menu should hide');
  done();
});

/*
* Logout test should go here ... need to moc the cms/api/ stuff in test dir
*/

test('the CMS menu shows the file manager', function runTest__showFileManager(done) {
  cms.fileManager.showUI();
  assert($('.cms-modal-viewport').hasClass('cms-modal-file-manager') === true, 'the CMS menu should show the file manager');
  done();
});

test('the CMS menu shows the META manager', function runTest__showMetaManager(done) {
  cms.metaManager.showUI();
  assert($('.cms-meta-form')[0].length > 0, 'the CMS menu should show the META manager');
  done();
});

test('the CMS menu shows the Translation manager', function runTest__showTranslationManager(done) {
  cms.translationManager.showUI();
  assert($('.cms-modal-header')[0].innerText == 'Manage Translations', 'the CMS menu should show the Translation manager');
  done();
});

test('the CMS menu shows the Preview manager', function runTest__showPreviewManager(done) {
  cms.previewManager.showUI();
  assert($('.cms-modal-viewport').hasClass('cms-modal-viewport-previewer'), 'the CMS menu should show the Preview manager');
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
  assert(oldHeight !== height, 'the preview window should be resizable');
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

test('clicking images shows Image Manager', function runTest__deleteSection(done) {
  $('.hero-center picture')[0].click();
  assert($('.cms-modal-header')[0].innerText == 'Image Manager', 'images should be clickable and show Image Manager');
  done();
});

// Run all tests:
run();

// Example test:

// test('1+1 equals 2', function runTest(done) {
//   assert(1+1 === 2, '1+1 should be 2');
//   done();
// });

// Example async test:

// test('1+1 equals 2', function runTest(done) {
//   setTimeout(function asyncAssert(){
//     assert(1+1 === 2, '1+1 should be 2');
//     done();
//   }, 400);
// });
