// console.log(app.cutsTheMustard());

var imageFixed = function(){
  var elem = $('.fixed-image-text');
  var elemWatcher = scrollMonitor.create(elem);

  elem.addClass('transition transparent');

  elemWatcher.fullyEnterViewport(function() {
    elem.removeClass('transparent');
  });

  elemWatcher.exitViewport(function() {
    elem.addClass('transparent');
  });
}

imageFixed();