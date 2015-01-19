#!/usr/bin/env node
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config');


var app = express();

// view engine setup
// app.set('views', path.join(__dirname, '/views'));
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /static
//app.use(favicon(__dirname + '/static/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, '/static')));

/*************************************************
    import new modles here
 *************************************************/

var routes = require('./apps/producer/index');
app.use('/producer', routes);

var routes = require('./apps/server/index');
app.use('/server', routes);

var routes = require('./apps/consumer/index');
app.use('/consumer', routes);


/*************************************************/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

module.exports = app;

// start app
if (require.main === module) {
    var debug = require('debug')('app');
    var port = config.get("PORT");
    var host = config.get("HOST");
    app.set('port', port);
    var server = app.listen(port, host, function() {
      debug('Express server listenindg on port ' + server.address().port);
    });
}