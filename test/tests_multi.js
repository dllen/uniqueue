var request = require('request');

var generate_tasks = function (payloads) {
    var len = payloads.length;
    var tasks = new Array(len);
    for(var i in payloads){
        tasks[i] = {
            'taskUrl': 'http://localhost:1234/', //'http://wxstage.sephora.cn/index.php?g=Interface&m=Message&a=tplSend&token=ychodn1421823030', //任务执行的url
            'priority':0, // 优先级（0 ~ 2^32）数值越低，优先级越高
            'sendTime':0, // 发送时间戳（精确到秒），如果数值为0，表示立即执行
            'timeout':60, // 超时时间（单位：秒）
            'retry':6, // 重试次数
            'payload':payloads[i] 
        }
    }
    return tasks;
};

var producer = function(payloads, callback){
    var tasks = generate_tasks(payloads);
    if(tasks.length <= 0) callback(null, null);

    var options = {
      uri: 'http://localhost:9876/api/producer/',
      method: 'POST',
      json: {
        'queue_name': 'weixin',
        'tasks': tasks
      }
    };
    request.post(options, function(error, response, body){
        if (!error && response.statusCode == 200) {
            if (body && body.ret === 0){
                return callback(null, '添加任务成功');
            }
        }

        return callback('添加任务失败', null);
        }
    );
};

exports.producer = producer;


if (!module.parent) {
    var payloads = [
        {
            'open_id': 'oiZvSjlKhNvj88z22xPq0HjpvR0o',
            'template_id':'ocNRuyE18pUjJ95PACenUpLr96nD6FeeQeDFdCXCcf0',
            'url':'http://www.baidu.com',
            'data':{
                'first':{
                    'value':'亲爱的用户,您有优惠券即将过期',
                    'color':'#0A0A0A'
                },
                'orderTicketStore':{
                    'value':'asdasd',
                    'color':'#0A0A0A'
                },
                'orderTicketRule':{
                    'value':'remark',
                    'color':'#0A0A0A'
                },
                'remark':{
                    'value':'remark',
                    'color':'#0A0A0A'
                }
            }
        },
        {
            'open_id': 'oiZvSjlKhNvj88z22xPq0HjpvR0o',
            'template_id':'ocNRuyE18pUjJ95PACenUpLr96nD6FeeQeDFdCXCcf0',
            'url':'http://www.baidu.com',
            'data':{
                'first':{
                    'value':'亲爱的用户,您有优惠券即将过期',
                    'color':'#0A0A0A'
                },
                'orderTicketStore':{
                    'value':'asdasd',
                    'color':'#0A0A0A'
                },
                'orderTicketRule':{
                    'value':'remark',
                    'color':'#0A0A0A'
                },
                'remark':{
                    'value':'remark',
                    'color':'#0A0A0A'
                }
            }
        },
        {
            'open_id': 'oiZvSjlKhNvj88z22xPq0HjpvR0o',
            'template_id':'ocNRuyE18pUjJ95PACenUpLr96nD6FeeQeDFdCXCcf0',
            'url':'http://www.baidu.com',
            'data':{
                'first':{
                    'value':'亲爱的用户,您有优惠券即将过期',
                    'color':'#0A0A0A'
                },
                'orderTicketStore':{
                    'value':'asdasd',
                    'color':'#0A0A0A'
                },
                'orderTicketRule':{
                    'value':'remark',
                    'color':'#0A0A0A'
                },
                'remark':{
                    'value':'remark',
                    'color':'#0A0A0A'
                }
            }
        },
    ];
    producer(payloads, function(err, result){
        console.log(err, result);
    });
}