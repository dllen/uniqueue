var lineReader = require('line-reader');
var producer = require('./tests_multi').producer;

lineReader.eachLine('data.csv', function(line, last) {
  var json = JSON.parse(line);
  producer([json], function(err, data){
  	console.log(err, data);
  });
});