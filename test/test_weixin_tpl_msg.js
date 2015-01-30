var request = require('request');
var producer = function(callback){
	var taskUrl = 'http://localhost:9876/api/consumer/test_weixin_tpl_msg';
	//var taskUrl = 'http://wxstage.sephora.cn/index.php?g=Interface&m=Message&a=tplSend&token=ychodn1421823030';
    var data = {
        'open_id': 'oiZvSjlKhNvj88z22xPq0HjpvR0o',
        'template_id':'ocNRuyE18pUjJ95PACenUpLr96nD6FeeQeDFdCXCcf0',
        'url':'http://www.baidu.com',
        'data':JSON.stringify({
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
        })
    };
    var task = {
        'taskUrl':taskUrl, //任务执行的url
        'priority':0, // 优先级（0 ~ 2^32）数值越低，优先级越高
        'sendTime':0, // 发送时间戳（精确到秒），如果数值为0，表示立即执行
        'timeout':60, // 超时时间（单位：秒）
        'retry':0, // 重试次数
        'data':data
    }; 

    var tasks = [task];
    var producer_url = 'http://localhost:9876/api/producer/';
    var producer_data = {
        'queue_name':'weixin',
        'tasks':JSON.stringify(tasks)
    };

	request.post({url: producer_url, form: producer_data}, function(error,response,body){
		if (!error && response.statusCode == 200) {
			try {
				res = JSON.parse(body);
			}catch (e) {
				return callback('添加任务失败', null);
			}
		    if (res.ret === 0){
		    	return callback(null, '添加任务成功');
		    }
		}

		return callback('添加任务失败', null);
		}
	);
};
producer(function(err, result){
	console.log(err, result);
});