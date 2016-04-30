var User = require("./lib/user");
var session = require('express-session')

module.exports = function (config) {
    
    config.routeHelpers(function (rh) {
        rh.getUser(function (req, cb) {
            // this may involve database code or other
            // things... in this case, a user object
            var userCookie = req.cookies[req.ApplicationCookies.LoginCookie];
            User.loginFromCookie(userCookie, function (err, user) {
                cb(null, user);
            });
        });
        
        rh.notAuthorized(function (req, res, next) {
            //res.redirect("/?alert=you are not authorized!");
            res.redirect('/dashboard');
        });
        
        rh.notAuthenticated(function (req, res, next) {
            //res.redirect("/?alert=you must log in first!");
            res.redirect('/');
        });
    });
    
    config.userIdentity(function (id) {
        id.isAuthenticated(function (user, cb) {
            
            // you may have real logic here to check if someone
            // is logged in or not. maybe this hits a database
            // or does something else...
            //var user = req.cookies[req.ApplicationCookies.LoginCookie];
            var isAuthenticated = !!user;
            return cb(null, isAuthenticated);

        });
    });
    
    config.activities(function (activities) {
        
        activities.can("admin", function (identity, params, cb) {
            // now check if you're an admin. this may involve database
            // calls or other service calls.
            var user = identity.user;
            var isAdmin = (user.roles.indexOf("admin") > -1);
            cb(null, isAdmin);
        });
    });

};