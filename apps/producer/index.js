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
    var tube = req.body['queue_name'] || 'weixin';
    var data = req.body['data'];
    if (data) { data = JSON.parse(data); }
    else { data =['a', 'b', 'c'] }
    async.waterfall([
	        function(next){
	            connect(next);
	        },
	        function(result, next){
	            client.use(tube, next);
	        },
	        function(tubename, next){
	            async.map(data, function(item, cb){
	               client.put(0, 0, 60, item, cb);
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
