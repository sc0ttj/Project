/**
 * A Javascript test runner in 20 lines of code
 * From http://joakimbeng.eu01.aws.af.cm/a-javascript-test-runner-in-20-lines/
 * and https://gist.github.com/joakimbeng/8f57dae814a4802e2ae6
 */
(function testRunner() {
  // The test queue:
  // get tests from separate file
  var tests = require('tests');

  // Function to add tests:
  this.beforeAll = function () {
    console.log('Running tests...');
  };

  // Function to add tests:
  this.afterAll = function () {
    console.log('Tests finished...')
  };

  this.beforeEach = function () {
    cms.ui.hideMenu();
  };

  this.afterEach = function () {
    $('.cms-modal').remove();
  };

  // the run function: will go through all tests
  this.run = function run () {
    var i = 0, testToRun;
    
    (function next (err) {
      // setup before each test
      this.beforeEach();
      // Log status for last test run:
      if (testToRun) console[err ? 'error' : 'log'](err ? '✘' : '✔', testToRun.name);
      // Abort if last test failed or out of tests:
      if (err || !(testToRun = tests[i++])) return done(err);
      //teardown after each test
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

// Run all tests:
run();
