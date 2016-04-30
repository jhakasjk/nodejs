var session = require('express-session')
var to = require('to-case');

// Database connection
var sql = require('mssql');

var config = {
    user: 'abc',
    password: 'abc',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance 
    database: 'abcdb',
    options: {
        encrypt: false // Use this if you're on Windows Azure 
    }
}

// Get All Employers and store in session
if (session.Employers == undefined || session.Employers == null || session.Employers == '') {
    var sql = sql;
    sql.connect(config).then(function () {
        // Stored Procedure 
        var request = new sql.Request();
        //request.input('UserID', sql.Int, id);
        //request.output('output_parameter', sql.VarChar(50));
        request.execute('usp_getAllCompanies', function (err, recordset, returnValue) {
            // ... error checks 
            if (err) {
                console.log('Error: ' + err.message);
                return false;
            }
            var allEmployers = JSON.parse(recordset[0][0].EmployerJson);
            allEmployers.forEach(function (item) {
                item.AccountName = to.title(item.AccountName);
            });
            
            session.Employers = allEmployers;
            sql.close();
        });
        sql.on('error', function (err) {
	// ... error handler 
        });
    }).catch(function (err) {
        // ... error checks 
        ErrorHandler.SaveErrorLog(err.message, err.stack, 'IP' , err.path);        
    });

}

exports.sql = sql;
exports.config = config;