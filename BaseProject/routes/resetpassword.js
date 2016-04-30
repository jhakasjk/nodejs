var express = require('express');
var dbhelper = require('./dbhelper.js');
var common = require('./common.js');
var session = require('express-session');
var Enumerable = require('linq');
var mustBe = require('mustbe').routeHelpers();

var router = express.Router();

router.get('/', mustBe.authenticated(), function (req, res) {
    var abs = session.Employers;
    var sealedLogin = req.cookies[req.ApplicationCookies.LoginCookie];
    iron.unseal(sealedLogin, req.Security.CookiePassword, iron.defaults, function (serr, unsealed) {
        if (!serr) {
            var options = { cache: true , title: 'Reset Password', session: session, user: unsealed, SupportUser: unsealed.SupportUser };
            res.send(jade.renderFile(req.rootpath + '/login/resetpassword.jade', options));
        }
    });
    //res.render('login/resetpassword', { title: 'Reset Password'});
});

router.post('/updatepwd', mustBe.authenticated(), function (req, res) {
    var CorpID = req.body.corpid;
    var EmpID = req.body.empid;
    var LoginCookie = req.cookies[req.ApplicationCookies.LoginCookie];
    var LoginUser = {};
    if (LoginCookie != null && LoginCookie != undefined && LoginCookie != '') {
        iron.unseal(LoginCookie, req.Security.CookiePassword, iron.defaults, function (err, unsealed) {
            LoginUser = unsealed;
            //if (session.Employee != null && session.Employee != undefined && session.Employee != '') {
            // Configure database settings as per corp id  st_GetEmployee
            var Employers = session.Employers;
            var Employer = Enumerable.from(Employers)
                                     .where(function (x) { return x.CorpId == LoginUser.CorpId.toLowerCase() })
                                     .firstOrDefault();
            if (Employer != undefined && Employer != null && Employer != '') {
                // Hit database to get employer details
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
                    var request = new sql.Request(conn);
                    request.input('EmployeeID', sql.BigInt, EmpID);
                    request.input('EmployerID', sql.Int, CorpID);
                    request.input('NewPassword', sql.VarChar(50), req.ChangeEmployer.DefaultPWD);
                    request.input('UserId', sql.BigInt, 1);
                    request.output('Status', sql.Int, 0);
                    request.output('ErrorMessage', sql.VarChar(500), '')
                    request.execute('ResetPassword', function (err, recordset, returnValue) {
                        if (!err) {
                            req.ActionOutput.Status = req.ActionStatus.Success;
                            req.ActionOutput.Message = 'Password Reset Successfully';
                            res.send(JSON.stringify(req.ActionOutput));
                        }
                        else {
                            req.ActionOutput.Status = req.ActionStatus.Error;
                            req.ActionOutput.Message = request.parameter.ErrorMessage != null ? request.parameter.ErrorMessage.value : recordset[0][0].ValidationCode;
                            res.send(JSON.stringify(req.ActionOutput));
                        }
                    });
                }).catch(function (err) {
                    // ... error checks 
                    ErrorHandler.SaveErrorLog(LoginUser.EmployeeID, err.message, err.stack, req.connection.remoteAddress , req.url, function (ErrorLogID) {
                        req.ActionOutput.Status = req.ActionStatus.Error;
                        //req.ActionOutput.Message = err.message;
                        req.ActionOutput.Message = 'ErrorID: ' + ErrorLogID + '. System Error ';
                        res.send(JSON.stringify(req.ActionOutput));
                    });
                });
            }
        });
    }
});




module.exports = router;