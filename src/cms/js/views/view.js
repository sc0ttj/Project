module.exports = {

  init: function () {
    console.log('view initialised by controller');
    $('body').addClass('with-js');
  },

  clickOn: function(elem){
    $(elem).on('click', function(){
      console.log(elem + ' was clicked');
    });
  }

};