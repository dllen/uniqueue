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
    var tube = req.body['queue_name'] || 'sms';
    var tasks = req.body['tasks'];
    var data;
    if (tasks) { data = JSON.parse(tasks); }
    else { 
        data =[
            {taskUrl:'http://localhost:9876/api/consumer/weixin', priority:0, sendTime:0, timeout:60, retry:0, data:{to:'bob', msg:'新年快乐1'}},
            {taskUrl:'http://localhost:9876/api/consumer/sms', priority:0, sendTime:0, timeout:60, retry:0, data:{to:'tom', msg:'新年快乐1'}},
            {taskUrl:'http://localhost:9876/api/consumer/sms', priority:0, sendTime:0, timeout:60, retry:0, data:{to:'tom', msg:'新年快乐2'}},
            {taskUrl:'http://localhost:9876/api/consumer/weixin', priority:0, sendTime:0, timeout:60, retry:0, data:{to:'bob', msg:'新年快乐2'}},
            {taskUrl:'http://localhost:9876/api/consumer/weixin', priority:0, sendTime:0, timeout:60, retry:0, data:{to:'bob', msg:'新年快乐3'}}
        ] 
    }
    async.waterfall([
	        function(next){
	            connect(next);
	        },
	        function(result, next){
	            client.use(tube, next);
	        },
	        function(tubename, next){
	            async.map(data, function(item, cb){
                    var priority = item.priority || 0;
                    var delay = item.sendTime - new Date().getTime() / 1000;
                    delay = delay > 0 ? delay : 0;
                    var ttr = 60;
	               client.put(priority, delay, ttr, JSON.stringify(item), cb);
	            },next);
	        }
        ], function(err, result){
            if(err){
            	res.json({ret:0, message:'添加失败！'})
            }else{
            	res.json(result);
            }
    });
    
};


module.exports = router;
