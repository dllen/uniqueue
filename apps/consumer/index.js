var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

router.post('/success', function(req, res) {
  console.log(req.body); 
  // 模拟处理时间为1s
  // add code here
  setTimeout(function(){
  	  res.json({'ret':0});
  }, 1000);

});

router.post('/fail', function(req, res) {
  console.log(req.body);
  // 模拟错误返回  
  res.json({'ret':1});
});


router.post('/timeout', function(req, res) {
  console.log(req.body); 
  // 模拟处理时间为1s
  setTimeout(function(){
      res.json({'ret':0});
  }, 1000 * 999);

});

module.exports = router;