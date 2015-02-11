var producer = require('./tests_multi').producer;
var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader('data.csv');

lr.on('error', function (err) {
    console.log(err);
});

var counter = 0;
var index = 0;
var len = 100;
var payloads = new Array(len);
lr.on('line', function (line) {
	if(!line) return;
   	counter++;
   	index = (counter - 1) % len;
   	//console.log('###counter:', counter, index);
   	payloads[index] = JSON.parse(line);
   	if(index === len -1){
   		lr.pause();
   		console.log('###pause:', counter, index);
   		producer(payloads, function(err, data){
   			console.log(err, data);
		  	lr.resume();
   			console.log('###resume:', counter, index);
		});
   	}
});

lr.on('end', function () {
    if(index < len - 1){
   		producer(payloads.slice(0, index+1), function(err, data){
   			console.log(err, data);
		});
    }
});