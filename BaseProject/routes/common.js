// Action Status Enum
var ActionStatus = {
    Success: 1,
    Error: 2
}

var PagingParameter = {
    PageSize: 10
}

// Action Return Type
var ActionOutput = {
    ID: 0,
    Status: ActionStatus.Error,
    Data: {},
    Message: '',
    Results: []
}

var ChangeEmployer = {
    Login : 'abc',
    Password : 'abc',
    DefaultPWD : 'abc'
}

var ApplicationCookies = {
    LoginCookie: '324jk2h4jkh2j323jk4h2'
}

var Security = {
    CookiePassword: '$$$673221nb42j3hg4124jjh312f4h#%^#%'
}

var Constants = {
    Anonymous: 'Without Login',
    User : 'Normal Login'
}

exports.ActionStatus = ActionStatus;
exports.ActionOutput = ActionOutput;
exports.ApplicationCookies = ApplicationCookies;
exports.Security = Security;
exports.Constants = Constants;
exports.PagingParameter = PagingParameter;
