
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var async = require('async');
var fivebeans = require('fivebeans');
var config = require('../../config/config');
var beanstalkd = config.get("beanstalkd");
var pm2 = require('pm2');
var config = require('../../config/config');
var nconf = require('nconf');
nconf
  .file({ file: __dirname+'/../../config/config.json' })
  .env();

var connect = function(client, callback){

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
        //callback('close');  
    })
    .connect();
};

var get_tubes = function(queues){
	var tubes = [];
	Object.keys(queues).forEach(function(item){
		if (queues[item]){tubes.push(item);}
	});
	return tubes;
};

var server_stat = function(client, callback){
	var queues = nconf.get('queues');
	var tubes = get_tubes(queues);
	console.log('##tubes:', tubes);
	async.mapSeries(tubes, function(item, cb){
		client.stats_tube(item, cb);
	},function(err, result){
		console.log('##server_stat:', err, result);
        callback(null, result);
    });
};

/* GET home page. */
router.get('/', function(req, res) {
	var beanstalkd = nconf.get('beanstalkd');
	var queues = nconf.get('queues');
	var tubes = get_tubes(queues);
	console.log('##tubes:', tubes);
	console.log('###queues', queues);
	var client = new fivebeans.client(beanstalkd.host, beanstalkd.port);
	async.auto({
		connect: function(next){
			connect(client, next);
		},
		server_stat:['connect', function(next, results){
			server_stat(client, next);
		}]

	},function(err, results){
		client.end();
		if(err){
			return res.json({ret:1});
		}
		var stats = results.server_stat;
		var data = [];
		for(var i in tubes){
			data.push({
				config: queues[tubes[i]],
				stats: stats[i]
			});
		}
		res.json({
			ret: 0,
			beanstalkd: beanstalkd,
			data: data
		});
	});
});

/* GET home page. */
var startWorker = function(args, callback){
  pm2.start(
    __dirname+'/../../bin/worker.js', 
    { name: args.queue_name, instances: args.concurrency, force:true, scriptArgs:['-q '+args.queue_name], executeCommand:true}, 
    callback
  );
};
router.post('/save', function(req, res) {
	var queue_name = req.body['queue_name'];
	var concurrency = parseInt(req.body['concurrency']);
	var args = {queue_name:queue_name, concurrency:concurrency};
	nconf.set('queues:'+queue_name, args);
	//nconf.remove(queue_name);
	async.waterfall([
		function(next){
			nconf.save(next);
		},
        function(result, next){
         	pm2.connect(next);
        }, 
		function(next){
			pm2.delete(queue_name, function(err, proc_name){
				console.log(err);
				// ignore this error
				next(null, proc_name);
			});
		},  
		function(result, next){
			console.log('###args:', args);
			startWorker(args, next);
		},
		function(result, next){
        	pm2.disconnect(next);
      	}
	],function(err, results){
	    res.json({'ret': err ? 1 : 0 });
	});
});

router.post('/add', function(req, res) {
	var queue_name = req.body['queue_name'];
	var concurrency = parseInt(req.body['concurrency']);
	var args = {queue_name:queue_name, concurrency:concurrency};
	nconf.set('queues:'+queue_name, args);
	async.waterfall([
		function(next){
			nconf.save(next);
		},
        function(result, next){
         	pm2.connect(next);
        },  
		function(next){
			console.log('####', args);
			startWorker(args, next);
		},
		function(result, next){
        	pm2.disconnect(next);
      	}
	],function(err, results){
	    res.json({'ret': err ? 1 : 0 });
	});
	
});

router.post('/stop', function(req, res) {
	var queue_name = req.body['queue_name'];
	async.waterfall([
        function(next){
         	pm2.connect(next);
        },  
		function(next){
			pm2.stop(queue_name, next);
		},
		function(result, next){
        	pm2.disconnect(next);
      	}
	],function(err, results){
	    res.json({'ret': err ? 1 : 0 });
	});
	
});

router.post('/start', function(req, res) {
	var queue_name = req.body['queue_name'];
	var args = nconf.get('queues:'+queue_name);
	async.waterfall([
		function(next){
			nconf.save(next);
		},
        function(result, next){
         	pm2.connect(next);
        },  
		function(next){
			startWorker(args, next);
		},
		function(result, next){
        	pm2.disconnect(next);
      	}
	],function(err, results){
	    res.json({'ret': err ? 1 : 0 });
	});
	
});

router.post('/delete', function(req, res) {
	var queue_name = req.body['queue_name'];
	async.waterfall([
        function(next){
         	pm2.connect(next);
        },  
		function(next){
			pm2.delete(queue_name, next);
		},
		function(result, next){
        	pm2.disconnect(next);
      	},
		function(result, next){
			nconf.set('queues:'+queue_name, undefined);
        	nconf.save(next);
      	}
	],function(err, results){
		res.json({'ret': err ? 1 : 0 });
	});
	
});

module.exports = router;