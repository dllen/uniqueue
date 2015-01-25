var argv = require('optimist')
    .usage('Usage: $0 -q [str]')
    .demand(['q'])
    .argv;
var async = require('async');
var request = require('request');
var fivebeans = require('fivebeans');
var config = require('../config/config');
var beanstalkd = config.get("beanstalkd");
var queue_name = argv.q.trim(); // trim blank
var queueConf = config.get("queues")[queue_name];

var client = new fivebeans.client(beanstalkd.host, beanstalkd.port);

var main = function(){
	async.waterfall([
			function(next){
				connect(next);
			},
			function(result, next){
				client.watch(queue_name, next);
			}
		], 
		function(err, result){
			reserve();
		}
	);
};

var connect = function(callback){
	client
    .on('connect', function()
    {
        callback(null, null);
    })
    .on('error', function(err)
    {
        callback('error');   
    })
    .on('close', function()
    {
        callback('close');  
    })
    .connect();
};

var reserve = function(){
	var jid;
	async.waterfall([
			function(next){
				client.reserve(next);
			},
			function(jobid, payload, next){
				console.log('####', jobid, payload.toString());
				jid = jobid;
				work(payload.toString(), next);
			},
		],
		function(err, result){
			if(err){
				//if(jid) client.release(jid, 0, 1, function(){}); // 异步执行
				if(jid) client.destroy(jid, function(){}); // 异步执行
			} else {
				if(jid) client.destroy(jid, function(){}); // 异步执行
			}
			reserve();
		}
	);
};

var work = function(data, callback){
	console.log('####data=', data);
	var params = JSON.parse(data);
	var url = params.taskUrl;
	request.post({url: params.taskUrl, form: params.data}, function(error,response,body){
		if (!error && response.statusCode == 200) {
			try {
				res = JSON.parse(body);
			}catch (e) {
				return callback('调用' + url + data + '失败', null);
			}
		    if (res.ret === 0){
		    	return callback(null, null);
		    }
		}

		return callback('调用' + url + data + '失败', null);
		}
	);
};

main();