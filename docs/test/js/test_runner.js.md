# Test Runner

This test runner is included in [_cms_script.tmpl](https://github.com/sc0ttj/Project/blob/master/src/app/templates/_cms-script.tmpl) if the CMS  
was (re)built using `npm test` or `npm start`

```js
/**
 * Sources: A Javascript test runner in 20 lines of code
 * From http://joakimbeng.eu01.aws.af.cm/a-javascript-test-runner-in-20-lines/
 * and https://gist.github.com/joakimbeng/8f57dae814a4802e2ae6
 */

```
## Main function: testRunner()
```js
(function testRunner() {

```
We get our tests array from separate file.
See [tests.js](https://github.com/sc0ttj/Project/blob/master/src/test/js/tests.js)
```js
  var tests = require('tests');

```
## Test Runner Methods

#### beforeAll(): before any tests have started
```js
  this.beforeAll = function () {
    console.log('Running tests..');
  };

```
#### afterAll(): after all tests have finished
- hide the menu and 
- remove any sections we added
- then reload the cms menu etc
```js
  this.afterAll = function () {
    cms.ui.hideMenu();
    while($('.section').length > 1){
      $('.section').last().remove();
    }
    cms.reload();
  };

```
#### beforeEach(): before each test
- show test title/scenario, 
- then reset page
```js
  this.beforeEach = function (testToRun) {
    if (testToRun) console.log('\nScenario: '+testToRun.name);
    cms.ui.hideMenu();
  };

```
#### afterEach(): after each test
- remove any CMS modals from the page
```js
  this.afterEach = function (testToRun) {
    $('.cms-modal').remove();
  };

```
#### run(): go through tests array and run all tests:

This function will loop through all tests and:

1. run beforeAll() to setup before any tests start
2. run beforeEach() to create setup before each test
3. run current test in the queue: call the test, run it, if error, exit and print errors, else go to next test
4. abort if last test failed or out of tests
5. teardown stuff after each test
```js
  this.run = function run () {
    var i = 0, testToRun;
    
    beforeAll();

    (function next (err) {
      this.afterEach(testToRun);
      if (err || !(testToRun = tests[i++])) return done(err);
      this.beforeEach(testToRun);
      try {
        testToRun.test.call(testToRun.test, next);
      } catch (err) {
        next(err);
      }
    })();
    
```
#### done(): prints the error to console or terminal
@param err: the error produced by a try/catch

This func will:
- Show remaining tests as skipped,
- print final output,
- do clean up or teardown after all tests
```js
    function done (err) {
      console.log('\n');
      tests.slice(i).map(function showSkippedTest(skippedTest) { console.log('skipped:', skippedTest.name); });
      console.log('\n');
      console[err ? 'error' : 'log']('Tests ' + (err ? 'failed ✘: "'+err.toString().substring(7)+'"\n\n' + err.stack : 'succeeded ✔'));
      this.afterAll();
    }
  };

})();

```
All functions now defined.. We're ready..

So let's run the test runner:
```js
run();

```
------------------------
Generated _Mon Mar 20 2017 18:57:57 GMT+0000 (GMT)_ from [&#x24C8; test_runner.js](test_runner.js "View in source")

