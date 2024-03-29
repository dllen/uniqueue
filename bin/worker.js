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
			},
			function(result, next){
				client.use(queue_name, next);
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
	var params;
	async.waterfall([
			function(next){
				client.reserve(next);
			},
			function(jobid, jobdata, next){
				console.log('####', jobid, jobdata.toString());
				jid = jobid;
				params = JSON.parse(jobdata.toString());
				work(params, next);
			},
		],
		function(err, result){
			if(err && params && jid){
				// 处理失败
				client.destroy(jid, function(err){
					if (!err && params.retry > 0){
						var priority = params.priority || 9999;
	                    var delay = 3;
	                    var ttr = (params.timeout || 60) + 60;
	                    params['retry'] -= 1;
		                client.put(priority, 3, ttr, JSON.stringify(params), function(){
		                	return reserve();
		                });
					} else{
						return reserve();
					}
				});
			} else if(jid) {
				client.destroy(jid, function(){
					return reserve();
				}); // 异步执行
			} else{
				return reserve();
			}
		}
	);
};

var work = function(params, callback){
	var url = params.taskUrl;
	var options = {
      uri: url,
      method: 'POST',
      json: params.payload,
      timeout: (params.timeout || 60) * 1000
    };
    console.log(options);
	request.post(options, function(error,response,body){
		console.log(error, body);
		if (!error && response.statusCode == 200) {
		    if (body && (body.ret === 0 || body.errcode === 0)){
		    	return callback(null, null);
		    }
		}

		return callback('调用' + url + params + '失败', null);
		}
	);
};

main();