# Phantom Runner

This file runs our tests (see [tests.js](https://github.com/sc0ttj/Project/blob/master/src/test/js/tests.js])) in the terminal.   
To execute this file, run `npm test` in your terminal.    

This file is based on https://gist.github.com/kennyu/3699039

Begin... Create the loading msg.
```js
console.log("\nLoading PhantomJS.. Then tests will begin..");

```
Set URL to go to.
```js
var liveURL = "http://localhost:8080/demo/index.html";

```
Create the page object we will evaulate.
```js
var page = require('webpage').create(), testindex = 0, loadInProgress = false;

```
Enable logging to node console/linux term/CI term
```js
page.onConsoleMessage = function(msg) {
  console.log(msg);
};

```
Set events for the page we created
```js
page.onLoadStarted = function() {
  loadInProgress = true;
};

page.onLoadFinished = function() {
  loadInProgress = false;
};

page.onPageLoaded = function() {
  console.log(document.title);
}

```
PhantomJS will run each function in "steps" array
```js
var steps = [
  /* Load Login Page */
  function() {
    page.open(liveURL);
  },
  /* Enter Credentials */
  function() {
    page.evaluate(function() {
      document.querySelector('input[type="password"]').value = "demo";
    });
  }, 
  /* Login */
  function() {
    page.evaluate(function() {
      document.querySelector('input[type="submit"]').click();
    });
  },
  /* Run tests */
  function() {
    /*
     * we're at the homepage again, this time logged in,
     * so tests will now run (without this func, phantomJS 
     * doesn't re-visit the page once logged in)
     */
  }
];

```
Run the steps we defined in the 'steps' array.
```js
interval = setInterval(function() {

  if (!loadInProgress && typeof steps[testindex] == "function") {
    steps[testindex]();
    testindex++;
  }

  /* if no more functions (steps) to run, exit */
  if (typeof steps[testindex] != "function") {
    page.evaluate(function() { 
      console.log('\nPhantomJS Exiting..');
    });
    phantom.exit();
  }

}, 2000);
```
------------------------
Generated _Mon Mar 20 2017 18:57:57 GMT+0000 (GMT)_ from [&#x24C8; _phantom_runner.js](_phantom_runner.js "View in source")

