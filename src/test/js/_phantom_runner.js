// # Phantom Runner

//This file runs our tests (see [tests.js](https://github.com/sc0ttj/Project/blob/master/src/test/js/tests.js])) in the terminal.   
//To execute this file, run `npm test` in your terminal.    

//This file is based on https://gist.github.com/kennyu/3699039

// Begin... Create the loading msg.
console.log("\nLoading PhantomJS.. Then tests will begin..");

// Set URL to go to.
var liveURL = "http://localhost:8080/demo/index.html";

// Create the page object we will evaulate.
var page = require('webpage').create(), testindex = 0, loadInProgress = false;

// Enable logging to node console/linux term/CI term
page.onConsoleMessage = function(msg) {
  console.log(msg);
};

// Set events for the page we created
page.onLoadStarted = function() {
  loadInProgress = true;
};

page.onLoadFinished = function() {
  loadInProgress = false;
};

page.onPageLoaded = function() {
  console.log(document.title);
};

// PhantomJS will run each function in "steps" array
var steps = [
  /* Load Login Page */
  function() {
    page.open(liveURL);
  },
  /* Enter Credentials */
  function() {
    page.evaluate(function() {
      var html = document.querySelector('html');
      console.log(html.innerHTML);
      console.log(document.title);
    });
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

// Run the steps we defined in the 'steps' array.
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
