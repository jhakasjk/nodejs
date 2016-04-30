var iron = require('iron');
var common = require('../routes/common.js')

function User(loginSealed) {
    this.user = {};
    //iron.unseal(loginSealed, common.Security.CookiePassword, iron.defaults, function (err, unsealed) {
    //    if (!err) {
    //        this.user = unsealed;

    //    }
    //});    
};

User.loginFromCookie = function (loginSealed, cb) {
    // this would involve database logic to convert a cookie id
    // in to a user object, most likely. i'm just hard coding it
    // for demo purposes
    var user;
    var supportuser;
    if (loginSealed) {
        iron.unseal(loginSealed, common.Security.CookiePassword, iron.defaults, function (err, unsealed) {
            if (!err) {
                user = unsealed;
                cb(null, user);
            } else {
                cb(null, user, null);
            }
        });
    }
};

module.exports = User;