var dbhelper = require('./dbhelper.js')
var common = require('./common.js')
var session = require('express-session')

//function SaveErrorLog(Message, CompleteError, IP, URL) {
SaveErrorLog = function (UserID, Message, CompleteError, IP, URL, callback) {    
    // Log Error Into Database 
    var ErrorLogID = 0;
    var sql = dbhelper.sql;
    var conn = new sql.Connection(dbhelper.config);
    conn.connect().then(function () {
        // Stored Procedure 
        var request = new sql.Request(conn);
        request.input('UserID', sql.BigInt, UserID);
        request.input('Message', sql.VarChar(500), Message);
        request.input('CompleteError', sql.VarChar(2000), CompleteError);
        request.input('IP', sql.VarChar(50), IP);
        request.input('URL', sql.VarChar(50), URL);
        request.execute('SaveErrorLog', function (err, recordset, returnValue) {
            if (!err && recordset[0][0].ValidationCode == null) {
                ErrorLogID = recordset[0][0].ErrorLogID;
            } else {

            }
            //return ErrorLogID;
            return callback(ErrorLogID);
        });
    });
}

exports.SaveErrorLog = SaveErrorLog;