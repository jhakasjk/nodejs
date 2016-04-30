var dbhelper = require('./dbhelper.js')
var common = require('./common.js')
var session = require('express-session')

//function SaveErrorLog(Message, CompleteError, IP, URL) {
SaveEventLog = function (UserID, Area, Data, IP, URL, callback) {
    // Log Error Into Database     
    var EventLogID = 0;
    var sql = dbhelper.sql;
    var conn = new sql.Connection(dbhelper.config);
    conn.connect().then(function () {
        // Stored Procedure 
        var request = new sql.Request(conn);
        request.input('UserID', sql.BigInt, UserID);
        request.input('Area', sql.VarChar(50), Area);
        request.input('IP', sql.VarChar(20), IP);
        request.input('URL', sql.VarChar(200), URL);
        request.input('Data', sql.VarChar(8000), Data);
        request.execute('SaveEventLog', function (err, recordset, returnValue) {
            if (!err && recordset[0][0].ValidationCode == null) {
                EventLogID = recordset[0][0].EventLogID;
            } else {

            }
            //return ErrorLogID;
            return callback(EventLogID);
        });
    });
}

exports.SaveEventLog = SaveEventLog;