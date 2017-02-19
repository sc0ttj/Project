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
    console.log('Running tests..');
  };

  // Function to add tests:
  this.afterAll = function () {
  };

  this.beforeEach = function (testToRun) {
    // show test title/scenario
    if (testToRun) console.log('\nScenario: '+testToRun.name);
    // reset page
    cms.ui.hideMenu();
  };

  this.afterEach = function (testToRun) {
    $('.cms-modal').remove();
  };

  // the run function: will go through all tests
  this.run = function run () {
    var i = 0, testToRun;
    
    (function next (err) {
      // Abort if last test failed or out of tests:
      if (err || !(testToRun = tests[i++])) return done(err);
      //teardown after each test
      this.afterEach(testToRun);
      // setup before each test
      this.beforeEach(testToRun);
      // Run test:
      try {
        testToRun.test.call(testToRun.test, next);
      } catch (err) {
        next(err);
      }
    })();
    
    function done (err) {
      console.log('\n');
      // Show remaining tests as skipped:
      tests.slice(i).map(function showSkippedTest(skippedTest) { console.log('skipped:', skippedTest.name); });
      // We're finished:
      console.log('\n');
      console[err ? 'error' : 'log']('Tests ' + (err ? 'failed ✘: "'+err.toString().substring(7)+'"\n\n' + err.stack : 'succeeded ✔'));
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
