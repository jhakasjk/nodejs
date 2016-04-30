// Packages
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dbhelper = require('./routes/dbhelper.js')
var common = require('./routes/common.js')
var session = require('express-session')
var iron = require('iron');
var ErrorHandler = require('./routes/ErrorHandler.js')
var EventLogger = require('./routes/EventLogger.js')

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
//app.locals.basedir = path.join(__dirname, 'views');

// set up mustbe config
var mustBe = require("mustbe");
var mustBeConfig = require("./mustBeConfig");
mustBe.configure(mustBeConfig);

// Routes
var routes = require('./routes/index');
var users = require('./routes/users');
var dashboard = require('./routes/dashboard');
var resetpassword = require('./routes/resetpassword');

app.locals.moment = require('moment');

app.use(function (req, res, next) {
    res.locals.session = session;
    next();
});


// Make database connection available to router
app.use(function (req, res, next) {
    req.rootpath = __dirname;
    req.db = dbhelper.sql;
    req.config = dbhelper.config;
    req.ActionOutput = common.ActionOutput;
    req.ActionStatus = common.ActionStatus;
    req.ChangeEmployer = common.ChangeEmployer;
    req.ApplicationCookies = common.ApplicationCookies;
    req.LoggedinEmployee = common.LoggedinEmployee;
    req.Security = common.Security;
    req.Constants = common.Constants;
    req.PagingParameter = common.PagingParameter;
    
    // Redirect to login page if no login cookie found
    var cookie = req.cookies[common.ApplicationCookies.LoginCookie];
    if (cookie == undefined && (req.url != '/' && req.url != '' && req.url != '/login' && req.url != '/error'))
        res.redirect('/');
    else if (cookie != undefined && (req.url == '/' || req.url == '' || req.url == '/login'))
        res.redirect('/dashboard');
    else {
        var LoginCookie = req.cookies[req.ApplicationCookies.LoginCookie];
        var LoginUser = {};        
        if (LoginCookie != null && LoginCookie != undefined && LoginCookie != '') {
            //if (session.Employee != null && session.Employee != undefined && session.Employee != '') {
            // Configure database settings as per corp id
            iron.unseal(LoginCookie, req.Security.CookiePassword, iron.defaults, function (err, LoginUser) {
                // Log this event
                var UserID = 0, Area = '';
                if (LoginUser.SupportUser == null) {
                    UserID = LoginUser.EmployeeID;
                    Area = common.Constants.User;
                }
                EventLogger.SaveEventLog(UserID, Area , JSON.stringify(req.body), req.connection.remoteAddress, req.url , function (EventID) {
                    next();
                });
            });
        } else {
            EventLogger.SaveEventLog(null, common.Constants.Anonymous, JSON.stringify(req.body), req.connection.remoteAddress, req.url , function (EventID) {
                next();
            });
        }
    }
});



app.use('/', routes);
app.use('/users', users);
app.use('/dashboard', dashboard);
app.use('/resetpassword', resetpassword);

process.on('uncaughtException', function (err, abc) {
    console.log('Caught exception: ' + err.message);
    ErrorHandler.SaveErrorLog(null, err.message, err.stack, 'IP' , err.address, function () {
    });
});


app.use(function (err, req, res, next) {
    if (!err)
        return next();
    var LoginCookie = req.cookies[req.ApplicationCookies.LoginCookie];
    if (LoginCookie != null && LoginCookie != undefined && LoginCookie != '') {
        iron.unseal(LoginCookie, req.Security.CookiePassword, iron.defaults, function (err, LoginUser) {
            var UserID = LoginUser.EmployeeID;
            ErrorHandler.SaveErrorLog(err.message, err.stack, req.connection.remoteAddress , err.path);
            // Check if request is ajax
            var is_ajax_request = req.xhr;
            if (is_ajax_request) {
                req.ActionOutput.Status = common.ActionStatus.Error;
                req.ActionOutput.Message = err.message;
                res.send(JSON.stringify(req.ActionOutput));
            } else {
                // Redirect to Error Page
                var options = { cache: true , title: 'Application Error', error: err };
                res.send(jade.renderFile(req.rootpath + '/views/shared/error.jade', options));
            }
        });
    } else {
        ErrorHandler.SaveErrorLog(null, err.message, err.stack, req.connection.remoteAddress , err.path);
        // Check if request is ajax
        var is_ajax_request = req.xhr;
        if (is_ajax_request) {
            req.ActionOutput.Status = common.ActionStatus.Error;
            req.ActionOutput.Message = err.message;
            res.send(JSON.stringify(req.ActionOutput));
        } else {
            // Redirect to Error Page
            var options = { cache: true , title: 'Application Error', error: err };
            res.send(jade.renderFile(req.rootpath + '/views/shared/error.jade', options));
        }
    }
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('shared/error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('shared/error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

app.listen(8080, function () {
    console.log('Server starts on port: ' + 8080);
});