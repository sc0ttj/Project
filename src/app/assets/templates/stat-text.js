// console.log(app.cutsTheMustard());

var statText = function(){
  var elem = $('.stat-text');
  var elemWatcher = scrollMonitor.create(elem);

  elem.addClass('transition transparent');

  elemWatcher.fullyEnterViewport(function() {
    elem.removeClass('transparent');
  });

  elemWatcher.exitViewport(function() {
    elem.addClass('transparent');
  });
}


statText();