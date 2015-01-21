'use strict';
var request = require('request');
var datas = require('./datas');

var taskOpt = datas.taskOpt;
var taskData = datas.taskData;

var host = 'http://localhost';
var postUrl = host + ':9871/producer';
var postData = taskData;
request.post({
  'url': postUrl,
  'json': true,
  'body':postData
}, function(error, response, body) {
  console.log(body);
});
