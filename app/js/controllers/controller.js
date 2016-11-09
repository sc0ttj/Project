var controller = function (){

  function init () {
    console.log('controller initialised');
    setEvents();
    view.init();
  }
  
  function setEvents(){
    makeHeaderClickable();
  }

  function makeHeaderClickable () {
    view.clickOn('h2');
  }

  return {
    init: init
  }

}();