// console.log(app.cutsTheMustard());

var start = $('.scrollmation-start');
var text = $('.scrollmation-text');
var end = $('.scrollmation-end');
var container = $('.scrollmation-container');

var startWatcher = scrollMonitor.create(start);
var textWatcher = scrollMonitor.create(text);
var endWatcher = scrollMonitor.create(end);

container.css('background-position', 'top');

startWatcher.enterViewport(function() {
  container.css('background-attachment', 'scroll');
});

textWatcher.fullyEnterViewport(function() {
  container.css('background-position', 'top');
  container.css('background-attachment', 'fixed');
});

endWatcher.enterViewport(function() {
    container.css('background-position', 'bottom');
    container.css('background-attachment', 'scroll');
});

