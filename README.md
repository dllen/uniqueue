uniqueue
===========

# Quick Start

Preinstall:
	
install and run [beanstalkd](http://kr.github.io/beanstalkd/) in persistent mode ( `beanstalkd -b /path/to/log_dir` ).

Get the Code:

	git clone https://github.com/yijingping/uniqueue.git

Install dependent library:

	cd uniqueue
	npm install
	bower install

Set configuration:

	cp config/config-example.js config/config.js
	// edit `config/config.js` with your own settings

	cp config/config-example.json config/config.json
	// edit `config/config.json` with your own settings

Run:

	npm start	

Forward [http://localhost:9876/api/producer](http://localhost:9876/api/producer) to produce some jobs.

Then the consumer will call [http://localhost:9876/api/consumer/api/weixin](http://localhost:9876/consumer/weixin) to excute job.

See [http://localhost:9876](http://localhost:9876) to check the queue status.

![manual image](../blob/master/static/images/about.png?raw=true  =600x)

# Document
* __producer__

	客户端向这个接口发送tasks。
	
	URL: http://localhost:9876/api/producer
	
	METHOD: POST
	
	PARAMS:
		
		queue_name: 队列名称，如weixin
		tasks: 任务（TASK的数组），如：[TASK1, TASK2, TASK3, ...]。 必须序列化为字符串（JSON.stringify([TASK1, TASK2, TASK3, ...])）
		
	TASK:
	
		{
			taskUrl:'http://localhost:9876/api/consumer/weixin', //任务执行的url
			priority:0, // 优先级（0 ~ 2^32）数值越低，优先级越高
			sendTime:0, // 发送时间戳（精确到秒），如果数值为0，表示立即执行
			timeout:60, // 超时时间（单位：秒）
			retry:0, // 重试次数
			data:{to:'bob', msg:'新年快乐1'} // Post给taskUrl的数据，会以form格式提交
		},

	RETURN：
	
		错误返回：{ret:1, message:'添加失败！'}
		正确返回：{ret:0, message:'添加成功！'}

* __server__
	
	通过界面查看队列的当前状态，并且可以增加、修改、删除队列。（我们也提供了对应的api，但还是推荐使用界面配置）
	
	URL: http://localhost:9876/
	
* __consumer__

	处理task的http接口。（该接口应由用户自己实现，本框架只是提供了一个demo，方便用户调试）
	
	URL: http://localhost:9876/api/consumer/weixin
	
    METHOD: POST
	
	PARAMS: 
	
		// 数据字段和Task中的data一致
		to:'bob'
		msg:'新年快乐1'
	
	RETURN:
	
		错误返回：{ret:1, message:'处理失败！'}
  		正确返回：{ret:0, message:'处理成功！'}
  		如果超时未返回，或者返回ret不等于0，会被当做失败处理。
		

# Roadmap
* 权限管理
* 监控报警
