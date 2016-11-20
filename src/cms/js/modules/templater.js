module.exports = {
  
  init: function (){
    console.log('templater initialised');
  },

  setLayoutInElem: function(template, data){
    console.log(template, data);
    Transparency.render(document.getElementById('template'), data);
  }
}