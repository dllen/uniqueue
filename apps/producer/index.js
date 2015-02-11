var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var async = require('async');
var fivebeans = require('fivebeans');
var config = require('../../config/config');
var beanstalkd = config.get("beanstalkd");
var client = null;

var connect = function(callback){
	client = new fivebeans.client(beanstalkd.host, beanstalkd.port);
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

router.route('/')
.get(function(req, res) {
  producing(req,res);
})
.post(function(req, res) {
  producing(req,res);
});

var producing = function(req, res){
    console.log(req.body, req.body.tasks[0].payload);
    var data = req.body;
    var tube = data.queue_name;
    var tasks = data.tasks;
    async.waterfall([
	        function(next){
	            connect(next);
	        },
	        function(result, next){
	            client.use(tube, next);
	        },
	        function(tubename, next){
	            async.map(tasks, function(item, cb){
                    var priority = item.priority || 0;
                    var delay = parseInt((item.sendTime * 1000 - new Date().getTime()) / 1000);
                    delay = delay > 0 ? delay : 0;
                    var ttr = (item.timeout || 60) + 60; // ttr = request_timeout + 60
	                client.put(priority, delay, ttr, JSON.stringify(item), cb);
	            }, next);
	        }
        ], function(err, result){
            if(err){
                console.log('#####producing###', err, result);
            	res.json({'ret': 1, 'message':'添加失败！'})
            }else{
            	res.json({'ret': 0, 'message':'添加成功！'});
            }
    });
    
};


module.exports = router;
