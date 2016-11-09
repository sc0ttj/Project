var view = function (){

  function init () {
    console.log('view initialised by controller');
    $('body').addClass('with-js');
  }

  function clickOn(elem){
    $(elem).on('click', function(){
      console.log(elem + ' was clicked');
    });
  }

  return {
    init: init,
    clickOn: clickOn
  }

}();