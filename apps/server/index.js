
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var async = require('async');
var fivebeans = require('fivebeans');
var config = require('../../config/config');
var beanstalkd = config.get("beanstalkd");
var client = null;

var config = require('../../config/config');
var queues = config.get("queues");

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

var server_stat = function(callback){
	var tubes = Object.keys(queues);
	console.log('##tubes:', tubes);
	async.mapSeries(tubes, function(item, cb){
		client.stats_tube(item, cb);
	},function(err, result){
		console.log('##server_stat:', err, result);
        callback(err, result);
    });
};

/* GET home page. */
router.get('/', function(req, res) {
	async.waterfall([
			function(next){
				connect(next);
			},
			function(result, next){
				server_stat(next);
			}
		],function(err, result){
			res.json(result);
		}
	);
});




module.exports = router;