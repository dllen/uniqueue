var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var request = require('request');
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

router.post('/test_weixin_tpl_msg', function(req, res) {
  console.log(req.body); 
  var tpl_data = JSON.parse(req.body['data']);
  var options = {
    uri: 'http://wx.sephora.cn/index.php?g=CustomWap&m=Bindcard&a=bond&token=ulstbc1414854920',
    method: 'POST',
    json: {
      'open_id': req.body['open_id'],
      'template_id': req.body['template_id'],
      'url': req.body['url'],
      'data': tpl_data
    }
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('###执行成功');
      res.json({'ret':0});
    } else {
      console.log('###执行失败');
      res.json({'ret':1});
    }
  });
});

module.exports = router;