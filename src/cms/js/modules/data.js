module.exports = {
  get: function(file){
    var data = require('data/' + file + '.json');
    return  data;
  },
}