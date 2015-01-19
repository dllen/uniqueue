uniqueue
===========

# Quick Start

Preinstall:

  install and run [beanstalkd](http://kr.github.io/beanstalkd/)

Get the Code:

	git clone https://github.com/yijingping/uniqueue.git

Install dependent library:

	cd uniqueue
	npm install
	npm install pm2 -g

Set configuration:

	cp config/config-example.js config/config.js
	// edit `config/config.js` with your own settings

	cp config/config-example.json config/config.json
	// edit `config/config.json` with your own settings

Run:

	node bin/main.js

Forward [http://localhost:9876/producer](http://localhost:9876/producer) to produce some jobs.

Then the consumer will call [http://localhost:9876/consumer/weixin](http://localhost:9876/consumer/weixin) to excute job.

See [http://localhost:9876/server](http://localhost:9876/server) for the queue status.
