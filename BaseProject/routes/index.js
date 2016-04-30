var express = require('express');
var dbhelper = require('./dbhelper.js');
var session = require('express-session');
var Enumerable = require('linq');
var mustBe = require('mustbe').routeHelpers();
var jade = require('jade');
var iron = require('iron');
var ErrorHandler = require('./ErrorHandler.js')

var router = express.Router();

/* Logout action. */
router.get('/logout', mustBe.authenticated(), function (req, res) {
    var LoginCookie = req.cookies[req.ApplicationCookies.LoginCookie];
    if (LoginCookie != undefined) {
        res.cookie(req.ApplicationCookies.LoginCookie, null, { expires: new Date(Date.now() - 1000), httpOnly: true });
        res.redirect('/');
    }
});


/* GET home page. */
router.get('/', function (req, res) {
    //res.render('login/index', { title: 'Express' });    
    var options = { cache: true , title: 'Express' };
    res.send(jade.renderFile(req.rootpath + '/views/login/index.jade', options));
});

// main login action
router.post('/login', function (req, res) {
    var user = {
        CorpID: req.body.CorpID,
        Login: req.body.LoginID,
        Password: req.body.Password
    };
    // Configure database settings as per corp id
    var Employers = session.Employers;
    var Employer = Enumerable.from(Employers)
                             .where(function (x) { return x.CorpId == user.CorpID.toLowerCase() })
                             .firstOrDefault();
    if (Employer != undefined && Employer != null && Employer != '') {
        var empConfig = {
            user: Employer.User,
            password: Employer.Password,
            server: Employer.Server, // You can use 'localhost\\instance' to connect to named instance 
            database: Employer.Database,
            options: {
                encrypt: false // Use this if you're on Windows Azure 
            }
        }
        
        var sql = req.db;
        var conn = new sql.Connection(empConfig);
        conn.connect().then(function () {
            // Stored Procedure 
            var request = new sql.Request(conn);
            request.input('Company', sql.VarChar(50), user.CorpID);
            request.input('LoginId', sql.VarChar(50), user.Login);
            request.input('Password', sql.VarChar(50), user.Password);
            request.input('IP', sql.VarChar(50), req.ip);
            request.input('Application', sql.VarChar(50), 'PMT');
            request.input('PayrollNumber', sql.VarChar(50), '');
            request.input('RefUrl', sql.VarChar(50), '');
            request.output('Status', sql.Int, -1);
            request.output('ValidationMessage', sql.VarChar(500));
            
            request.execute('ValidateLogin', function (err, recordset, returnValue) {
                if (!err && recordset[0][0].ValidationCode == null) {
                    var LoggedinEmployee = {
                        EmployeeID : recordset[0][0].EmployeeId,
                        EmployerID : recordset[0][0].EmployerId,
                        EmployerName : recordset[0][0].EmployerName,
                        AccountName : Employer.AccountName,
                        EmpLevel : recordset[0][0].EmpLevel,
                        EmployeeName : recordset[0][0].EmployeeName,
                        CorpId: recordset[0][0].CorpID,
                        Login: user.Login,
                        Password: user.Password
                    };
                    iron.seal(LoggedinEmployee, req.Security.CookiePassword, iron.defaults, function (err, sealed) {
                        if (!err) {
                            res.cookie(req.ApplicationCookies.LoginCookie, sealed, { expires: new Date(Date.now() + 9999999), httpOnly: true, ephemeral: true });
                            req.ActionOutput.Status = req.ActionStatus.Success;
                            req.ActionOutput.Message = 'Logged In. Redirecting to dashboard...';
                            res.send(JSON.stringify(req.ActionOutput));
                        } else {
                            req.ActionOutput.Status = req.ActionStatus.Error;
                            req.ActionOutput.Message = 'System Error';
                            res.send(JSON.stringify(req.ActionOutput));
                        }
                    });
                } else {
                    req.ActionOutput.Status = req.ActionStatus.Error;
                    req.ActionOutput.Message = recordset[0][0].ValidationCode;
                    res.send(JSON.stringify(req.ActionOutput));
                }
            });
        }).catch(function (err) {
            // ... error checks 
            ErrorHandler.SaveErrorLog(null, err.message, err.stack, req.connection.remoteAddress , req.url, function (ErrorLogID) {
                req.ActionOutput.Status = req.ActionStatus.Error;
                //req.ActionOutput.Message = err.message;
                req.ActionOutput.Message = 'ErrorID: ' + ErrorLogID + '. Unable to connect with ' + user.CorpID;
                res.send(JSON.stringify(req.ActionOutput));
            });
        });
    } else {
        req.ActionOutput.Status = req.ActionStatus.Error;
        req.ActionOutput.Message = 'Company does not exists.';
        res.send(JSON.stringify(req.ActionOutput));
    }
});

router.get('/error/:message?', function (req, res) {
    // Redirect to Error Page
    var options = { cache: true , title: 'Application Error', error: err };
    res.send(jade.renderFile(req.rootpath + '/views/shared/error.jade', options));
});

module.exports = router;