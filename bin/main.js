var pm2 = require('pm2');
var async = require('async');
var config = require('../config/config');
var queues = config.get("queues");

// start
var start = function(callback){
  async.waterfall([
      function(next){
         pm2.connect(next);
      },      
      function(next){
         startServer(next);
      },
      function(proc, next){
        startWorkers(next);
      }
      ],function(err, result){
        pm2.disconnect(callback);
      }
  );
};

var startWorkers = function(callback){
  var keys = Object.keys(queues);
  async.map(keys, startOne, callback);
};

var startOne = function(key, callback){
  var args = queues[key];
  if(!args) {return callback(null, null);}
  pm2.start(
    __dirname+'/worker.js', 
    { name: args.queue_name, instances: args.concurrency, force:true, scriptArgs:['-q '+args.queue_name], executeCommand:true}, 
    callback
  );
};

var startServer = function(callback){
  pm2.start(__dirname+'/../app.js', {name: 'server'}, callback);
};

// kill
var kill = function(callback){
    async.waterfall([
      function(next){
         pm2.connect(next);
      },
      function(next){
        pm2.killDaemon(next);
      }
      ],function(err, result){
        callback(null, null);
        //pm2.disconnect(callback);
      }
  );
};

var main = function(){
  async.waterfall([
    function(next){
      console.log('###kill');
      kill(next);
    },
    function(proc, next){
      console.log('###start server & workers');
      start(next);
    }
    ],function(err, result){
      console.log('###result');
      process.exit(0);
    }
  );
};

module.exports = {
  startOne: startOne
};

// only run when `node main.js`
if (!module.parent) {
    main();
}


