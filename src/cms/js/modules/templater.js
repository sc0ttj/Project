module.exports = {
  
  init: function (){
    console.log('templater initialised');
  },

  render: function(elem, data){
    Transparency.render(elem, data);
  },

  //http://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript
  getJsonFile: function(file, callback){
      var theFile = new XMLHttpRequest();
      theFile.overrideMimeType("application/json");
      theFile.open("GET", 'cms/templates/models/' + file + '.json', true);
      theFile.onreadystatechange = function(){
        if (theFile.readyState === 4 && theFile.status == "200") {
          callback(theFile.responseText);
        }
      }
      theFile.send(null);
  }

}