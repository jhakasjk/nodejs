var express = require('express');
var session = require('express-session');
var Enumerable = require('linq');
var mustBe = require('mustbe').routeHelpers();
var jade = require('jade');
var iron = require('iron');

var router = express.Router();

/* GET dashboard page. */
router.get('/', mustBe.authenticated(), function (req, res) {
    var loginSealed = req.cookies[req.ApplicationCookies.LoginCookie];
    iron.unseal(loginSealed, req.Security.CookiePassword, iron.defaults, function (err, unsealed) {
        if (!err) {
            var options = { cache: true , title: 'Dashboard', session: session, user: unsealed, SupportUser: unsealed.SupportUser };
            res.send(jade.renderFile(req.rootpath + '/views/dashboard/dashboard.jade', options));
        }
    });
});

module.exports = router;