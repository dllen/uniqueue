/* jshint -W079 */

var nconf = require('nconf');

nconf
  .file({ file: __dirname+'/config.json' })
  .env();

nconf.defaults({
  'ENVIRONMENT': 'production',
  // web server
  'HTTP_SERVER': true, // Serve http/json api
  'PORT': 9876, // Port of http api server
  'HOST': '0.0.0.0',  

});

module.exports = nconf;