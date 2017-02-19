// based on https://gist.github.com/kennyu/3699039

//clear screen
// console.log('\x1Bc');
// loading msg
console.log("\nLoading PhantomJS.. Then tests will begin..");


//set URL to go to
var liveURL = "http://localhost:8080/demo/index.html";
// create a page
var page = require('webpage').create(), testindex = 0, loadInProgress = false;


// Phantom Events

page.onConsoleMessage = function(msg) {
  // enable logging to node console/linux term/CI term
  console.log(msg);
};

page.onLoadStarted = function() {
  loadInProgress = true;
};

page.onLoadFinished = function() {
  loadInProgress = false;
};

page.onPageLoaded = function() {
  // so we know where we browse to
  console.log(document.title);
}


// steps to do once loaded and logged in
var steps = [
  function() {
    //Load Login Page
    page.open(liveURL);
    console.log(document.title);
  },
  function() {
    //Enter Credentials
    page.evaluate(function() {
      document.querySelector('input[type="password"]').value = "demo";
    });
  }, 
  function() {
    //Login
    page.evaluate(function() {
      document.querySelector('input[type="submit"]').click();
    });
  },
  function() {
    //go to index.html, the unit tests will log to console (and also to stdout)
    var page = require('webpage').create(), testindex = 0, loadInProgress = false;
    var usingPhantom = true;
    page.open(liveURL);
  }
];


interval = setInterval(function() {

  if (!loadInProgress && typeof steps[testindex] == "function") {
    steps[testindex]();
    testindex++;
  }

  if (typeof steps[testindex] != "function") {
    page.evaluate(function() { 
      console.log('\nPhantomJS Exiting..');
    });
    phantom.exit();
  }

}, 2000);