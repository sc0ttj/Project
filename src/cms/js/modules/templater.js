module.exports = {
  
  init: function (){
    console.log('templater initialised');
  },

  render: function(elem, data){
    Transparency.render(elem, data);
  },

  getTmplFile: function(file, callback){
      var theFile = new XMLHttpRequest();
      theFile.overrideMimeType("application/text");
      theFile.open("GET", 'cms/templates/' + file + '.tmpl', true);
      theFile.onreadystatechange = function(){
        if (theFile.readyState === 4 && theFile.status == "200") {
          callback(theFile.responseText);
        }
      }
      theFile.send(null);
  }

}