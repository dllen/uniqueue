"use strict";
// url "http://host:port/weixin", //向此url发送任务（比如 向某人发送一条模板信息）

var taskOpt = {
  "pluginType": "weixin",
  "template_id": "xxxxxxx", //模板的id
  "topcolor": "xxxxxxx", //模板头部的颜色
  "ACCESS_TOKEN": "xxxxxxx",
  "squeneLength": 100, //并行执行队列的任务数
  "timeout": 4000, //重试的时间
  "timeN": 5, //重试的次数
  "successURL": "http://host:port/xxx" //执行成功后向此url post执行信息
};

var taskData = {
  "queueName": "tube",
  "ToUserName": "xxx", //用户的openid
  "delay": 0, //信息延迟的时间，可以不写
  "priority": 12, //优先级
  "datas": [{
    "first": {
      "value": "恭喜你购买成功！",
      "color": "#173177"
    },
    "keynote1": {
      "value": "巧克力",
      "color": "#173177"
    },
    "keynote2": {
      "value": "39.8元",
      "color": "#173177"
    },
    "keynote3": {
      "value": "2014年9月16日",
      "color": "#173177"
    },
    "remark": {
      "value": "欢迎再次购买！",
      "color": "#173177"
    }
  }, {
    "info": {
      "first": {
        "value": "恭喜你购买成功！",
        "color": "#173177"
      },
      "keynote1": {
        "value": "巧克力",
        "color": "#173177"
      },
      "keynote2": {
        "value": "39.8元",
        "color": "#173177"
      },
      "keynote3": {
        "value": "2014年9月16日",
        "color": "#173177"
      },
      "remark": {
        "value": "欢迎再次购买！",
        "color": "#173177"
      }
    }
  }]
}; //任务列表（task按照具体需求而定）

module.exports = {
  "taskOpt": taskOpt,
  "taskData": taskData
};
