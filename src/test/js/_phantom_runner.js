// this file is called when user runs `npm test`
// based on https://gist.github.com/kennyu/3699039

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

// phantomJS will run each function in "steps" array
var steps = [
  //Load Login Page
  function() {
    page.open(liveURL);
     var html = document.querySelector('html');
     console.log(html);
     console.log(document.title);
  },
  //Enter Credentials
  function() {
    page.evaluate(function() {
      document.querySelector('input[type="password"]').value = "demo";
    });
  }, 
  //Login
  function() {
    page.evaluate(function() {
      document.querySelector('input[type="submit"]').click();
    });
  },
  //Run tests
  function() {
    // we're at the homepage again, this time logged in,
    // so tests will now run (without this func, phantomJS 
    // doesn't re-visit the page once logged in)
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