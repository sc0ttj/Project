// to do: accept config file
// get json data from files

var init = function(){

  var fs = require('fs');
  var mustache = require('mustache');
  var templates = fs.readdirSync('src/app/templates/');

  // to do: get from json file!
  var data = {
  "title": "Page Hero Title",
  "subtitle" : "A description of the page"
}

  templates.forEach(
    function(file) {
      var template = fs.readFileSync('src/app/templates/' + file, 'utf8');
      var html = mustache.to_html(template, data);
      var outputFile = file.replace(/\.[^/.]+$/, ".html");
      writeToFile(html, 'src/app/assets/' + outputFile);
    }
  );

  function writeToFile(data, file){
    // console.log(file);
    fs.writeFile(file, data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log('PreCompile: Saved template to "' + file +  '".');
    }); 
  }

}

module.exports = init();