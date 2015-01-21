'use strict';
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var express = require('express');
var router = express.Router();
router.use(bodyParser.json());
var async = require('async');
var fivebeans = require('fivebeans');
var config = require('../../config/config');
var beanstalkd = config.get("beanstalkd");
var client = null;

client = new fivebeans.client(beanstalkd.host, beanstalkd.port);
client
  .on('connect', function() {
    console.log('connect');
  })
  .on('error', function(err) {
    console.log('error', err);
  })
  .on('close', function() {
    console.log('close');
  })
  .connect();

// var connect = function(callback) {

//   client = new fivebeans.client(beanstalkd.host, beanstalkd.port);
//   client
//     .on('connect', function() {
//       callback(null, null);
//     })
//     .on('error', function(err) {
//       console.log(err);
//       callback('error');
//     })
//     .on('close', function() {
//       console.log('close');
//       callback('close');
//     })
//     .connect();
// };

router.route('/')
  .get(function(req, res) {
    producing(req, res);
  })
  .post(function(req, res) {
    producing(req, res);
  });

var producing = function(req, res) {
  var body = req.body;
  var tube = body.queueName || 'weixin';
  var datas = body.datas || ['a', 'b', 'c', 'd'];
  var delay = body.delay || 0;
  var priority = body.priority || 2;

  async.waterfall([
    function(next) {
      client.use(tube, function(e, tubeName) {
        if (e) {
          console.log('连接tube出错：', err);
          return;
        }
        next();
      });
    },
    function(next) {
      async.map(datas, function(item, cb) {
        client.put(priority, delay, 60, item, cb);
      }, next);
    }
  ], function(err, result) {
    if (err) {
      res.json({
        ret: 0,
        message: '添加失败！'
      })
    } else {
      res.json(result);
    }
  });
};


module.exports = router;
