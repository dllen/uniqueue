var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.json({'ret':0, 'message':'任务执行成功'});
});

/* GET home page. */
router.post('/weixin', function(req, res) {
  // TODO
  // add code here for sending weixin msg  
  res.json({'ret':0});
});
/* GET home page. */
router.post('/sms', function(req, res) {
  res.json({'ret':0});
});
module.exports = router;